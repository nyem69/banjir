<script>



    let data = [
        {
            "year": 2019,
            "basket": 1,
            "fruit": "apples",
            "value": 3840
        },
        {
            "year": 2019,
            "basket": 1,
            "fruit": "bananas",
            "value": 1920
        },
        {
            "year": 2019,
            "basket": 2,
            "fruit": "cherries",
            "value": 960
        },
        {
            "year": 2019,
            "basket": 2,
            "fruit": "grapes",
            "value": 400
        }
    ]


    $: dataWithColor =
        data?.map((d, i) => {
        return {
            ...d,
            color: [
            'hsl(var(--color-danger))',
            'hsl(var(--color-warning))',
            'hsl(var(--color-success))',
            'hsl(var(--color-info))',
            ][i],
        };
        }) ?? [];


    const exerciseData = [
        { key: 'move', value: 400, maxValue: 1000, color: '#ef4444' },
        { key: 'exercise', value: 20, maxValue: 30, color: '#a3e635' },
        { key: 'stand', value: 10, maxValue: 12, color: '#22d3ee' },
    ];

    import { Arc, Group, LinearGradient, PieChart, Text } from 'layerchart';
    import { group } from 'd3-array';
    import { quantize } from 'd3-interpolate';
    import { schemeTableau10, interpolateRainbow } from 'd3-scale-chromatic';

    import { longData } from '$lib/utils/genData.ts';

    const dataByYear = group(longData, (d) => d.year);


</script>


<div class="w-full text-center m-4">
    <a href="https://www.layerchart.com/docs/components/PieChart" target="_blank" class="text-primary">PieChart</a>
</div>

