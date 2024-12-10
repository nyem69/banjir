<script lang="ts">
	import '../app.css';

	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';

	// Store for sidebar state
	export const sidebarOpen = writable(false);

	import * as Sidebar from "$lib/components/ui/sidebar/index.js";
	import AppSidebar from "$lib/components/dashboard/app-sidebar.svelte";


	import Search from "$lib/components/dashboard/search.svelte";
	import UserNav from "$lib/components/dashboard/user-nav.svelte";
	import MainNav from "$lib/components/dashboard/main-nav.svelte";

	import type { AvailableLanguageTag } from '$lib/paraglide/runtime';
	import { languageTag } from '$lib/paraglide/runtime';
	import { i18n } from "$lib/i18n";
	import { ParaglideJS } from "@inlang/paraglide-sveltekit";
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import * as m from '$lib/paraglide/messages.js';

	// import { Button } from 'svelte-ux';
	import { Button } from "$lib/components/ui/button/index.js";
	
	function switchToLanguage(newLanguage: AvailableLanguageTag) {
		const canonicalPath = i18n.route($page.url.pathname);
		const localisedPath = i18n.resolveRoute(canonicalPath, newLanguage);
		goto(localisedPath);
	}



	let darkMode = $state(false);
	let isMobile = $state(false);

	// Check for screen size
	const checkScreenSize = () => {
		isMobile = window.innerWidth <= 768;
	};

	
	onMount(() => {
		// Check initial system preference
		darkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
		updateTheme();

		checkScreenSize();
		window.addEventListener('resize', checkScreenSize);
		return () => window.removeEventListener('resize', checkScreenSize);

	});
	
	function toggleTheme() {
		darkMode = !darkMode;
		updateTheme();
	}
	
	function updateTheme() {
		if (darkMode) {
			document.documentElement.classList.add('dark');
		} else {
			document.documentElement.classList.remove('dark');
		}
	}



	import type { Snippet } from 'svelte';
    import type { LayoutData } from './$types';	
	// let { children } = $props();
	let { data, children }: { data: LayoutData, children: Snippet } = $props();

</script>

<ParaglideJS {i18n}>


	<Sidebar.Provider bind:open={$sidebarOpen}>
		<!-- <AppSidebar /> -->
		<!-- <main class="w-full"style="width: calc(100% - 24px);">		 -->
		<main class="w-full" style="width: calc(100% - 24px);">		
				<div class="flex border-b items-center flex-wrap justify-center">
				<!-- <div class="flex-1 mt-2 ml-2" style="order:{isMobile ? 1 : 1}">
					<Sidebar.Trigger />
				</div> -->
				<!-- <div class="flex-1" style="order:{isMobile ? 3 : 2}">
					<MainNav class="mx-6" />
				</div>  
				<div class="flex-1" style="order:{isMobile ? 4 : 3}">
					<Search />
				</div>   -->
				<!-- <div class="flex-2" style="order:{isMobile ? 2 : 4}"> -->
				<div class="flex-1" style="order:1">
					<div class="flex h-16 items-center px-4 gap-1 justify-end">
						<Button variant={languageTag()=='ms'?'secondary':'primary'} size="sm" onclick={() => switchToLanguage('ms')}>bm</Button>
						<Button variant={languageTag()=='en'?'secondary':'primary'} size="sm" onclick={() => switchToLanguage('en')}>en</Button>
						<Button variant={languageTag()=='zh'?'secondary':'primary'} size="sm" onclick={() => switchToLanguage('zh')}>中文</Button>
						<Button variant={languageTag()=='ta'?'secondary':'primary'} size="sm" onclick={() => switchToLanguage('ta')}>தமிழ</Button>
						<Button variant="primary" onclick={toggleTheme} class="p-2">
							{#if darkMode}
							  🌙
							{:else}
							  ☀️
							{/if}
						</Button>						
					</div>
				</div>
			</div>			
			
			<!-- {@render children?.()} -->
			{@render children()}
		</main>
	</Sidebar.Provider>

</ParaglideJS>
