import { env } from '$env/dynamic/private';

import {
    ELASTICSEARCH_POV_URL,
    ELASTICSEARCH_POV_API_KEY
} from '$env/static/private';


const headers = {
    'Authorization': `ApiKey ${ELASTICSEARCH_POV_API_KEY}`,
    'Content-Type': 'application/json'
};

export async function searchElasticsearch(index: string, query: any) {
    const response = await fetch(`${ELASTICSEARCH_POV_URL}/${index}/_search`, {
        method: 'POST',
        headers,
        body: JSON.stringify(query)
    });

    if (!response.ok) {
        throw new Error(`Elasticsearch error: ${response.statusText}`);
    }

    return await response.json();
}
