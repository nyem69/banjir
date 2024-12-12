import adapter from '@sveltejs/adapter-cloudflare';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter({
			// Enable nodejs_compat
			runtime: {
				type: 'edge',
				flags: ['nodejs_compat']
			}
		}),
		alias: {
			"@/*": "./src/lib/*",
			$lib: './src/lib',
			$layerchart: './node_modules/layerchart/dist'
		}		
	},
	preprocess: vitePreprocess()
};

export default config;
