<script lang="ts">

  let dbg=true;
  let pageKey = '/+page.svelte';
  dbg&&console.group('%c'+pageKey,'color:magenta');

  import * as m from '$lib/paraglide/messages.js';
	import { languageTag } from '$lib/paraglide/runtime';
  import dayjs, { setLanguage } from '$lib/utils/dayjs';
	import * as d3 from 'd3';

  import { Progress } from '$lib/components/ui/progress';
  import { onMount, onDestroy } from 'svelte';
  import { invalidate } from '$app/navigation';

	const comma = d3.format(',');

  // import 'dayjs/locale/ms';
  // import 'dayjs/locale/zh';
  // import 'dayjs/locale/ta';
  // import { browser } from '$app/environment';

  // // Language state
  // let currentLanguage = $state(browser ? localStorage.getItem('language') || 'ms' : 'ms');
  // $: {
  //   if (browser) {
  //     localStorage.setItem('language', currentLanguage);
  //     dayjs.locale(currentLanguage);
  //   }
  // }

  // // Import messages
  // import msMessages from '../messages/ms';
  // import enMessages from '../messages/en';
  // import zhMessages from '../messages/zh';
  // import taMessages from '../messages/ta';

  // const messages = {
  //   ms: msMessages,
  //   en: enMessages,
  //   zh: zhMessages,
  //   ta: taMessages
  // };

  // const t = (key: string) => {
  //   const keys = key.split('.');
  //   let result = messages[currentLanguage];
  //   for (const k of keys) {
  //     result = result?.[k];
  //   }
  //   return result || key;
  // };


  //-----------------------------------
  // refresh
  //-----------------------------------

  let refreshInterval: number;
  let progress = $state(100);
  let updateInterval: NodeJS.Timeout;
  let progressInterval: NodeJS.Timeout;
  
  const REFRESH_INTERVAL = 5 * 60 * 1000; // 5 minutes in milliseconds
  const PROGRESS_UPDATE_INTERVAL = 100; // Update progress every 100ms


  //-----------------------------------
  // i18n
  //-----------------------------------

  let currentLanguage = $state(languageTag());
  let formattedDate = $state('');
  let formattedDateLatestDate = $state('');
  let formattedDateLatestTime = $state('');

  onMount(() => {
    setLanguage(currentLanguage);
    updateFormattedDate();

    // Set up data refresh interval
    updateInterval = setInterval(() => {
      invalidate('app:disasters');
      progress = 100; // Reset progress when refreshing
    }, REFRESH_INTERVAL);

    // Set up progress bar update interval
    progressInterval = setInterval(() => {
      const decrementAmount = (PROGRESS_UPDATE_INTERVAL / REFRESH_INTERVAL) * 100;
      progress = Math.max(0, progress - decrementAmount);
    }, PROGRESS_UPDATE_INTERVAL);

  });

  onDestroy(() => {
    if (updateInterval) clearInterval(updateInterval);
    if (progressInterval) clearInterval(progressInterval);
  });



  function updateFormattedDate() {
    formattedDate = dayjs().format('dddd, MMMM D, YYYY h:mm A');

    // <span class="whitespace-nowrap">{disasters?.date ? dayjs(disasters?.date).format('h:mm a') : ''}</span>
    // <span class="whitespace-nowrap">{@html disasters?.date ? dayjs(disasters?.date).format('D MMMM YYYY') : '&nbsp;'}</span>

    formattedDateLatestDate = disasters?.date ? dayjs(disasters?.date).format('D MMMM YYYY') : '&nbsp;';
    formattedDateLatestTime = disasters?.date ? dayjs(disasters?.date).format('h:mm a') : '&nbsp;';

  }

  $effect(() => {
    setLanguage(currentLanguage);
    updateFormattedDate();
    dbg&&console.log('currentLanguage', currentLanguage, formattedDate);
  });


  //-----------------------------------
  // data
  //-----------------------------------
  interface DashboardData {
    defs: {
      states: { [key: string]: string };
      districts: { 
        district_id: string; 
        district: string; 
        latitude?: number; 
        longitude?: number; 
      }[];
      kategori: { [key: string]: string };
    };
    disasters: {
      cases?: {
        rows: any[];
        columns: string[];
      };
      histogram?: {
        rows: any[];
        columns: string[];
      };
    };
    airQuality: any;
    weather: any;


    topojson: any;
    topojson_daerah: any;
  }

  let { data }: { data: DashboardData } = $props();

  dbg&&console.log('data', data);

  //-----------------------------------
  // disasterCases
  //-----------------------------------

  // interface disasterCasesType {
	// 	[key: string]: any;
	// 	state: string;
	// 	state_id: number;
	// 	district: string;
	// 	district_id: number;
	// 	kategori: string;
	// 	kategori_id: number;
	// 	updated_at: Date;
	// 	jumlah_mangsa?: number;
	// 	jumlah_pps?: number;
	// 	jumlah_keluarga?: number;
	// 	jumlah_kematian?: number;
  // }

  // let disasterCases: disasterCasesType[] = $state((data?.disasters?.cases?.rows||[]).map(d=>{
  //   let k: disasterCasesType = {} as disasterCasesType;
  //   data?.disasters?.cases?.columns.forEach((c,i)=>{
  //     k[c] = d[i];
  //   });
  //   k.state = data?.defs?.states[k.state_id] || ''+k.state_id;

  //   let district = (data?.defs?.districts||[]).find(d=>d.district_id===k.district_id);
  //   if (district) {
  //     k.district = district.district;
  //     k.latitude = district.latitude;
  //     k.longitude = district.longitude;
  //   }

  //   k.kategori = data?.defs?.kategori?.[''+k.kategori_id] || ''+k.kategori_id;
  //   k.updated_at = new Date(k.updated_at);
  //   return k;
  // }));


  // let max_date =d3.max(disasterCases, d => d.updated_at);

  // disasterCases.sort((d1, d2) => {
  //   // return d2.updated_at.getTime() - d1.updated_at.getTime();
  //   return d3.descending(d1?.jumlah_mangsa ?? 0, d2?.jumlah_mangsa ?? 0);
  // });

  // disasterCases = disasterCases
  //                   .filter(d => (d?.jumlah_mangsa ?? 0) > 0 || 
  //                                (d?.jumlah_pps ?? 0) > 0 || 
  //                                (d?.jumlah_keluarga ?? 0) > 0 || 
  //                                (d?.jumlah_kematian ?? 0) > 0)
  //                   .filter(d => d?.updated_at && max_date && 
  //                                d.updated_at.getTime() > max_date.getTime() - 24*60*60*1000);

  // dbg&&console.log('disasterCases', disasterCases);


  // Interface for disaster cases
  interface DisasterCasesType {
    [key: string]: any;
    state: string;
    state_id: number;
    district: string;
    district_id: number;
    kategori: string;
    kategori_id: number;
    updated_at: Date;
    jumlah_mangsa?: number;
    jumlah_pps?: number;
    jumlah_keluarga?: number;
    jumlah_kematian?: number;
  }

  // Import necessary libraries and stores
  // import { state } from '@svelte/state';
  // import * as d3 from 'd3';

  // let data = $props<{ disasters: any; defs: any }>();

  // State declaration using Svelte 5 state
  let disasterCases = $state(
    (data?.disasters?.cases?.rows || []).map((d: any) => {
      let k: DisasterCasesType = {} as DisasterCasesType;

      // Map columns to object keys
      data?.disasters?.cases?.columns.forEach((c: string, i: number) => {
        k[c] = d[i];
      });

      // Assign state name
      k.state = data?.defs?.states[k.state_id] || '' + k.state_id;

      // Find and assign district information
      let district = data?.defs?.districts?.find((d: any) => d.district_id === k.district_id);
      if (district) {
        k.district = district.district;
        k.latitude = district.latitude;
        k.longitude = district.longitude;
      }

      // Assign category name
      k.kategori = data?.defs?.kategori?.['' + k.kategori_id] || '' + k.kategori_id;

      // Convert updated_at to a Date object
      k.updated_at = new Date(k.updated_at);

      return k;
    })
  );

  // Reactive statement to compute filtered disasterCases
  let maxDate = $state(d3.max(disasterCases, (d) => new Date(d.updated_at)));
  // console.log('maxDate', maxDate);

  disasterCases.sort((d1, d2) => d3.descending(d1?.jumlah_mangsa ?? 0, d2?.jumlah_mangsa ?? 0));
  disasterCases = disasterCases.filter(
    (d) =>
      (d?.jumlah_mangsa ?? 0) > 0 ||
      (d?.jumlah_pps ?? 0) > 0 ||
      (d?.jumlah_keluarga ?? 0) > 0 ||
      (d?.jumlah_kematian ?? 0) > 0
  )
    .filter((d) => d?.updated_at && maxDate && d.updated_at.getTime() > maxDate.getTime() - 24 * 60 * 60 * 1000);

  console.log('Filtered disasterCases:', disasterCases);



  //-----------------------------------
  // histogram
  //-----------------------------------
  interface histogramType {
    [key: string]: any;
    state: string;
    district?: string;
    state_id: number;
    district_id: number;
    jumlah_mangsa: number;
    jumlah_pps: number;
    jumlah_keluarga: number;
    date: Date;
    latitude?: number;
    longitude?: number;
  }


  let histogram: histogramType[] = (data?.disasters?.histogram?.rows || []).map(d => {
    let k: histogramType = {} as histogramType;
    data?.disasters?.histogram?.columns.forEach((c, i) => {
      k[c] = d[i];
    });
    k.state = data?.defs?.states['' + k.state_id] || '' + k.state_id;

    let district = data?.defs?.districts.find(d => d.district_id === '' + k.district_id);
    if (district) {
      k.district = district.district ?? '';
      k.latitude = district.latitude;
      k.longitude = district.longitude;
    }
    k.date = new Date(k.date);
    return k;
  });



  histogram.sort((d1, d2) => {
    return d3.ascending(d1.date, d2.date);
  });

  histogram = histogram.filter(d => d.date.getTime() > Date.now() - 30 * 24 * 60 * 60 * 1000);

  dbg && console.log('histogram', histogram);


  //-----------------------------------
  // disasters
  //-----------------------------------

  interface disastersType {
    date?: Date;
    jumlah_keluarga?: number;
    jumlah_mangsa?: number;
    jumlah_pps?: number;
    jumlah_kematian?: number;
    total_incidents?: number;
    by_state?: Array<{
      state?: string;
      state_id?: number;
      jumlah_mangsa?: number;
      jumlah_pps?: number;
      jumlah_keluarga?: number;
      jumlah_kematian?: number;
      updated_at?: string;
    }>;
    by_district?: Array<{
      state?: string;
      district?: string;
      jumlah_mangsa?: number;
      jumlah_pps?: number;
      jumlah_keluarga?: number;
      jumlah_kematian?: number;
      updated_at?: Date | string | undefined;
    }>;
    // cases?: typeof disasterCases;
  }
  
  let disasters: disastersType = {};

  disasters.date = d3.max(disasterCases, d => d.updated_at);
  disasters.jumlah_keluarga = d3.sum(disasterCases, d => d?.jumlah_keluarga || 0);
  disasters.jumlah_mangsa = d3.sum(disasterCases, d => d?.jumlah_mangsa || 0);
  disasters.jumlah_pps = d3.sum(disasterCases, d => d?.jumlah_pps || 0);
  disasters.jumlah_kematian = d3.sum(disasterCases, d => d?.jumlah_kematian || 0);

  disasters.by_state = d3.groups(disasterCases, d => d.state)
                  .map(d => {
                      return {
                          state: d[0],
                          state_id: d[1][0].state_id,
                          jumlah_mangsa: d3.sum(d[1], d => d.jumlah_mangsa),
                          jumlah_pps: d3.sum(d[1], d => d.jumlah_pps),
                          jumlah_keluarga: d3.sum(d[1], d => d.jumlah_keluarga),
                          jumlah_kematian: d3.sum(d[1], d => d.jumlah_kematian),
                          updated_at: d3.max(d[1], d => d.updated_at),
                      }
                  });

  disasters.by_district = d3.groups(disasterCases, d => d.state + '-' + d.district)
                  .map(d => {
                      return {
                          state: d[1][0].state,
                          district: d[1][0].district,
                          state_id: d[1][0].state_id,
                          district_id: d[1][0].district_id,
                          jumlah_mangsa: d3.sum(d[1], d => d.jumlah_mangsa),
                          jumlah_pps: d3.sum(d[1], d => d.jumlah_pps),
                          jumlah_keluarga: d3.sum(d[1], d => d.jumlah_keluarga),
                          jumlah_kematian: d3.sum(d[1], d => d.jumlah_kematian),
                          longitude: d[1][0].longitude,
                          latitude: d[1][0].latitude,
                          updated_at: d3.max(d[1], d => d.updated_at),
                      }
                  });

  dbg && console.log('disasters', disasters);



  //-------------------
  // charts
  //------------------

  import { BarChart } from 'layerchart';
  interface DateSeriesData {
    date: Date;
    negeri: number;
    daerah: number;
    jumlah_mangsa: number;
    jumlah_pps: number;
    jumlah_keluarga: number;
  };

  let dateSeriesData: DateSeriesData[] = [];
  
  let tempSeries = d3.groups(histogram, d => d3.timeDay.floor(d.date))
                  .map(d => {
                      return {
                          date: d[0],
                          negeri: [...new Set(d[1].map(d => d.state_id))].length,
                          daerah: [...new Set(d[1].map(d => d.district_id))].length,
                          jumlah_mangsa: d3.sum(d[1], d => d.jumlah_mangsa),
                          jumlah_pps: d3.sum(d[1], d => d.jumlah_pps),
                          jumlah_keluarga: d3.sum(d[1], d => d.jumlah_keluarga),
                      }
                  });

  dbg && console.log('tempSeries', tempSeries);                  

  // last 30 days from disasters.date                    
  let days = d3.timeDay.range(
    new Date(disasters.date instanceof Date 
      ? disasters.date.getTime() - 1000 * 60 * 60 * 24 * 30 
      : Date.now() - 1000 * 60 * 60 * 24 * 30), 
    disasters.date instanceof Date ? disasters.date : new Date()
  );

  days.forEach(d => {
    let j = tempSeries.find(k => +k.date === +d);
    if (j) {
      dateSeriesData.push(j);
    } else {
      dateSeriesData.push({
        date: d,
        negeri: 0,
        daerah: 0,
        jumlah_mangsa: 0,
        jumlah_pps: 0,
        jumlah_keluarga: 0  
      });
    }
  });

  
  dbg && console.log('dateSeriesData', dateSeriesData);


  //-------------------
  // add current data to latest date
  //------------------

	
  dateSeriesData.filter(d => dayjs(d.date).format('YYYY-MM-DD') == dayjs(disasters.date).format('YYYY-MM-DD'))
    .forEach(d => {
      d.negeri = disasters?.by_state?.length || 0;
      d.daerah = disasters?.by_district?.length || 0;
      d.jumlah_mangsa = disasters?.jumlah_mangsa || 0;
      d.jumlah_pps = disasters?.jumlah_pps || 0;
      d.jumlah_keluarga = disasters?.jumlah_keluarga || 0;      

    });

  dateSeriesData.filter(d => dayjs(d.date).format('YYYY-MM-DD') == dayjs(disasters.date).format('YYYY-MM-DD'))
    .forEach(d => {
      d.negeri = disasters?.by_state?.length || 0;
      d.daerah = disasters?.by_district?.length || 0;
      d.jumlah_mangsa = disasters?.jumlah_mangsa || 0;
      d.jumlah_pps = disasters?.jumlah_pps || 0;
      d.jumlah_keluarga = disasters?.jumlah_keluarga || 0;      

    });


  /*
    {
      "date": "2024-11-07T16:00:00.000Z",
      "negeri": 0,
      "daerah": 0,
      "jumlah_mangsa": 0,
      "jumlah_pps": 0,
      "jumlah_keluarga": 0
    }    
  */


  //-------------------
  // list by states
  //------------------
  let listByStates = d3.groups(disasterCases, d => d.state)
                      .map(d => {
                          return {
                              state: d[0],
                              state_id: d[1][0].state_id,
                              jumlah_mangsa: d3.sum(d[1], d => d.jumlah_mangsa),
                              jumlah_pps: d3.sum(d[1], d => d.jumlah_pps),
                              jumlah_keluarga: d3.sum(d[1], d => d.jumlah_keluarga),
                              jumlah_kematian: d3.sum(d[1], d => d.jumlah_kematian),
                              updated_at: d3.max(d[1], d => d.updated_at),
                          }
                      });

  dbg && console.log('listByStates', listByStates);

  /*
      {
        "state": "Kelantan",
        "state_id": 3,
        "jumlah_mangsa": 28214,
        "jumlah_pps": 67,
        "jumlah_keluarga": 9062,
        "jumlah_kematian": 1,
        "updated_at": "2024-12-05T08:06:21.000Z",
      } 
  */


  //-------------------
  // listByDistricts                      
  //------------------

  let listByDistricts = d3.groups(disasterCases, d => d.state + '-' + d.district)
                      .map(d => {
                          return {
                              state: d[1][0].state,
                              district: d[1][0].district,
                              state_id: d[1][0].state_id,
                              district_id: d[1][0].district_id,
                              jumlah_mangsa: d3.sum(d[1], d => d.jumlah_mangsa),
                              jumlah_pps: d3.sum(d[1], d => d.jumlah_pps),
                              jumlah_keluarga: d3.sum(d[1], d => d.jumlah_keluarga),
                              jumlah_kematian: d3.sum(d[1], d => d.jumlah_kematian),
                              longitude: d[1][0].longitude,
                              latitude: d[1][0].latitude,
                              updated_at: d3.max(d[1], d => d.updated_at),
                          }
                      });

  dbg && console.log('listByDistricts', listByDistricts);

	//-------------------
	// SEO
	//-------------------

  import SEO from '$lib/components/shared/seo.svelte';

  // import MapChoropethDaerah from '$lib/components/dashboard/map-choropleth/map_daerah.svelte';                      

  dbg && console.groupEnd(pageKey);

