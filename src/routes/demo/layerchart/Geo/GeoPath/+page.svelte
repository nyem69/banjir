<script lang="ts">
    import type { PageData } from './$types';

    let { data }: { data: PageData } = $props();

    import { geoAlbersUsa } from 'd3-geo';
    import { feature } from 'topojson-client';

    import { Chart, GeoPath, Svg, Tooltip } from 'layerchart';
    // import { Canvas, Chart, GeoPath, HitCanvas, Svg, Tooltip } from 'layerchart';
    // import Preview from '$lib/docs/Preview.svelte';

    // export let data;
    const states = feature(data.geojson, data.geojson.objects.states);
    const counties = feature(data.geojson, data.geojson.objects.counties);    

</script>


<div class="h-[600px]">
    <Chart
      geo={{
        projection: geoAlbersUsa,
        fitGeojson: states,
      }}
      let:projection
      let:tooltip
    >
      <Svg>
        {#each states.features as feature}
          <GeoPath
            geojson={feature}
            {tooltip}
            class="stroke-surface-content fill-surface-100 hover:fill-surface-content/20"
          />
        {/each}
  
        <GeoPath
          geojson={counties}
          class="fill-none stroke-surface-content/20 pointer-events-none"
        />
      </Svg>
  
      <Tooltip.Root let:data>
        {@const [longitude, latitude] =
          projection.invert?.([tooltip.x, tooltip.y]) ?? []}
        <Tooltip.Header>{data.properties.name}</Tooltip.Header>
        <Tooltip.List>
          <Tooltip.Item label="longitude" value={longitude} format="decimal" />
          <Tooltip.Item label="latitude" value={latitude} format="decimal" />
        </Tooltip.List>
      </Tooltip.Root>
    </Chart>
  </div>

  
