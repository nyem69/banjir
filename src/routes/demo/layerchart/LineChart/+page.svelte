<script>
	import {
		Axis,
		Highlight,
		LinearGradient,
		LineChart,
		pivotLonger,
		Spline,
		Svg,
		Tooltip,
	} from 'layerchart';
	import { createDateSeries } from '$lib/utils/genData.ts';
	import { format } from '@layerstack/utils';

	import appleStock from "./apple-stock.json";

	const dateSeriesData = appleStock.map((d) => {
		return { date: new Date(d.date), value: d.value };
	});


	const keys = ['apples', 'bananas', 'oranges'];
	const multiSeriesData = createDateSeries({
		count: 30,
		min: 10,
		max: 100,
		value: 'integer',
		keys,
	});

	const multiSeriesFlatData = pivotLonger(multiSeriesData, keys, 'fruit', 'value');

</script>


<div class="w-full text-center m-4">
    <a href="https://www.layerchart.com/docs/components/LineChart" target="_blank" class="text-primary">LineChart</a>
    <div>
      <tt>
        import &#123; LineChart &#125; from 'layerchart';
      </tt>
    </div>
</div>

<div class="flex flex-wrap gap-4 items-center justify-start">

    <div class="w-full md:w-full lg:w-[48%] h-[300px] p-4 border rounded-xl">
      <LineChart data={dateSeriesData} x="date" y="value" />
    </div>

	<div class="w-full md:w-full lg:w-[48%] h-[300px] p-4 border rounded-xl">
		<LineChart
			data={dateSeriesData}
			x="date"
			series={[{ key: "value", color: "hsl(var(--color-secondary))" }]}
		/>
	</div>

	<div class="w-full md:w-full lg:w-[48%] h-[300px] p-4 border rounded-xl">
		<LineChart
			data={multiSeriesData}
			x="date"
			series={[
				{ key: "apples", color: "hsl(var(--color-danger))" },
				{ key: "bananas", color: "hsl(var(--color-success))" },
				{ key: "oranges", color: "hsl(var(--color-warning))" },
			]}
		/>
	</div>




	<div class="w-full md:w-full lg:w-[48%] h-[300px] p-4 border rounded-xl">
		<LineChart
			data={multiSeriesFlatData}
			x="date"
			y="value"
			series={[
			{ key: "apples", color: "hsl(var(--color-danger))" },
			{ key: "bananas", color: "hsl(var(--color-success))" },
			{ key: "oranges", color: "hsl(var(--color-warning))" },
			]}
			tooltip={{ mode: "voronoi" }}
		>
			<svelte:fragment slot="marks" let:series let:tooltip>
			{#each series as s}
				{@const color =
				tooltip.data == null || tooltip.data.fruit === s.key
					? s.color
					: "hsl(var(--color-surface-content) / 20%)"}
				<Spline
				data={multiSeriesData}
				y={s.key}
				class="stroke-2"
				stroke={color}
				/>
			{/each}
			</svelte:fragment>

			<svelte:fragment slot="highlight" let:series let:tooltip>
			<!-- TODO: Remove [...] type hack to make svelte-check happy -->
			{@const activeSeriesColor = [...series].find(
				(s) => s.key === tooltip.data?.fruit,
			)?.color}
			<Highlight lines points={{ fill: activeSeriesColor }} />
			</svelte:fragment>

			<svelte:fragment slot="tooltip" let:series let:tooltip let:x>
			<!-- TODO: Remove [...] type hack to make svelte-check happy -->
			{@const activeSeriesColor = [...series].find(
				(s) => s.key === tooltip.data?.fruit,
			)?.color}
			<Tooltip.Root let:data>
				<Tooltip.Header>{format(x(data))}</Tooltip.Header>
				<Tooltip.List>
				<Tooltip.Item
					label={data.fruit}
					value={data.value}
					color={activeSeriesColor}
				/>
				</Tooltip.List>
			</Tooltip.Root>
			</svelte:fragment>
		</LineChart>
	</div>

</div>

