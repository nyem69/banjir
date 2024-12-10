import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch, depends }) => {
    // Mark this load function as depending on the 'app:disasters' key
    depends('app:disasters');

    const response = await fetch('/api/dashboard');
    const data = await response.json();


    // const resp = await fetch('https://geodata.pages.dev/geo/malaysia_states-stateid.json');
    // data.topojson = await resp.json();


    // load topjson daerah    
    const resp2 = await fetch('https://geodata.pages.dev/geo/mas_subdistrict_01-s5.json');
    data.topojson_daerah = await resp2.json();


    return data;
};
