<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as m from '$lib/paraglide/messages';
	import { Input } from '$lib/components/ui/input';
	import {
		Table,
		TableBody,
		TableCell,
		TableHead,
		TableHeader,
		TableRow
	} from '$lib/components/ui/table';
	import { Search } from '@lucide/svelte';
	import { localeDate, withSearchParameters } from '$lib/utils.js';
	import { languageTag } from '$lib/paraglide/runtime';
	import { page } from '$app/state';
	import { i18n } from '$lib/i18n.js';
	import { goto } from '$app/navigation';
	let searchInDefinition = $derived(
		(page.url.searchParams.get('searchInDefinition') || 'false') === 'true'
	);
	const { data } = $props();
	let searchInWord = $derived((page.url.searchParams.get('searchInWord') || 'true') === 'true');
	let search = $state(data.search || '');
	$effect(() => {
		search = data.search;
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
								const url = withSearchParameters(page.url, 'search', search);
								goto(url.toString(), { replaceState: true });
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
						searchInDefinition ? 'false' : 'true'
					).toString()}
				>
					{m.landing_page_search_in_definition_button()}
				</Button>
				<Button
					type="button"
					variant={searchInWord ? 'default' : 'outline'}
					class={searchInWord
						? 'bg-primary text-primary-foreground'
						: 'bg-secondary text-secondary-foreground'}
					href={withSearchParameters(
						page.url,
						'searchInWord',
						searchInWord ? 'false' : 'true'
					).toString()}
				>
					{m.landing_page_search_in_word_button()}
				</Button>

				<Button  variant="default" onclick={() => {
					const url = withSearchParameters(page.url, 'search', data.search);
					goto(url.toString(), { replaceState: true });
				}}>
					{m.landing_page_search_button()}</Button
				>
			</div>
		</div>
	</div>

	{#if data.words.length > 0}
		<div class="bg-card rounded-lg border shadow-sm overflow-hidden">
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead class="w-[300px]">Cuvânt</TableHead>
						<TableHead>Definiție</TableHead>
						<TableHead class="w-[180px]">Data adăugării</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{#each data.words as word}
						<TableRow>
							<TableCell class="font-medium">{word.text}</TableCell>
							<TableCell class="text-sm text-muted-foreground">
								{word.definition || 'Fără definiție'}
							</TableCell>
							<TableCell>{localeDate(word.createdAt, languageTag())}</TableCell>
						</TableRow>
					{/each}
				</TableBody>
			</Table>
		</div>

		<div class="flex items-center justify-center gap-4">
			<Button
				variant="outline"
				size="sm"
				disabled={data.page === 1}
				href={withSearchParameters(page.url, 'page', (data.page - 1).toString()).toString()}
			>
				Pagina anterioară
			</Button>
			<div class="text-sm font-medium">
				Pagina {data.page} din {Math.ceil(data.total / data.limit)}
			</div>
			<Button
				variant="outline"
				size="sm"
				disabled={data.page >= Math.ceil(data.total / data.limit)}
				href={withSearchParameters(page.url, 'page', (data.page + 1).toString()).toString()}
			>
				Pagina următoare
			</Button>
		</div>
	{:else}
		<div class="text-center py-12 text-muted-foreground">
			Nu au fost găsite rezultate pentru căutarea dvs.
		</div>
	{/if}
</main>