<div class="flex flex-wrap gap-4">

    <div class="w-full md:w-[48%] lg:w-[32%] h-[300px] p-4 border rounded-xl">
        <PieChart {data} key="fruit" value="value" />
    </div>
    <div class="w-full md:w-[48%] lg:w-[32%] h-[300px] p-4 border rounded-xl">
        <PieChart
            {data}
            key="fruit"
            value="value"
            innerRadius={-20}
            cornerRadius={5}
            padAngle={0.02}
        />
    </div>
    <div class="w-full md:w-[48%] lg:w-[32%] h-[300px] p-4 border rounded-xl">
        <PieChart
            {data}
            key="fruit"
            value="value"
            range={[-90, 90]}
            outerRadius={300 / 2}
            innerRadius={-20}
            cornerRadius={10}
            padAngle={0.02}
            props={{ group: { y: 80 } }}
        />
    </div>
    <div class="w-full md:w-[48%] lg:w-[32%] h-[300px] p-4 border rounded-xl">
        <PieChart
            data={[{ key: "Example", value: 70 }]}
            key="key"
            value="value"
            maxValue={100}
            outerRadius={-25}
            innerRadius={-20}
            cornerRadius={10}
        />
    </div>

    <div class="w-full md:w-[48%] lg:w-[32%] h-[300px] p-4 border rounded-xl">
        <PieChart>
            <svelte:fragment slot="marks">
            <LinearGradient class="from-secondary to-primary" let:url>
                <Group y={20}>
                <Arc
                    value={70}
                    domain={[0, 100]}
                    outerRadius={80}
                    innerRadius={-15}
                    cornerRadius={10}
                    padAngle={0.02}
                    range={[-120, 120]}
                    fill={url}
                    track={{ class: "fill-none stroke-surface-content/10" }}
                    let:value
                >
                    <Text
                    value={Math.round(value) + "%"}
                    textAnchor="middle"
                    verticalAnchor="middle"
                    class="text-4xl tabular-nums"
                    />
                </Arc>
                </Group>
            </LinearGradient>
            </svelte:fragment>
        </PieChart>
    </div>



    <div class="w-full md:w-[48%] lg:w-[32%] h-[300px] p-4 border rounded-xl">
        <PieChart
            data={[{ key: "Example", value: 70 }]}
            key="key"
            value="value"
            maxValue={100}
            range={[-90, 90]}
            outerRadius={80}
            innerRadius={-20}
            cornerRadius={10}
            cRange={["hsl(var(--color-success))"]}
            props={{
            group: { y: 45 },
            }}
        />
    </div>

    <div class="w-full md:w-[48%] lg:w-[32%] h-[300px] p-4 border rounded-xl">
        <PieChart
            key="fruit"
            value="value"
            series={Array.from(dataByYear, ([key, data]) => ({ key, data }))}
            outerRadius={-25}
            innerRadius={-20}
            cornerRadius={5}
            padAngle={0.01}
        />
    </div>

    <div class="w-full md:w-[48%] lg:w-[32%] h-[300px] p-4 border rounded-xl">
        <PieChart
            key="fruit"
            value="value"
            series={data?.map((d) => ({ key: d.fruit, data: [d] }))}
            outerRadius={-25}
            innerRadius={-20}
            cornerRadius={10}
        />
    </div>

    <div class="w-full md:w-[48%] lg:w-[32%] h-[300px] p-4 border rounded-xl">
        <PieChart
            key="fruit"
            value="value"
            series={data?.map((d) => ({ key: d.fruit, data: [d] }))}
            range={[-90, 90]}
            outerRadius={-25}
            innerRadius={-20}
            cornerRadius={10}
            props={{ group: { y: 70 } }}
        />
    </div>

    <div class="w-full md:w-[48%] lg:w-[32%] h-[300px] p-4 border rounded-xl">
        <PieChart
            key="fruit"
            value="value"
            series={data?.map((d) => ({ key: d.fruit, data: [d] }))}
            props={{
            arc: {
                track: { fill: "hsl(var(--color-surface-content) / 10%)" },
            },
            }}
            outerRadius={-25}
            innerRadius={-20}
            cornerRadius={10}
        />
    </div>

    <div class="w-full md:w-[48%] lg:w-[32%] h-[300px] p-4 border rounded-xl">
        <PieChart
            key="key"
            value="value"
            series={exerciseData.map((d) => {
            return {
                key: d.key,
                data: [d],
                maxValue: d.maxValue,
                color: d.color,
            };
            })}
            outerRadius={-25}
            innerRadius={-20}
            cornerRadius={10}
        />
    </div>


    <div class="w-full md:w-[48%] lg:w-[32%] h-[300px] p-4 border rounded-xl">
        <PieChart
            key="fruit"
            value="value"
            series={[
            { key: 2019, data: dataByYear.get(2019), props: { innerRadius: -20 } },
            { key: 2018, data: dataByYear.get(2018), props: { outerRadius: -30 } },
            ]}
        />
    </div>


    <div class="w-full md:w-[48%] lg:w-[32%] h-[300px] p-4 border rounded-xl">
        <PieChart
            {data}
            key="fruit"
            value="value"
            props={{ arc: { class: "stroke-surface-100" } }}
        />
    </div>


    <div class="w-full md:w-[48%] lg:w-[32%] h-[300px] p-4 border rounded-xl">
        <PieChart {data} key="fruit" value="value" legend />
    </div>

    <div class="w-full md:w-[48%] lg:w-[32%] h-[300px] p-4 border rounded-xl">
        <PieChart
            {data}
            key="fruit"
            value="value"
            legend={{ placement: "top-left", orientation: "vertical" }}
        />
    </div>


    <div class="w-full md:w-[48%] lg:w-[32%] h-[300px] p-4 border rounded-xl">
        <PieChart
            {data}
            key="fruit"
            label={(d) => {
            switch (d.fruit) {
                case "apples":
                return "Apples 🍎";
                case "bananas":
                return "Bananas 🍌";
                case "cherries":
                return "Cherries 🍒";
                case "grapes":
                return "Grapes 🍇";
            }
            }}
            value="value"
            legend
        />
    </div>


    <div class="w-full md:w-[48%] lg:w-[32%] h-[300px] p-4 border rounded-xl">
        <PieChart
            {data}
            key="fruit"
            value="value"
            cRange={[
                "hsl(var(--color-success))",
                "hsl(var(--color-warning))",
                "hsl(var(--color-danger))",
                "hsl(var(--color-info))",
            ]}
        />
    </div>

    <div class="w-full md:w-[48%] lg:w-[32%] h-[300px] p-4 border rounded-xl">
        <PieChart {data} key="fruit" value="value" cRange={schemeTableau10} />
    </div>


    <div class="w-full md:w-[48%] lg:w-[32%] h-[300px] p-4 border rounded-xl">
        <PieChart
            {data}
            key="fruit"
            value="value"
            cRange={quantize(interpolateRainbow, 5)}
        />
    </div>

    <div class="w-full md:w-[48%] lg:w-[32%] h-[300px] p-4 border rounded-xl">
        <PieChart
            data={dataWithColor}
            key="fruit"
            value="value"
            c="color"
            cRange={dataWithColor.map((d) => d.color)}
        />
    </div>


    <div class="w-full md:w-[48%] lg:w-[32%] h-[300px] p-4 border rounded-xl">
        <PieChart
            {data}
            key="fruit"
            value="value"
            padding={{ right: 80 }}
            legend={{ placement: "right", orientation: "vertical" }}
        />
    </div>

    <div class="w-full md:w-[48%] lg:w-[32%] h-[300px] p-4 border rounded-xl">
        <PieChart
            {data}
            key="fruit"
            value="value"
            placement="left"
            legend={{ placement: "right", orientation: "vertical" }}
        />
    </div>


    <div class="w-full md:w-[48%] lg:w-[32%] h-[300px] p-4 border rounded-xl">
        <PieChart
            {data}
            key="fruit"
            value="value"
            placement="right"
            legend={{ placement: "left", orientation: "vertical" }}
        />
    </div>

    <div class="w-full md:w-[48%] lg:w-[32%] h-[300px] p-4 border rounded-xl">
        <PieChart
            {data}
            key="fruit"
            value="value"
            center={false}
            props={{ group: { x: 200, center: "y" } }}
            legend={{ placement: "right", orientation: "vertical" }}
        />
    </div>

</div>

