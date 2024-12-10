<script lang="ts">
    let dbg=false;
    dbg&&console.group('%c'+'map_daerah.svelte', 'color:magenta');

    import * as d3 from 'd3';
    import { Chart, Svg, GeoPath, Legend, Tooltip } from 'layerchart';

    import type { PageData } from './$types';
    export let data: PageData;

    console.log('data', data);

    import { geoMercator } from 'd3-geo';
    import { feature, merge } from 'topojson-client';
    import type { Feature, FeatureCollection, Geometry } from 'svelte/geojson';
    import * as turf from '@turf/turf';


    interface DaerahProperties {
        negeri: string;
        daerah: string;
        key?: string;
        data?: any;
    }

    interface DaerahFeature extends Feature<Geometry, DaerahProperties> {}
    interface DaerahFeatureCollection extends FeatureCollection<Geometry, DaerahProperties> {}

    const objectKey = 'mas_subdistrict_01';
    let geojson: DaerahFeatureCollection;
    
    // Function to shift coordinates based on longitude
    const shiftCoordinates = (coordinates: number[], shift: number = -5): number[] => {
        const [lon, lat] = coordinates;
        return lon > 106 ? [lon + shift, lat] : [lon, lat];
    };

    //-------------------------------------------------------------------------
    // Function to transform geometry coordinates
    //-------------------------------------------------------------------------
    const transformGeometry = (geometry: any): any => {
        if (!geometry) return geometry;

        const transform = (coords: any[]): any => {
            if (typeof coords[0] === 'number') {
                return shiftCoordinates(coords);
            }
            return coords.map(transform);
        };

        return {
            ...geometry,
            coordinates: transform(geometry.coordinates)
        };
    };

    //-------------------------------------------------------------------------
    // Create a clean copy of the GeoJSON data with transformed coordinates
    //-------------------------------------------------------------------------

    const mapGeoDaerah2Daerah: string[][] = [
        ['Manjung (Dinding)', 'Manjung'],
    ];

    const rawGeoJson = feature(data.topojson_daerah, data.topojson_daerah.objects[objectKey]);
    geojson = {
        type: "FeatureCollection",
        features: rawGeoJson.features.map(feature => {
            // Ensure properties exist
            feature.properties = feature.properties || {};
            feature.properties.daerah = feature.properties.daerah || '';
            feature.properties.negeri = feature.properties.negeri || '';

            // Safely find and map daerah
            const mappedDaerah = mapGeoDaerah2Daerah.find(d => d[0] === feature.properties?.daerah);
            if (mappedDaerah) {
                feature.properties.daerah = mappedDaerah[1];
            }

            return {
                ...feature,
                geometry: transformGeometry(feature.geometry),
                properties: {
                    ...feature.properties,
                    key: `${feature.properties.negeri}-${feature.properties.daerah}`.toLowerCase()
                }
            };
        })
    };

    dbg&&console.log('geojson', geojson);

    //-------------------------------------------------------------------------
    // Add properties without creating circular references
    //-------------------------------------------------------------------------
    // geojson.features = geojson.features.map(feature => ({
    //     ...feature,
    //     properties: {
    //         ...feature.properties,
    //         key: (feature.properties.negeri+'-'+feature.properties.daerah).toLowerCase()
    //     }
    // }));

    interface GeoDaerah extends DaerahProperties {
        key: string;
    }

    let geoDaerah: GeoDaerah[] = d3.groups(geojson.features.map(d =>d.properties), d=>d.key)
        .map(d=>{
            let k = d[1][0];
            k.key = d[0];
            return k;
        });

    dbg&&console.log('geoDaerah', geoDaerah);

    interface CasesByDaerah {
        key: string;
        state: string;
        district: string;
        state_id: number;
        district_id: number;
        jumlah_mangsa: number;
        jumlah_pps: number;
        jumlah_keluarga: number;
        jumlah_kematian: number;
        longitude: number;
        latitude: number;
        updated_at: Date;
        geo?: GeoDaerah;
    }

    data.casesByDaerah.forEach((d: CasesByDaerah) => {
        d.key = (d.state+'-'+d.district).toLowerCase();
        d.geo = geoDaerah.find(k=>k.key==d.key);
    })

    dbg&&console.log('data.casesByDaerah match', data.casesByDaerah.filter(d=>d.geo));
    dbg&&console.log('data.casesByDaerah miss', data.casesByDaerah.filter(d=>!d.geo));
    if (data.casesByDaerah.filter(d=>!d.geo).length>0) {
        console.error('data.casesByDaerah missing geojson data', data.casesByDaerah.filter(d=>!d.geo));
    }

    geojson.features.forEach(d=>{
        d.properties.data = data.casesByDaerah.find(k=>k.key==d.properties.key);
    })

    dbg&&console.log('geojson', geojson);

    //-------------------------------------------------------------------------
    // Create state boundaries using topojson.merge with transformed coordinates
    //-------------------------------------------------------------------------
    const states = Array.from(new Set(geojson.features.map(f => f.properties.negeri)));
    const stateBoundaries = states.map(state => {
        const stateFeatures = data.topojson_daerah.objects[objectKey].geometries.filter(
            g => g.properties.negeri === state
        );
        const mergedGeometry = merge(data.topojson_daerah, stateFeatures);
        return {
            type: "Feature",
            properties: { negeri: state },
            geometry: transformGeometry(mergedGeometry)
        };
    });

    dbg&&console.log('stateBoundaries', stateBoundaries);

    //-------------------------------------------------------------------------
    // Create district boundaries using topojson.merge with transformed coordinates
    //-------------------------------------------------------------------------
    const daerahList = d3.groups(geojson.features, d=>d.properties.key)
        .map(d => d[1][0].properties );

    dbg&&console.log('daerahList', daerahList);

    const daerahBoundaries = daerahList.map(d => {
        const daerahFeatures = data.topojson_daerah.objects[objectKey].geometries.filter(
            g => g.properties.daerah === d.daerah
        );

        // console.log('daerahFeatures', daerahFeatures);
        const mergedGeometry = merge(data.topojson_daerah, daerahFeatures);
        return {
            type: "Feature",
            properties: d,
            geometry: transformGeometry(mergedGeometry)
        };
    });

    dbg&&console.log('daerahBoundaries', daerahBoundaries);

    let geojsonDaerah = turf.featureCollection(daerahBoundaries);

    // dbg&&console.log('geojsonDaerah', geojsonDaerah);

    //-------------------------------------------------------------------------
    // Create a color scale for the choropleth
    //-------------------------------------------------------------------------
    // Get domain values for the color scale
    const minValue = Math.max(1, d3.min(data.casesByDaerah, d => d.jumlah_mangsa) || 1);
    const maxValue = d3.max(data.casesByDaerah, d => d.jumlah_mangsa) || 1;

    let colorTheme = d3.interpolateOranges;       
    let colorScale = d3.scaleSequentialLog(colorTheme)
        .domain([minValue, maxValue]);

    // Create nice tick values for the legend
    const legendTicks = [0, ...d3.ticks(Math.log10(minValue), Math.log10(maxValue), 5)
        .map(d => Math.pow(10, d))];

    const formatNumber = (value) => {
        if (value >= 1000000) return d3.format('.1f')(value / 1000000) + 'M';
        if (value >= 1000) return d3.format('.1f')(value / 1000) + 'K';
        return d3.format('.0f')(value);
    };

    const getColor = (value) => {
        if (!value || value === 0) return '#ffffff4d';
        return colorScale(value);
    };

    import { onMount, onDestroy } from 'svelte';
    import { browser } from '$app/environment';
    
    let containerWidth: number;
    let containerHeight: number;
    let container: HTMLDivElement;

    function updateDimensions() {
        if (container && browser) {
            containerWidth = container.offsetWidth;
            containerHeight = Math.min(600, Math.max(300, containerWidth * 0.75)); // Responsive height
        }
    }

    onMount(() => {
        if (browser) {
            updateDimensions();
            window.addEventListener('resize', updateDimensions);
        }
    });

    onDestroy(() => {
        if (browser) {
            window.removeEventListener('resize', updateDimensions);
        }
    });


    dbg&&console.groupEnd('map_daerah.svelte');


    //https://www.layerchart.com/docs/examples/ZoomableMap


