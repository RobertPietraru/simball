<script>
	import { Button } from '$lib/components/ui/button';
	import { Search } from '@lucide/svelte';
	import * as m from '$lib/paraglide/messages.js';
</script>


<div class="flex flex-col items-center justify-center min-h-[60vh] px-4">
	<div class="w-full max-w-[584px] space-y-8">
		<h1 class="text-4xl font-bold text-center mb-8">{m.landing_page_headline()}</h1>
		
		<div class="relative">
			<div class="flex items-center border rounded-full px-6 py-3 shadow-sm hover:shadow-md focus-within:shadow-md">
                <Search class="h-5 w-5 text-muted-foreground" />
				<input 
					type="text"
					class="w-full px-4 outline-none bg-transparent"
					placeholder={m.landing_page_search_placeholder()}
				/>
			</div>
		</div>

		<div class="flex justify-center gap-2">
			<Button variant="outline">{m.landing_page_search_button()}</Button>
			<Button variant="outline">{m.landing_page_feeling_lucky_button()}</Button>
		</div>
	</div>
</div>
