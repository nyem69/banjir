<script lang="ts">
	import { i18n } from "$lib/i18n";
	import { ParaglideJS } from "@inlang/paraglide-sveltekit";
	import '../app.css';

	import * as Sidebar from "$lib/components/ui/sidebar/index.js";
	import AppSidebar from "$lib/components/app-sidebar.svelte";

	let { children } = $props();
</script>

<ParaglideJS {i18n}>

	<Sidebar.Provider>
		<AppSidebar />
		<main>
			<Sidebar.Trigger />
			{@render children?.()}
		</main>
	</Sidebar.Provider>

</ParaglideJS>
