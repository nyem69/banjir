<script lang="ts">
    import type { PageData } from './$types';
    import * as d3 from 'd3';
    import { Chart, Svg, GeoPath, Legend, Tooltip } from 'layerchart';

    let dbg=false;
    dbg&&console.group('%c'+'map.svelte', 'color:magenta');

    export let data: PageData;
    dbg&&console.log('data', data);


    import { geoMercator } from 'd3-geo';
    import { feature } from 'topojson-client';

    const objectKey = 'states';
    data.geojson = feature(data.topojson, data.topojson.objects[objectKey]);



    interface StateInfo {
        state_id: number;
        state: string;
        stateid: number;
    }

    const state_id2stateid: { [key: number]: StateInfo } = {
        1: { state_id: 1, state: 'Johor', stateid: 1},
        2: { state_id: 2, state: 'Kedah', stateid: 2},
        3: { state_id: 3, state: 'Kelantan', stateid: 3},
        4: { state_id: 4, state: 'Melaka', stateid: 4},
        5: { state_id: 5, state: 'Negeri Sembilan', stateid: 5},
        6: { state_id: 6, state: 'Pahang', stateid: 6},
        7: { state_id: 7, state: 'Perak', stateid: 7},
        8: { state_id: 8, state: 'Perlis', stateid: 8},
        9: { state_id: 9, state: 'Pulau Pinang', stateid: 9},
        10: { state_id: 10, state: 'Sabah', stateid: 12},
        11: { state_id: 11, state: 'Sarawak', stateid: 13},
        12: { state_id: 12, state: 'Selangor', stateid: 10},
        13: { state_id: 13, state: 'Terengganu', stateid: 11},
        14: { state_id: 14, state: 'WP Kuala Lumpur', stateid: 14},
        15: { state_id: 15, state: 'WP Labuan', stateid: 15},
        16: { state_id: 16, state: 'WP Putrajaya', stateid: 16},
    };

    (data.casesByStates||[]).forEach(d=>{
        d.stateid = state_id2stateid[d.state_id]?.stateid;
        if (d.stateid === undefined) {
            console.error(`No stateid found for state_id ${d.state_id}`);
        }
    });

    dbg&&console.log('data.casesByStates', data.casesByStates);

    /*
        [
            {
                "state": "Johor",
                "state_id": 1,
                "jumlah_mangsa": 0,
                "jumlah_pps": 0,
                "jumlah_keluarga": 0,
                "jumlah_kematian": 0,
                "updated_at": "2024-12-05T08:06:21.000Z",
                "stateid": 1
            }
        ]
    */  


    function _shift(d)  {
        if (typeof d=='object')	{
            if(d.length==2 && typeof d[0]=='number')  {
                //if (+d[0]>109.5438085) d[0] += -5;
                // if (+d[0]>104.55) d[0] += -5;
                if (+d[0]>106) d[0] += -5;
            }else	{
                d.forEach(d=>_shift(d));
            }
        }
        // return d;
    }

    data.geojson.features.forEach(d=>{
        _shift(d.geometry.coordinates);

        let k = (data.casesByStates||[]).find(k=>+k.stateid==+d.properties?.stateid);
        if (k) {
            d.properties.data = k;
        }else {
            d.properties.data = { jumlah_mangsa: 0 };
        }
    });







    let colorTheme =  d3.interpolateOranges;       
    let colorScale = d3.scaleSequential(colorTheme)
        .domain([0, d3.max((data.casesByStates||[]), d => d.jumlah_mangsa)]);

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



    dbg&&console.groupEnd('map.svelte');

</script>

<div 
    bind:this={container} 
    class="w-full relative" 
    style="height: {containerHeight || 300}px"
>
    {#if data.geojson && containerWidth && containerHeight && browser}
        <Chart
            geo={{
                projection: geoMercator,
                fitGeojson: data.geojson,
            }}
            transform={{
                mode: "canvas",
                interactive: false
            }}
            padding={{ top: 60 }}
            tooltip={{ raiseTarget: true }}
            width={containerWidth}
            height={containerHeight}
            let:tooltip
            let:transform
        >
            {@const strokeWidth = 2 / transform.scale}

            <Svg>
                <g>
                    {#each data.geojson.features as feature}
                        <GeoPath
                            geojson={feature}
                            {tooltip}
                            fill={colorScale(feature?.properties?.data?.jumlah_mangsa ?? 0)}
                            class="stroke-none hover:stroke-white"
                            {strokeWidth}
                        />
                    {/each}
                </g>
                <g>
                    {#each data.geojson.features as feature}
                        <GeoPath
                            geojson={feature}
                            class="fill-none stroke-black/30 pointer-events-none"
                            {strokeWidth}
                        />
                    {/each}
                </g>
            </Svg>

            <Legend
                scale={colorScale}
                title="Jumlah Mangsa"
                tickFormat={(d) => d3.format(",")(d)}
                class="absolute bg-surface-100/80 px-2 py-1 backdrop-blur-sm rounded m-1"
            />

            <Tooltip.Root let:data>
                <Tooltip.Header>
                    {data.properties?.id} {data.properties?.state} 
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