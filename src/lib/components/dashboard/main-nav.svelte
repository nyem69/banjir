<script lang="ts">
	import { cn } from "$lib/utils.js";
	import * as m from '$lib/paraglide/messages.js';

	let className: string | undefined | null = undefined;
	export { className as class };
</script>

<nav class={cn("flex items-center space-x-4 lg:space-x-6", className)}>
	<a
		href="/#bencana"
		class="text-muted-foreground hover:text-primary text-sm font-medium transition-colors min-w-10"
	>
		{m.disasters()}
	</a>    
	<a href="/#banjir" class="hover:text-primary text-sm font-medium transition-colors min-w-10">
		{m.flood()}
	</a>

	<a
		href="/#cuaca"
		class="text-muted-foreground hover:text-primary text-sm font-medium transition-colors min-w-10"
	>
		{m.weather()}
	</a>
	<a
		href="/#udara"
		class="text-muted-foreground hover:text-primary text-sm font-medium transition-colors min-w-[100px]"
	>
		{m.air_quality()}
	</a>

</nav>