</script>




<SEO 
  title="NADMA MyDIMS - Sistem Pengurusan Maklumat Bencana Malaysia"
  description="Dashbord maklumat bencana terkini oleh NADMA Malaysia. Pantau banjir, tanah runtuh, dan bencana alam lain di seluruh Malaysia."
  keywords="NADMA, MyDIMS, bencana, banjir, tanah runtuh, Malaysia, sistem pengurusan bencana, maklumat bencana, pusat pemindahan sementara, PPS"
  locale="ms_MY"
  alternateLocale="en_MY"
  url="https://mydims.nadma.gov.my"
/>

<div class="fixed top-0 left-0 right-0 z-50 opacity-20 p-0">
  <Progress value={progress} max={100}/>
</div>
<!-- 
<div class="w-full m-4">

  <h1>{m.title()}</h1>
  <p>Visit <a href="https://svelte.dev/docs/kit">svelte.dev/docs/kit</a> to read the documentation</p>

  <div>
    Language: {currentLanguage}
  </div>
  <div>
    <p>Current date: {formattedDate}</p>
  </div>


</div>
 -->




<div class="container mx-auto py-6">


	<header class="mb-8 mt-4">
    <div>
      <h6 class="text-sm font-bold">NADMA-MyDIMS Dashboard</h6>
    </div>
    <div class="flex justify-between items-center gap-4">
      {#if disasters?.date}
        <h1 class="text-3xl font-bold">{m.current_flood_situation()}</h1>
      {:else}
        <h1 class="text-3xl font-bold">{m.flood_situation()}</h1>
      {/if}
      <div class="flex flex-col items-end">
        <h1 class="text-md font-bold max-w-[200px] text-right">
          {#if disasters?.date}
            <span class="text-muted-foreground whitespace-nowrap">{m.information_as_of()}</span>
            <span class="whitespace-nowrap">{@html formattedDateLatestDate}</span>
            <span class="whitespace-nowrap">{@html formattedDateLatestTime}</span>
          {/if}
        </h1>
      </div>
    </div>
  </header>


  <!-- <div class="flex flex-wrap mb-8 w-full">
    <div class="w-full p-2 rounded-lg border bg-card text-card-foreground shadow-sm">
      <MapChoropethDaerah data={{ 
        topojson_daerah: data.topojson_daerah,
        casesByDaerah: listByDistricts||[] 
      }} />
    </div>
  </div> -->



  <!-- Overview Stats -->
  <div class="flex flex-wrap gap-2 mb-8 w-full">
    <div class="flex-1 items-center p-2 rounded-lg border bg-card text-card-foreground shadow-sm text-center">
      <p class="text-2xl font-bold">{@html disasters?.by_state?.length ? comma(disasters?.by_state?.length):'&nbsp;'}</p>
      <h3 class="text-sm font-medium text-muted-foreground ml-2">{m.state()}</h3>

      <div class="h-[120px] w-full min-w-[200px] p-4">
        <BarChart 
          data={dateSeriesData} 
          x="date" 
          y="negeri" 
          axis="y"
          bandPadding={0.1}
          padding={{ left: 30}}
          props={{ 
            bars: { radius: 1, strokeWidth: 0, class: "fill-[orangered]" },
            yAxis: { 
              domain: false, 
              // ticks:(scale) => scale.ticks?.().filter(isNotZero),
              format:(v) => v ? comma(v) : "", 
              placement: 'left',
              class: "stroke-[#ff0000] fill-[#ff0000]", 
            }
          }}          
        />
      </div>
      <p class="text-sm text-muted-foreground mb-2">
        {#if dateSeriesData?.length > 1}
          {#if dateSeriesData[dateSeriesData.length - 1].negeri > dateSeriesData[dateSeriesData.length - 2].negeri}
            {m.increased()} {dateSeriesData[dateSeriesData.length - 1].negeri - dateSeriesData[dateSeriesData.length - 2].negeri} {m.states()} {m.compared_to_yesterday()}
          {:else if dateSeriesData[dateSeriesData.length - 1].negeri < dateSeriesData[dateSeriesData.length - 2].negeri}
            {m.decreased()} {dateSeriesData[dateSeriesData.length - 2].negeri - dateSeriesData[dateSeriesData.length - 1].negeri} {m.states()} {m.compared_to_yesterday()}
          {:else}
            {m.no_change()} {m.compared_to_yesterday()}
          {/if}
        {/if}
      </p>
    </div>
    <div class="flex-1 items-center p-2 rounded-lg border bg-card text-card-foreground shadow-sm text-center">
      <p class="text-2xl font-bold">{@html disasters?.by_district?.length ? comma(disasters?.by_district?.length):'&nbsp;'}</p>
      <h3 class="text-sm font-medium text-muted-foreground ml-2">{m.districts()}</h3>

      <div class="h-[120px] w-full min-w-[200px] p-4">
        <BarChart 
          data={dateSeriesData} 
          x="date" 
          y="daerah" 
          axis="y"
          bandPadding={0.1}
          padding={{ left: 30}}
          props={{ 
            bars: { radius: 1, strokeWidth: 0, class: "fill-[orangered]" },
            yAxis: { 
              format:(v) => v ? comma(v) : "", 
              placement: 'left',
            },
          }}          
        />
      </div>
      <p class="text-sm text-muted-foreground mb-2">
        {#if dateSeriesData?.length > 1}
          {#if dateSeriesData[dateSeriesData.length - 1].daerah > dateSeriesData[dateSeriesData.length - 2].daerah}
            {m.increased()} {dateSeriesData[dateSeriesData.length - 1].daerah - dateSeriesData[dateSeriesData.length - 2].daerah} {m.districts()} {m.compared_to_yesterday()}
          {:else if dateSeriesData[dateSeriesData.length - 1].daerah < dateSeriesData[dateSeriesData.length - 2].daerah}
            {m.decreased()} {dateSeriesData[dateSeriesData.length - 2].daerah - dateSeriesData[dateSeriesData.length - 1].daerah} {m.districts()} {m.compared_to_yesterday()}
          {:else}
            {m.no_change()} {m.compared_to_yesterday()}
          {/if}
        {/if}
      </p>
    </div>
    <div class="flex-1 items-center p-2 rounded-lg border bg-card text-card-foreground shadow-sm text-center">
      <p class="text-2xl font-bold">{@html disasters?.jumlah_pps ? comma(disasters?.jumlah_pps) : '&nbsp;'}</p>
      <h3 class="text-sm font-medium text-muted-foreground ml-2">{m.relief_centers()}</h3>

      <div class="h-[120px] w-full min-w-[200px] p-4">
        <BarChart 
          data={dateSeriesData} 
          x="date" 
          y="jumlah_pps" 
          axis="y"
          bandPadding={0.1}
          padding={{ left: 30}}
          props={{ 
            bars: { radius: 1, strokeWidth: 0, class: "fill-[orangered]" },
            yAxis: { 
              format:(v) => v ? comma(v) : "", 
              placement: 'left',
            },
          }}          
        />
      </div>
      <p class="text-sm text-muted-foreground mb-2">
        {#if dateSeriesData?.length > 1}
          {#if dateSeriesData[dateSeriesData.length - 1].jumlah_pps > dateSeriesData[dateSeriesData.length - 2].jumlah_pps}
            {m.increased()} {comma(dateSeriesData[dateSeriesData.length - 1].jumlah_pps - dateSeriesData[dateSeriesData.length - 2].jumlah_pps)} {m.relief_centers()} {m.compared_to_yesterday()}
          {:else if dateSeriesData[dateSeriesData.length - 1].jumlah_pps < dateSeriesData[dateSeriesData.length - 2].jumlah_pps}
            {m.decreased()} {comma(dateSeriesData[dateSeriesData.length - 2].jumlah_pps - dateSeriesData[dateSeriesData.length - 1].jumlah_pps)} {m.relief_centers()} {m.compared_to_yesterday()}
          {:else}
            {m.no_change()} {m.compared_to_yesterday()}
          {/if}
        {/if}
      </p>
    </div>
    <div class="flex-1 items-center p-2 rounded-lg border bg-card text-card-foreground shadow-sm text-center">
      <p class="text-2xl font-bold">{@html disasters?.jumlah_keluarga ? comma(disasters?.jumlah_keluarga) : '&nbsp;'}</p>
      <h3 class="text-sm font-medium text-muted-foreground ml-2">{m.families()}</h3>

      <div class="h-[120px] w-full min-w-[200px] p-4">
        <BarChart 
          data={dateSeriesData} 
          x="date" 
          y="jumlah_keluarga" 
          axis="y"
          bandPadding={0.1}
          padding={{ left: 30}}
          yNice
          props={{ 
            bars: { radius: 1, strokeWidth: 0, class: "fill-[orangered]" },
            yAxis: { 
              format:(v) => v ? comma(v) : "", 
              placement: 'left',
            },
          }}          
        />
      </div>
      <p class="text-sm text-muted-foreground mb-2">
        {#if dateSeriesData?.length > 1}
          {#if dateSeriesData[dateSeriesData.length - 1].jumlah_keluarga > dateSeriesData[dateSeriesData.length - 2].jumlah_keluarga}
            {m.increased()} {comma(dateSeriesData[dateSeriesData.length - 1].jumlah_keluarga - dateSeriesData[dateSeriesData.length - 2].jumlah_keluarga)} {m.families()} {m.compared_to_yesterday()}
          {:else if dateSeriesData[dateSeriesData.length - 1].jumlah_keluarga < dateSeriesData[dateSeriesData.length - 2].jumlah_keluarga}
            {m.decreased()} {comma(dateSeriesData[dateSeriesData.length - 2].jumlah_keluarga - dateSeriesData[dateSeriesData.length - 1].jumlah_keluarga)} {m.families()} {m.compared_to_yesterday()}
          {:else}
            {m.no_change()} {m.compared_to_yesterday()}
          {/if}
        {/if}
      </p>
    </div>
    <div class="flex-1 items-center p-2 rounded-lg border bg-card text-card-foreground shadow-sm text-center">
      <p class="text-2xl font-bold">{@html disasters?.jumlah_mangsa ? comma(disasters?.jumlah_mangsa) : '&nbsp;'}</p>
      <h3 class="text-sm font-medium text-muted-foreground ml-2">{m.victims()}</h3>

      <div class="h-[120px] w-full min-w-[200px] p-4">
        <BarChart 
          data={dateSeriesData} 
          x="date" 
          y="jumlah_mangsa" 
          axis="y"
          bandPadding={0.1}
          padding={{ left: 30}}
          props={{ 
            bars: { radius: 1, strokeWidth: 0, class: "fill-[orangered]" },
            yAxis: { 
              format:(v) => v ? comma(v) : "", 
              placement: 'left',              
            },
          }}          
        />
      </div>
      <p class="text-sm text-muted-foreground mb-2">
        {#if dateSeriesData?.length > 1}
          {#if dateSeriesData[dateSeriesData.length - 1].jumlah_mangsa > dateSeriesData[dateSeriesData.length - 2].jumlah_mangsa}
            {m.increased()} {comma(dateSeriesData[dateSeriesData.length - 1].jumlah_mangsa - dateSeriesData[dateSeriesData.length - 2].jumlah_mangsa)} {m.victims()} {m.compared_to_yesterday()}
          {:else if dateSeriesData[dateSeriesData.length - 1].jumlah_mangsa < dateSeriesData[dateSeriesData.length - 2].jumlah_mangsa}
            {m.decreased()} {comma(dateSeriesData[dateSeriesData.length - 2].jumlah_mangsa - dateSeriesData[dateSeriesData.length - 1].jumlah_mangsa)} {m.victims()} {m.compared_to_yesterday()}
          {:else}
            {m.no_change()} {m.compared_to_yesterday()}
          {/if}
        {/if}
      </p>
    </div>
  </div>


  <!-- By states -->
  <div class="rounded-lg border bg-card text-card-foreground shadow-sm p-0 md:p-6 pt-6 mb-8">
    <h2 class="text-xl font-semibold mb-4 text-center">{m.total_by_states()}</h2>
    <div class="overflow-x-auto">
      <table class="w-full text-xs md:text-base">
        <thead>
          <tr class="border-b">
            <!-- <th class="text-center py-3 px-4">#</th> -->

            <th class="text-center py-1 px-1 md:py-3 md:px-4">
              <span class="hidden md:inline">{m.state()}</span>
              <span class="md:hidden">{m.state()}</span>
            </th>

            <!-- <th class="text-center py-3 px-4">Kategori</th> -->
            <th class="text-center py-1 px-1 md:py-3 md:px-4">{m.relief_centers()}</th>
            <th class="text-center py-1 px-1 md:py-3 md:px-4">
              <span class="hidden md:inline">{m.families()}</span>
              <span class="md:hidden">{m.families()}</span>
            </th>
            <th class="text-center py-1 px-1 md:py-3 md:px-4">
              <span class="hidden md:inline">{m.victims()}</span>
              <span class="md:hidden">{m.victims()}</span>
            </th>
            <th class="text-center py-1 px-1 md:py-3 md:px-4">
              <span class="hidden md:inline">{m.casualties()}</span>
              <span class="md:hidden">{m.casualties()}</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {#each listByStates || [] as d,i}
            <tr class="border-b">
							<!-- <td class="py-3 px-4 text-center">{i+1}</td> -->

              <td class="py-1 px-1 md:py-3 md:px-4 text-center whitespace-normal md:whitespace-nowrap">{d.state}</td>

							<td class="py-1 px-1 md:py-3 md:px-4 text-center tabular-nums">{d.jumlah_pps?comma(d.jumlah_pps):''}</td>
							<td class="py-1 px-1 md:py-3 md:px-4 text-center tabular-nums">{d.jumlah_keluarga?comma(d.jumlah_keluarga):''}</td>
							<td class="py-1 px-1 md:py-3 md:px-4 text-center tabular-nums">{d.jumlah_mangsa?comma(d.jumlah_mangsa):''}</td>							
							<td class="py-1 px-1 md:py-3 md:px-4 text-center tabular-nums">{d.jumlah_kematian?comma(d.jumlah_kematian):''}</td>							
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  </div>




  <!-- Recent Incidents -->
  <div class="rounded-lg border bg-card text-card-foreground shadow-sm p-0 md:p-6 pt-6 mb-8">
    <h2 class="text-xl font-semibold mb-4 text-center">{m.total_by_districts()}</h2>
    <div class="overflow-x-auto">
      <table class="w-full text-xs md:text-base">
        <thead>
          <tr class="border-b">
            <th class="text-center py-1 px-1 md:py-3 md:px-4 hidden md:table-cell">{m.no()}</th>
            <th class="text-center py-1 px-1 md:py-3 md:px-4 hidden md:table-cell">{m.date_time()}</th>

						<th class="text-center py-1 px-1 md:py-3 md:px-4">
              <span class="hidden md:inline">{m.district()}</span>
              <span class="md:hidden">{m.district()}</span>
            </th>
            <th class="text-center py-1 px-1 md:py-3 md:px-4 hidden md:table-cell">{m.state()}</th>

            <!-- <th class="text-center py-3 px-4">Kategori</th> -->
            <th class="text-center py-1 px-1 md:py-3 md:px-4">{m.relief_centers()}</th>
            <th class="text-center py-1 px-1 md:py-3 md:px-4">
              <span class="hidden md:inline">{m.families()}</span>
              <span class="md:hidden">{m.families()}</span>
            </th>
            <th class="text-center py-1 px-1 md:py-3 md:px-4">
              <span class="hidden md:inline">{m.victims()}</span>
              <span class="md:hidden">{m.victims()}</span>
            </th>
            <th class="text-center py-1 px-1 md:py-3 md:px-4">
              <span class="hidden md:inline">{m.casualties()}</span>
              <span class="md:hidden">{m.casualties()}</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {#each disasterCases || [] as d,i}
            <tr class="border-b">
							<td class="py-1 px-1 md:py-3 md:px-4 text-center hidden md:table-cell">{i+1}</td>

              <td class="py-1 px-1 md:py-3 md:px-4 text-center hidden md:table-cell">{@html dayjs(d.updated_at).locale('ms').format('D MMMM YYYY h:mm')+'&nbsp;'+dayjs(d.updated_at).locale('en').format('a')}</td>

              <td class="py-1 px-1 md:py-3 md:px-4 text-center md:hidden whitespace-normal">{d.district}</td>
							<td class="py-1 px-1 md:py-3 md:px-4 text-center hidden md:table-cell">{d.district}</td>
              <td class="py-1 px-1 md:py-3 md:px-4 text-center hidden md:table-cell">{d.state}</td>

							<td class="py-1 px-1 md:py-3 md:px-4 text-center tabular-nums">{d.jumlah_pps?comma(d.jumlah_pps):''}</td>
							<td class="py-1 px-1 md:py-3 md:px-4 text-center tabular-nums">{d.jumlah_keluarga?comma(d.jumlah_keluarga):''}</td>
							<td class="py-1 px-1 md:py-3 md:px-4 text-center tabular-nums">{d.jumlah_mangsa?comma(d.jumlah_mangsa):''}</td>							
							<td class="py-1 px-1 md:py-3 md:px-4 text-center tabular-nums">{d.jumlah_kematian?comma(d.jumlah_kematian):''}</td>							
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  </div>

</div>
