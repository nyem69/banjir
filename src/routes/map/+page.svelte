<script lang="ts">
  import { onMount } from 'svelte';
  import { t } from '$lib/i18n';
  import mapboxgl from 'mapbox-gl';
  import 'mapbox-gl/dist/mapbox-gl.css';

  let map: mapboxgl.Map;
  let data: any[] = [];
  let loading = true;

  // Mapbox access token
  mapboxgl.accessToken = 'pk.eyJ1IjoibnllbSIsImEiOiJBZGdTcWYwIn0.Qodnwy5WNQVNB4Khe0Au-g';

  async function fetchData() {
    try {
      const [centersResponse, peninsulaResponse, borneoResponse] = await Promise.all([
        fetch('https://corsproxy.io/?https://infobencanajkmv2.jkm.gov.my/api/pusat-buka.php'),
        fetch('https://corsproxy.io/?https://infobencanajkmv2.jkm.gov.my/assets/data/malaysia/arcgis_district_semenanjung.geojson'),
        fetch('https://corsproxy.io/?https://infobencanajkmv2.jkm.gov.my/assets/data/malaysia/arcgis_district_borneo.geojson')
      ]);

      const [centers, peninsula, borneo] = await Promise.all([
        centersResponse.json(),
        peninsulaResponse.json(),
        borneoResponse.json()
      ]);

      data = centers;
      loading = false;

      // Initialize map with districts
      initMap(peninsula, borneo);
    } catch (error) {
      console.error('Error fetching data:', error);
      loading = false;
    }
  }

  function initMap(peninsula: any, borneo: any) {
    map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/light-v11',
      center: [101.6869, 3.1390], // Malaysia center
      zoom: 6
    });

    map.on('load', () => {
      // Add peninsula districts
      map.addSource('peninsula', {
        type: 'geojson',
        data: peninsula
      });

      map.addLayer({
        id: 'peninsula-districts',
        type: 'fill',
        source: 'peninsula',
        paint: {
          'fill-color': '#dbeafe',
          'fill-opacity': 0.5,
          'fill-outline-color': '#2563eb'
        }
      });

      // Add borneo districts
      map.addSource('borneo', {
        type: 'geojson',
        data: borneo
      });

      map.addLayer({
        id: 'borneo-districts',
        type: 'fill',
        source: 'borneo',
        paint: {
          'fill-color': '#dbeafe',
          'fill-opacity': 0.5,
          'fill-outline-color': '#2563eb'
        }
      });

      // Add evacuation centers
      const points = {
        type: 'FeatureCollection',
        features: data.map(center => ({
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [parseFloat(center.longitude), parseFloat(center.latitude)]
          },
          properties: {
            name: center.nama_pps,
            district: center.daerah,
            state: center.negeri,
            evacuees: center.jumlah_mangsa,
            families: center.jumlah_keluarga
          }
        }))
      };

      map.addSource('centers', {
        type: 'geojson',
        data: points
      });

      map.addLayer({
        id: 'centers',
        type: 'circle',
        source: 'centers',
        paint: {
          'circle-radius': [
            'interpolate',
            ['linear'],
            ['get', 'evacuees'],
            0, 5,
            1000, 20
          ],
          'circle-color': '#dc2626',
          'circle-opacity': 0.8
        }
      });

      // Add popups
      map.on('click', 'centers', (e) => {
        if (!e.features?.length) return;

        const coordinates = e.features[0].geometry.coordinates.slice();
        const props = e.features[0].properties;

        new mapboxgl.Popup()
          .setLngLat(coordinates)
          .setHTML(`
            <div class="p-2">
              <h3 class="font-bold">${props.name}</h3>
              <p>${props.district}, ${props.state}</p>
              <p>Evacuees: ${props.evacuees}</p>
              <p>Families: ${props.families}</p>
            </div>
          `)
          .addTo(map);
      });

      // Change cursor on hover
      map.on('mouseenter', 'centers', () => {
        map.getCanvas().style.cursor = 'pointer';
      });

      map.on('mouseleave', 'centers', () => {
        map.getCanvas().style.cursor = '';
      });
    });
  }

  onMount(() => {
    fetchData();
    return () => {
      if (map) map.remove();
    };
  });
</script>

<svelte:head>
  <title>{$t('app.title')} - Map</title>
</svelte:head>

{#if loading}
  <div class="text-center py-8 text-blue-600 text-lg">
    {$t('app.loading')}
  </div>
{:else}
  <div class="bg-white rounded-lg shadow overflow-hidden">
    <div id="map" class="w-full h-[600px]"></div>
  </div>
{/if}

<style>
  :global(.mapboxgl-popup-content) {
    @apply rounded-lg shadow-lg;
  }
</style>
