<script lang="ts">
	import '../app.css';


	import * as Sidebar from "$lib/components/ui/sidebar/index.js";
	import AppSidebar from "$lib/components/dashboard/app-sidebar.svelte";


	import Search from "$lib/components/dashboard/search.svelte";
	import UserNav from "$lib/components/dashboard/user-nav.svelte";
	import MainNav from "$lib/components/dashboard/main-nav.svelte";

	import type { AvailableLanguageTag } from '$lib/paraglide/runtime';
	import { i18n } from "$lib/i18n";
	import { ParaglideJS } from "@inlang/paraglide-sveltekit";
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import * as m from '$lib/paraglide/messages.js';

	import { Button } from 'svelte-ux';
	
	function switchToLanguage(newLanguage: AvailableLanguageTag) {
		const canonicalPath = i18n.route($page.url.pathname);
		const localisedPath = i18n.resolveRoute(canonicalPath, newLanguage);
		goto(localisedPath);
	}



	import type { Snippet } from 'svelte';
    import type { LayoutData } from './$types';	
	// let { children } = $props();
	let { data, children }: { data: LayoutData, children: Snippet } = $props();

</script>

<ParaglideJS {i18n}>

	<Sidebar.Provider>
		<AppSidebar />
		<main class="w-full">		


			<div class="flex w-full border-b items-center">
				<div class="flex-1 mt-2 ml-2">
					<Sidebar.Trigger />
				</div>
				<div class="flex-1">
					<div class="flex h-16 items-center px-4">
						<MainNav class="mx-6" />
						<div class="ml-auto flex items-center space-x-4">
							<Search />
							<UserNav />
						</div>
					</div>
				</div>  
				<div class="flex-2">
					<div class="flex h-16 items-center px-4 gap-1">
						<Button variant="fill" size="sm" onclick={() => switchToLanguage('ms')}>bm</Button>
						<Button variant="fill" size="sm" onclick={() => switchToLanguage('en')}>en</Button>
						<Button variant="fill" size="sm" onclick={() => switchToLanguage('zh')}>中文</Button>
						<Button variant="fill" size="sm" onclick={() => switchToLanguage('ta')}>தமிழ</Button>
					</div>
				</div>
			</div>			
			
			<!-- {@render children?.()} -->
			{@render children()}
		</main>
	</Sidebar.Provider>

</ParaglideJS>
