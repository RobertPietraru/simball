<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import {
		Card,
		CardContent,
		CardDescription,
		CardHeader,
		CardTitle
	} from '$lib/components/ui/card';
	import { localeDate } from '$lib/utils';
	import { languageTag } from '$lib/paraglide/runtime';

	const { data } = $props();
</script>

<div class="space-y-6">
	{#each data.word.definitions as definition}
		<div class="border-b pb-4">
			<div>

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
