<script lang="ts">
	import { Input } from "$lib/components/ui/input/index.js";
	import * as m from '$lib/paraglide/messages.js';

</script>

<div>
	<Input type="search" placeholder={m.search()} class="h-9 md:w-[100px] lg:w-[300px]" />
</div>