</script>

<div 
    bind:this={container} 
    class="w-full relative" 
    style="height: {containerHeight || 300}px"
>
    {#if geojson && containerWidth && containerHeight && browser}
        <Chart
            geo={{
                projection: geoMercator,
                fitGeojson: geojson,
                // applyTransform: ["translate", "scale"],
            }}
            transform={{
                // mode: "canvas",
                // mode: "svg",
                initialScrollMode: "scale",
            }}
            padding={{ top: 60 }}
            tooltip={{ raiseTarget: true }}
            width={containerWidth}
            height={containerHeight}
            let:tooltip
            let:transform
        >
            {@const strokeWidth = .1 / transform.scale}
            {@const stateStrokeWidth = .3 / transform.scale}

            <Svg>
                <!-- District fills -->
                <g>
                    {#each geojsonDaerah.features as feature}
                        <GeoPath
                            geojson={feature}
                            {tooltip}
                            fill={getColor(feature?.properties?.data?.jumlah_mangsa)}
                            class="stroke-none hover:stroke-white"
                            {strokeWidth}
                        />
                    {/each}
                </g>
                <!-- District boundaries -->
                <g>
                    {#each geojsonDaerah.features as feature}
                        <GeoPath
                            geojson={feature}
                            class="fill-none stroke-black/30 pointer-events-none"
                            {strokeWidth}
                        />
                    {/each}
                </g>
                <!-- State boundaries -->
                <g>
                    {#each stateBoundaries as feature}
                        <GeoPath
                            geojson={feature}
                            class="fill-none stroke-black pointer-events-none"
                            strokeWidth={stateStrokeWidth}
                        />
                    {/each}
                </g>
            </Svg>

            {#if containerWidth - 20 >= 320}
                <Legend
                    scale={colorScale}
                    title="Jumlah Mangsa"
                    tickValues={legendTicks}
                    tickFormat={formatNumber}
                    class="absolute bg-surface-100/80 px-2 py-1 backdrop-blur-sm rounded m-1"
                />
            {:else}
                <Legend
                    scale={colorScale}
                    title="Jumlah Mangsa"
                    tickValues={legendTicks}
                    tickFormat={formatNumber}
                    class="absolute bg-surface-100/80 px-2 py-1 backdrop-blur-sm rounded m-1"
                    width={containerWidth - 20}
                />
            {/if}


            <Tooltip.Root let:data>
                <Tooltip.Header>
                    {data.properties?.daerah} 
                </Tooltip.Header>
                <Tooltip.List>
                    <Tooltip.Item
                        label="Jumlah PPS"
                        value={data.properties.data?.jumlah_pps ?? 0}
                        format="integer"
                        valueAlign="right"
                    />
                    <Tooltip.Item
                        label="Jumlah Keluarga"
                        value={data.properties.data?.jumlah_keluarga ?? 0}
                        format="integer"
                        valueAlign="right"
                    />
                    <Tooltip.Item
                        label="Jumlah Mangsa"
                        value={data.properties.data?.jumlah_mangsa ?? 0}
                        format="integer"
                        valueAlign="right"
                    />
                </Tooltip.List>
            </Tooltip.Root>
        </Chart>
    {/if}
</div> 