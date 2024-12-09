import { json } from '@sveltejs/kit';
import { searchElasticsearch } from '$lib/server/elasticsearch';
import { env } from '$env/dynamic/private';

export async function GET({ params }) {
    const state = params.state;
    
    try {
        // Fetch state-specific disasters data
        const disastersQuery = {
            query: {
                match: {
                    "state.keyword": state
                }
            },
            size: 0,
            aggs: {
                total_incidents: { value_count: { field: "incident_id" } },
                by_district: {
                    terms: { field: "district.keyword", size: 20 }
                },
                by_type: {
                    terms: { field: "incident_type.keyword", size: 20 }
                },
                recent: {
                    top_hits: {
                        size: 5,
                        sort: [{ "incident_date": { order: "desc" } }]
                    }
                }
            }
        };

        // Fetch state-specific air quality data
        const airQualityQuery = {
            query: {
                match: {
                    "state.keyword": state
                }
            },
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

        // Fetch state-specific weather data
        const weatherQuery = {
            query: {
                match: {
                    "state.keyword": state
                }
            },
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
            searchElasticsearch(env.ELASTICSEARCH_DISASTERS_INDEX, disastersQuery),
            searchElasticsearch(env.ELASTICSEARCH_AIRQUALITY_INDEX, airQualityQuery),
            searchElasticsearch(env.ELASTICSEARCH_WEATHER_INDEX, weatherQuery)
        ]);

        return json({
            disasters: disasters.aggregations,
            airQuality: airQuality.aggregations,
            weather: weather.aggregations
        });
    } catch (error) {
        console.error(`Error fetching dashboard data for state ${state}:`, error);
        return json({ error: 'Failed to fetch dashboard data' }, { status: 500 });
    }
}
