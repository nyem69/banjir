<script lang="ts">
	import type { AvailableLanguageTag } from '$lib/paraglide/runtime';
	import { i18n } from '$lib/i18n';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import * as m from '$lib/paraglide/messages.js';

	import { Button } from 'svelte-ux';
	
	function switchToLanguage(newLanguage: AvailableLanguageTag) {
		const canonicalPath = i18n.route($page.url.pathname);
		const localisedPath = i18n.resolveRoute(canonicalPath, newLanguage);
		goto(localisedPath);
	}
</script>



<h1>{m.hello_world({ name: 'SvelteKit User' })}</h1>
<div>
	<Button variant="fill" size="sm" onclick={() => switchToLanguage('ms')}>ms</Button>
	<Button variant="fill" size="sm" onclick={() => switchToLanguage('en')}>en</Button>
	<Button variant="fill" size="sm" onclick={() => switchToLanguage('zh')}>zh</Button>
	<Button variant="fill" size="sm" onclick={() => switchToLanguage('ta')}>ta</Button>
</div>
