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
	import { tryParseURL } from '$lib/utils.js';
	const { data } = $props();
</script>

<div class="flex justify-between items-center mb-8">
	<h1 class="text-3xl font-bold">{m.contributor_sources_title()}</h1>
	<Button href="/contributor/sources/create">
		<Plus />
		{m.contributor_sources_add()}
	</Button>
</div>

<div class="border rounded-lg overflow-hidden">
	<Table class="w-full">
		<TableHeader>
			<TableRow class="bg-muted">
				<TableHead class="text-left p-4 font-medium">{m.source_label()}</TableHead>
				<TableHead class="text-left p-4 font-medium">{m.source_description()}</TableHead>
				<TableHead class="text-left p-4 font-medium">{m.source_links()}</TableHead>
				<TableHead class="w-20"></TableHead>
			</TableRow>
		</TableHeader>
		<TableBody>
			{#each data.sources as source}
				<TableRow class="border-t">
					<TableCell class="p-4">{source.label}</TableCell>
					<TableCell class="p-4">{source.description}</TableCell>
					<TableCell class="p-4">
						<ul class="list-disc list-inside space-x-2">
							{#each source.links as link}
								<Button variant="outline" size="sm" onclick={() => window.open(link, '_blank')}>
									{tryParseURL(link)?.hostname ?? link}
								</Button>
							{/each}
						</ul>
					</TableCell>
					<TableCell class="p-4">
						<Button href="/contributor/source/{source.id}" variant="outline" size="sm">
							<Pencil />
							{m.edit_source()}
						</Button>
					</TableCell>
				</TableRow>
			{/each}
		</TableBody>
	</Table>
</div>
