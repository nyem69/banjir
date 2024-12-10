<script lang="ts">

  let dbg=true;
  let pageKey = '/+page.svelte';
  dbg&&console.group('%c'+pageKey,'color:magenta');

  import { onMount } from 'svelte';
  import * as m from '$lib/paraglide/messages.js';
	import { languageTag } from '$lib/paraglide/runtime';
  import dayjs, { setLanguage } from '$lib/utils/dayjs';
	import * as d3 from 'd3';


	const comma = d3.format(',');



  let currentLanguage = $state('ms'); 
  let formattedDate = $state('');

  onMount(() => {
    currentLanguage = languageTag(); 
    setLanguage(currentLanguage);
    updateFormattedDate();
  });

  function updateFormattedDate() {
    formattedDate = dayjs().format('dddd, MMMM D, YYYY h:mm A');
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

  interface disasterCasesType {
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

  let disasterCases: disasterCasesType[] = (data?.disasters?.cases?.rows||[]).map(d=>{
    let k: disasterCasesType = {} as disasterCasesType;
    data?.disasters?.cases?.columns.forEach((c,i)=>{
      k[c] = d[i];
    });
    k.state = data?.defs?.states[k.state_id] || ''+k.state_id;

    let district = (data?.defs?.districts||[]).find(d=>d.district_id===k.district_id);
    if (district) {
      k.district = district.district;
      k.latitude = district.latitude;
      k.longitude = district.longitude;
    }

    k.kategori = data?.defs?.kategori?.[''+k.kategori_id] || ''+k.kategori_id;
    k.updated_at = new Date(k.updated_at);
    return k;
  });


  let max_date =d3.max(disasterCases, d => d.updated_at);

  disasterCases.sort((d1, d2) => {
    // return d2.updated_at.getTime() - d1.updated_at.getTime();
    return d3.descending(d1?.jumlah_mangsa ?? 0, d2?.jumlah_mangsa ?? 0);
  });

  disasterCases = disasterCases
                    .filter(d => (d?.jumlah_mangsa ?? 0) > 0 || 
                                 (d?.jumlah_pps ?? 0) > 0 || 
                                 (d?.jumlah_keluarga ?? 0) > 0 || 
                                 (d?.jumlah_kematian ?? 0) > 0)
                    .filter(d => d?.updated_at && max_date && 
                                 d.updated_at.getTime() > max_date.getTime() - 24*60*60*1000);

  dbg&&console.log('disasterCases', disasterCases);

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


  let histogram: histogramType[] = (data?.disasters?.histogram?.rows||[]).map(d=>{
    let k: histogramType = {} as histogramType;
    data?.disasters?.histogram?.columns.forEach((c,i)=>{
      k[c] = d[i];
    });
    k.state = data?.defs?.states[''+k.state_id] || ''+k.state_id;

    let district = data?.defs?.districts.find(d => d.district_id === ''+k.district_id);
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

  histogram = histogram.filter(d=>d.date.getTime() > Date.now() - 30*24*60*60*1000);

	dbg&&console.log('histogram', histogram);


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
  disasters.jumlah_keluarga = d3.sum(disasterCases, d => d?.jumlah_keluarga||0);
  disasters.jumlah_mangsa = d3.sum(disasterCases, d => d?.jumlah_mangsa||0);
  disasters.jumlah_pps = d3.sum(disasterCases, d => d?.jumlah_pps||0);
	disasters.jumlah_kematian = d3.sum(disasterCases, d => d?.jumlah_kematian||0);

  disasters.by_state = d3.groups(disasterCases, d => d.state)
                  .map(d=>{
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

  disasters.by_district = d3.groups(disasterCases, d => d.state +'-'+ d.district)
                  .map(d=>{
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

  dbg&&console.log('disasters', disasters);



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

  let dateSeriesData: DateSeriesData[]  = [];
  
  let tempSeries = d3.groups(histogram, d => d3.timeDay.floor(d.date) )
                  .map(d=>{
                      return {
                          date: d[0],
                          negeri: [...new Set(d[1].map(d => d.state_id))].length,
                          daerah: [...new Set(d[1].map(d => d.district_id))].length,
                          jumlah_mangsa: d3.sum(d[1], d => d.jumlah_mangsa),
                          jumlah_pps: d3.sum(d[1], d => d.jumlah_pps),
                          jumlah_keluarga: d3.sum(d[1], d => d.jumlah_keluarga),
                      }
                  });

  dbg&&console.log('tempSeries', tempSeries);                  

  // last 30 days from disasters.date                    
  let days = d3.timeDay.range(
    new Date(disasters.date instanceof Date 
      ? disasters.date.getTime() - 1000 * 60 * 60 * 24 * 30 
      : Date.now() - 1000 * 60 * 60 * 24 * 30), 
    disasters.date instanceof Date ? disasters.date : new Date()
  );

  days.forEach(d=>{
    let j = tempSeries.find(k=>+k.date===+d);
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

  
  dbg&&console.log('dateSeriesData', dateSeriesData);


  //-------------------
  // add current data to latest date
  //------------------

	
  dateSeriesData.filter(d=>dayjs(d.date).format('YYYY-MM-DD') == dayjs(disasters.date).format('YYYY-MM-DD'))
    .forEach(d=>{
      d.negeri = disasters?.by_state?.length||0;
      d.daerah = disasters?.by_district?.length||0;
      d.jumlah_mangsa = disasters?.jumlah_mangsa||0;
      d.jumlah_pps = disasters?.jumlah_pps||0;
      d.jumlah_keluarga = disasters?.jumlah_keluarga||0;      

    });

  dateSeriesData.filter(d=>dayjs(d.date).format('YYYY-MM-DD') == dayjs(disasters.date).format('YYYY-MM-DD'))
    .forEach(d=>{
      d.negeri = disasters?.by_state?.length||0;
      d.daerah = disasters?.by_district?.length||0;
      d.jumlah_mangsa = disasters?.jumlah_mangsa||0;
      d.jumlah_pps = disasters?.jumlah_pps||0;
      d.jumlah_keluarga = disasters?.jumlah_keluarga||0;      

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
                      .map(d=>{
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

  dbg&&console.log('listByStates', listByStates);

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

  let listByDistricts = d3.groups(disasterCases, d => d.state +'-'+ d.district)
                      .map(d=>{
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

  dbg&&console.log('listByDistricts', listByDistricts);

	//-------------------
	// SEO
	//-------------------

  import SEO from '$lib/components/shared/seo.svelte';

  // import MapChoropethDaerah from '$lib/components/dashboard/map-choropleth/map_daerah.svelte';                      

  dbg&&console.groupEnd(pageKey);

</script>




<SEO 
  title="NADMA MyDIMS - Sistem Pengurusan Maklumat Bencana Malaysia"
  description="Dashbord maklumat bencana terkini oleh NADMA Malaysia. Pantau banjir, tanah runtuh, dan bencana alam lain di seluruh Malaysia."
  keywords="NADMA, MyDIMS, bencana, banjir, tanah runtuh, Malaysia, sistem pengurusan bencana, maklumat bencana, pusat pemindahan sementara, PPS"
  locale="ms_MY"
  alternateLocale="en_MY"
  url="https://mydims.nadma.gov.my"
/>


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
