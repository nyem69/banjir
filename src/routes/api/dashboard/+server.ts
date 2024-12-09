import { json } from '@sveltejs/kit';
import { searchElasticsearch } from '$lib/server/elasticsearch';
// import { env } from '$env/dynamic/private';

import {
    ELASTICSEARCH_POV_URL,
    ELASTICSEARCH_POV_API_KEY,
    ELASTICSEARCH_DISASTERS_INDEX,
    ELASTICSEARCH_AIRQUALITY_INDEX,
    ELASTICSEARCH_WEATHER_INDEX 
} from '$env/static/private';

import * as d3 from 'd3';

export async function GET() {
    try {

        // Fetch disasters data
        const disastersQuery = {
            size: 0,
            // query: {
            //     // match: {
            //     //     "case.status.keyword": "Aktif"
            //     // }
            //     bool: {
            //         must: [
            //             {
            //                 range: {
            //                     "case.updated_at": {
            //                         gte: "now-1d/d"
            //                     }
            //                 }
            //             }
            //         ]
            //     }
            // },
            aggs: {
                total_incidents: { 
                    value_count: { 
                        field: "id"
                    } 
                },

                disaster_types:{
                    terms: {
                        field: "kategori.name.keyword",
                        size: 20
                    }
                },

                by_state: {
                    terms: { field: "state.name.keyword", size: 20 },
                    aggs: {   
                        by_district: {
                            terms: { 
                                field: "district.name.keyword", 
                                size: 100,                         
                            },
                            aggs: {
                                jumlah_mangsa:{
                                    top_hits: {
                                        size: 1,
                                        sort: [{ "case.updated_at": { order: "desc" } }],
                                        "_source": {
                                            "includes": [ 
                                                "case.updated_at",
                                                "case.jumlah_pps",
                                                "case.jumlah_mangsa",
                                                "case.jumlah_keluarga",
                                                "case.disaster_id",
                                                "kategori.name",
                                                "district.latitude",
                                                "district.longitude",
                                                "district.id",
                                                "state.id",
                                            ]
                                        },
                                    }
                                },
                                deaths: {
                                    max: {
                                        field: "deaths.total_death"
                                    }
                                },
                                cases_histogram:{
                                    date_histogram:{
                                        field: "case.updated_at",
                                        calendar_interval: "1d",
                                        time_zone: "Asia/Jakarta",
                                        min_doc_count: 1
                                    },                                    
                                    aggs:{
                                        disaster_id:{
                                            terms:{
                                                field: "case.disaster_id",
                                                size: 100
                                            },
                                            aggs:{
                                                jumlah_mangsa:{
                                                    max: {
                                                        field: "case.jumlah_mangsa"
                                                    }
                                                },
                                                jumlah_pps:{
                                                    max: {
                                                        field: "case.jumlah_pps"
                                                    }
                                                },
                                                jumlah_keluarga:{
                                                    max: {
                                                        field: "case.jumlah_keluarga"
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        },
                    }
                },
            }
        };

        // Fetch air quality data
        const airQualityQuery = {
            size: 0,
            aggs: {
                latest_readings: {
                    terms: { field: "station.keyword", size: 20 },
                    aggs: {
                        latest: {
                            top_hits: {
                                size: 1,
                                sort: [{ "timestamp": { order: "desc" } }]
                            }
                        }
                    }
                }
            }
        };

        // Fetch weather data
        const weatherQuery = {
            size: 0,
            aggs: {
                latest_readings: {
                    terms: { field: "station.keyword", size: 20 },
                    aggs: {
                        latest: {
                            top_hits: {
                                size: 1,
                                sort: [{ "timestamp": { order: "desc" } }]
                            }
                        }
                    }
                }
            }
        };

        const [disasters, airQuality, weather] = await Promise.all([
            searchElasticsearch(ELASTICSEARCH_DISASTERS_INDEX, disastersQuery),
            // searchElasticsearch(ELASTICSEARCH_AIRQUALITY_INDEX, airQualityQuery),
            // searchElasticsearch(ELASTICSEARCH_WEATHER_INDEX, weatherQuery)
        ]);



        // Define the `disasterCases` array structure
        type DisasterCase = [
            number,
            number,
            number,
            number,
            number,
            number,
            number,
            string    
        ];

        let disasterCases: DisasterCase[] = [];

        // Define the `disasterCases` array structure
        type CasesHistogram = [
            number,
            number,
            number,
            number,
            number,
            number,
            number,
            number,
            number,
        ];

        let casesHistogram: CasesHistogram[] = [];


        let states: { [key: string]: string } = {};

        interface District {
            district_id: number;
            district: string;
            latitude: number;
            longitude: number;
        }

        let districts: District[] = [];

        let disaster_types: { [key: string]: string } = {};
        let disaster_types_fixer: { [key: string]: string } = {};


        //--------------------
        // Set up data
        //------------------
        disasters.aggregations.disaster_types.buckets.forEach((d, i) => {
            disaster_types[i+1] = d.key;
            disaster_types_fixer[d.key] = i+1;
        });

        disasters.aggregations.by_state.buckets.forEach((state) => {
            state.by_district.buckets.forEach((district) => {
                const caseData = district.jumlah_mangsa.hits.hits[0]._source;
                const deaths = district.deaths?.value || 0;

                states[caseData.state.id] = state.key;
                districts.push({
                    district_id: +caseData.district.id,
                    district: district.key,
                    latitude: +caseData.district.latitude,
                    longitude: +caseData.district.longitude
                });

                // disaster_types

                district.cases_histogram.buckets.forEach((d) => {

                    let histogram = d.disaster_id.buckets.map((k) => {
                        // return {
                        //     date: d.key,
                        //     disaster_id: k.key,
                        //     jumlah_mangsa: k.jumlah_mangsa.value,
                        //     jumlah_pps: k.jumlah_pps.value,
                        //     jumlah_keluarga: k.jumlah_keluarga.value,
                        //     district: district.key,
                        //     state: state.key,
                        // };
                        return [
                            +caseData.state.id,
                            +caseData.district.id,
                            (new Date(d.key)).toISOString().slice(0, 10), // d.key_as_string,
                            k.key,
                            k.jumlah_pps.value,
                            k.jumlah_keluarga.value,
                            k.jumlah_mangsa.value,
                        ]
                    });

                    casesHistogram = casesHistogram.concat(histogram);

                });


                if (caseData) {
                    // const caseItem = {
                    //     state: state.key,
                    //     district: district.key,
                    //     kategori: caseData.kategori.name,
                    //     jumlah_mangsa: caseData.case.jumlah_mangsa,
                    //     jumlah_pps: caseData.case.jumlah_pps,
                    //     jumlah_keluarga: caseData.case.jumlah_keluarga,
                    //     jumlah_kematian: deaths,
                    //     updated_at: caseData.case.updated_at,
                    // };

                    const caseItem = [
                        caseData.state.id,
                        caseData.district.id,
                        disaster_types_fixer[caseData.kategori.name],
                        caseData.case.updated_at,
                        caseData.case.jumlah_pps,
                        caseData.case.jumlah_keluarga,
                        caseData.case.jumlah_mangsa,
                        deaths,
                    ]
                    disasterCases.push(caseItem);
                }
            });
        });


        disasterCases.sort((a, b) => {
            return b[3] - a[3];
        });


        // disasterCases = disasterCases.filter(d=>new Date(d[3]).getTime() > Date.now() - 24*60*60*1000);

        casesHistogram.sort((a, b) => {
            return new Date(b[2]) - new Date(a[2]);
        });


        districts.sort((a, b) => {
            return a.district_id - b.district_id;
        });



        return json({

            disasters: {
                cases: {
                    columns: [
                        'state_id',
                        'district_id',
                        'kategori_id',
                        'updated_at',
                        'jumlah_pps',
                        'jumlah_keluarga',
                        'jumlah_mangsa',
                        'jumlah_kematian',
                    ],
                    rows: disasterCases
                },
                histogram: {
                    columns: [
                        'state_id',
                        'district_id',
                        'date',
                        'disaster_id',
                        'jumlah_pps',
                        'jumlah_keluarga',
                        'jumlah_mangsa',
                    ],
                    rows: casesHistogram
                },
                // res: disasters,
            },
            // airQuality: airQuality.aggregations,
            // weather: weather.aggregations
            airQuality: {},
            weather: {},

            defs:{
                states: states||{},
                districts: districts||[],   
                kategori: disaster_types||{}
            },
        });
    } catch (error) {
        console.error('Error fetching dashboard data:', error);
        return json({ error: 'Failed to fetch dashboard data' }, { status: 500 });
    }
}
