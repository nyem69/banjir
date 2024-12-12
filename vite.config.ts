import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { paraglide } from "@inlang/paraglide-sveltekit/vite";

export default defineConfig({
	plugins: [
		paraglide({
			project: "./project.inlang",
			outdir: "./src/lib/paraglide"
    	}),
		sveltekit()
	],

	server: {
		host: '0.0.0.0', // Bind to all interfaces
		port: 5174, // Default port
		open: true  // Automatically open in browser
	}  	
});
