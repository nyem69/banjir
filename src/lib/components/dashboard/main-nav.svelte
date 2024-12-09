<script lang="ts">
	import { cn } from "$lib/utils.js";

	let className: string | undefined | null = undefined;
	export { className as class };
</script>

<nav class={cn("flex items-center space-x-4 lg:space-x-6", className)}>
	<a
		href="/#bencana"
		class="text-muted-foreground hover:text-primary text-sm font-medium transition-colors"
	>
		Bencana
	</a>    
	<a href="/#banjir" class="hover:text-primary text-sm font-medium transition-colors">
		Banjir
	</a>

	<a
		href="/#cuaca"
		class="text-muted-foreground hover:text-primary text-sm font-medium transition-colors"
	>
		Cuaca
	</a>
	<a
		href="/#udara"
		class="text-muted-foreground hover:text-primary text-sm font-medium transition-colors"
	>
		Kualiti&nbsp;Udara
	</a>

</nav>