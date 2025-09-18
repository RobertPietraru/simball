<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { languageTag } from '$lib/paraglide/runtime';
	import { Search } from '@lucide/svelte';
	import * as m from '$lib/paraglide/messages';
	import * as Table from '$lib/components/ui/table';
	import { Input } from '$lib/components/ui/input';
	import { withSearchParameters } from '$lib/utils';
	import { page } from '$app/state';
	import { goto } from '$app/navigation';

	const { data } = $props();
	let searchInDefinition = $derived(data.searchInDefinition);
	let search = $state(data.search || '');
	$effect(() => {
		search = data.search || '';
	});
</script>

<main class="max-w-6xl mx-auto px-4 py-8 space-y-8">
	<div class="flex flex-col items-center gap-8">
		<h1 class="text-4xl font-bold text-center">
			Simball
			<span class="text-xs text-muted-foreground">
				{languageTag()}
			</span>
		</h1>

		<div class="w-full max-w-3xl space-y-4">
			<div class="flex gap-2">
				<div class="relative flex-1">
					<Search class="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
					<Input
						type="search"
						name="search"
						bind:value={search}
						onkeydown={(e) => {
							if (e.key === 'Enter') {
								goto(withSearchParameters(page.url, 'search', search), { replaceState: true });
							}
						}}
						class="w-full pl-10 pr-4 py-2 "
						placeholder={m.landing_page_search_placeholder()}
					/>
				</div>
				<Button
					type="button"
					variant={searchInDefinition ? 'default' : 'outline'}
					class={searchInDefinition
						? 'bg-primary text-primary-foreground'
						: 'bg-secondary text-secondary-foreground'}
					href={withSearchParameters(
						page.url,
						'searchInDefinition',
						(!searchInDefinition).toString()
					).toString()}
				>
					{m.landing_page_search_in_definition_button()}
				</Button>

				<Button
					variant="default"
					href={withSearchParameters(page.url, 'search', search).toString()}
				>
					{m.landing_page_search_button()}</Button
				>
			</div>
		</div>
	</div>

	<div class="space-y-4">
		{#each data.word.definitions as definition}
			<div class="border-b pb-4 flex flex-col md:flex-row gap-4">
				<h3>{data.word.text}</h3>
				<div class="flex-1">
					<div class="flex items-baseline gap-3 mb-2">
						<span class="text-sm text-muted-foreground">
							{#if definition.source}
								{definition.source.label}
							{:else}
								Definiție
							{/if}
						</span>
						{#if definition.source?.links?.length}
							<div class="text-sm">
								{#each definition.source.links as link}
									<a
										href={link}
										class="text-primary underline hover:text-accent"
										target="_blank"
										rel="noopener noreferrer">{new URL(link).hostname ?? link}</a
									>
								{/each}
							</div>
						{/if}
					</div>
					<p class="whitespace-pre-wrap text-lg">
						{definition.text}
					</p>
				</div>
			</div>
		{/each}
	</div>
</main>
