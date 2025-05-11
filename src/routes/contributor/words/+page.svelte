<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as m from '$lib/paraglide/messages';
	import {
		Table,
		TableBody,
		TableCell,
		TableHead,
		TableHeader,
		TableRow
	} from '$lib/components/ui/table';
	import { Plus, Pencil } from '@lucide/svelte';
	import { localeDate, withSearchParameters } from '$lib/utils.js';
	import { languageTag } from '$lib/paraglide/runtime';
	import { page } from '$app/state';
	import { i18n } from '$lib/i18n.js';
	const { data } = $props();
</script>

<div class="flex justify-between items-center mb-8">
	<h1 class="text-3xl font-bold">{m.contributor_words_title()}</h1>
	<Button href="/contributor/words/create">
		<Plus />
		{m.contributor_words_add()}
	</Button>
</div>

<div class="border rounded-lg overflow-hidden">
	<Table class="w-full">
		<TableHeader>
			<TableRow class="bg-muted">
				<TableHead class="text-left p-4 font-medium">{m.contributor_words_text()}</TableHead>
				<TableHead class="text-left p-4 font-medium">{m.contributor_words_createdAt()}</TableHead>
				<TableHead class="w-20"></TableHead>
			</TableRow>
		</TableHeader>
		<TableBody>
			{#each data.words as word}
				<TableRow class="border-t">
					<TableCell class="p-4">{word.text}</TableCell>
					<TableCell class="p-4">{localeDate(word.createdAt, languageTag())}</TableCell>
					<TableCell class="p-4">
						<Button href="/contributor/word/{word.id}" variant="outline" size="sm">
							<Pencil />
							{m.edit_word()}
						</Button>
					</TableCell>
				</TableRow>
			{/each}
		</TableBody>
	</Table>
</div>

<div class="flex items-center justify-center space-x-2 py-4">
	<Button
		variant="outline"
		size="sm"
		disabled={data.page === 1}
		href={i18n.resolveRoute(withSearchParameters(page.url, 'page', (data.page - 1).toString()).pathname, languageTag())}
	>
		Previous
	</Button>
	<div class="text-sm">
		Page {data.page} of {Math.ceil(data.total / data.limit)}
	</div>
	<Button
		variant="outline"
		size="sm"
		disabled={data.page >= Math.ceil(data.total / data.limit)}
		href={i18n.resolveRoute(withSearchParameters(page.url, 'page', (data.page + 1).toString()).pathname, languageTag())}
	>
		Next
	</Button>
</div>
