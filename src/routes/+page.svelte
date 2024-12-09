<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://svelte.dev/docs/kit">svelte.dev/docs/kit</a> to read the documentation</p>

<script lang="ts">
  import { onMount } from 'svelte';
  import { t } from '$lib/i18n';
  import * as d3 from 'd3';

  let data: any[] = [];
  let loading = true;

  async function fetchData() {
    try {
      const response = await fetch('https://corsproxy.io/?https://infobencanajkmv2.jkm.gov.my/api/data-dashboard-table-pps.php');
      const jsonData = await response.json();
      data = jsonData;
      loading = false;
    } catch (error) {
      console.error('Error fetching data:', error);
      loading = false;
    }
  }

  function createBarChart(data: any[]) {
    const margin = { top: 20, right: 20, bottom: 30, left: 40 };
    const width = 800 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    // Clear existing chart
    d3.select('#chart').selectAll('*').remove();

    const svg = d3.select('#chart')
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Process data
    const districtData = d3.rollup(data,
      v => d3.sum(v, d => d.jumlah_mangsa),
      d => d.daerah
    );

    const chartData = Array.from(districtData, ([key, value]) => ({ district: key, evacuees: value }))
      .sort((a, b) => b.evacuees - a.evacuees)
      .slice(0, 10);

    // Scales
    const x = d3.scaleBand()
      .range([0, width])
      .domain(chartData.map(d => d.district))
      .padding(0.1);

    const y = d3.scaleLinear()
      .range([height, 0])
      .domain([0, d3.max(chartData, d => d.evacuees)]);

    // Axes
    svg.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x))
      .selectAll('text')
      .style('text-anchor', 'end')
      .attr('dx', '-.8em')
      .attr('dy', '.15em')
      .attr('transform', 'rotate(-45)');

    svg.append('g')
      .call(d3.axisLeft(y));

    // Bars
    svg.selectAll('rect')
      .data(chartData)
      .join('rect')
      .attr('x', d => x(d.district))
      .attr('y', d => y(d.evacuees))
      .attr('width', x.bandwidth())
      .attr('height', d => height - y(d.evacuees))
      .attr('class', 'fill-blue-600');
  }

  onMount(() => {
    fetchData();
  });

  $: if (data.length > 0) {
    createBarChart(data);
  }

  $: totalCenters = data.length;
  $: totalEvacuees = d3.sum(data, d => d.jumlah_mangsa);
  $: activeDistricts = new Set(data.map(d => d.daerah)).size;
</script>

{#if loading}
  <div class="text-center py-8 text-blue-600 text-lg">
    {$t('app.loading')}
  </div>
{:else}
  <!-- Stats Cards -->
  <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
    <div class="bg-blue-100 p-4 rounded-lg text-center">
      <div class="text-3xl font-bold text-blue-600">{totalCenters}</div>
      <div class="text-gray-600">{$t('stats.centers')}</div>
    </div>
    <div class="bg-blue-100 p-4 rounded-lg text-center">
      <div class="text-3xl font-bold text-blue-600">{totalEvacuees}</div>
      <div class="text-gray-600">{$t('stats.evacuees')}</div>
    </div>
    <div class="bg-blue-100 p-4 rounded-lg text-center">
      <div class="text-3xl font-bold text-blue-600">{activeDistricts}</div>
      <div class="text-gray-600">{$t('stats.districts')}</div>
    </div>
  </div>

  <!-- Bar Chart -->
  <div class="bg-white p-4 rounded-lg shadow mb-8 overflow-x-auto">
    <div id="chart"></div>
  </div>

  <!-- Data Table -->
  <div class="bg-white p-4 rounded-lg shadow overflow-x-auto">
    <table class="min-w-full">
      <thead>
        <tr class="bg-blue-100">
          <th class="px-4 py-2 text-left">{$t('table.center')}</th>
          <th class="px-4 py-2 text-left">{$t('table.district')}</th>
          <th class="px-4 py-2 text-left">{$t('table.state')}</th>
          <th class="px-4 py-2 text-right">{$t('table.evacuees')}</th>
          <th class="px-4 py-2 text-right">{$t('table.families')}</th>
        </tr>
      </thead>
      <tbody>
        {#each data as center}
          <tr class="border-b hover:bg-gray-50">
            <td class="px-4 py-2">{center.nama_pps}</td>
            <td class="px-4 py-2">{center.daerah}</td>
            <td class="px-4 py-2">{center.negeri}</td>
            <td class="px-4 py-2 text-right">{center.jumlah_mangsa}</td>
            <td class="px-4 py-2 text-right">{center.jumlah_keluarga}</td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
{/if}
