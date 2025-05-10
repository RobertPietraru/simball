<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Textarea } from '$lib/components/ui/textarea';
	import * as m from '$lib/paraglide/messages';

	export let data;

	let links = data.source.links;
	let newLink = '';

	function addLink() {
		if (newLink) {
			links = [...links, newLink];
			newLink = '';
		}
	}

	function removeLink(index: number) {
		links = links.filter((_, i) => i !== index);
	}
</script>

<div class="max-w-2xl mx-auto py-8">
	<h1 class="text-3xl font-bold mb-8">{m.edit_source()}</h1>

	<form
		method="POST"
		action="?/save"
		use:enhance={() => {
			return async ({ result }) => {
				if (result.type === 'success') {
					goto('/contributor/sources');
				}
			};
		}}
		class="space-y-6"
	>
		<div class="space-y-2">
			<label for="label" class="text-sm font-medium">{m.source_label()}</label>
			<Input type="text" id="label" name="label" value={data.source.label} required />
		</div>

		<div class="space-y-2">
			<label for="description" class="text-sm font-medium">{m.source_description()}</label>
			<Textarea id="description" name="description" value={data.source.description} />
		</div>

		<div class="space-y-2">
			<label class="text-sm font-medium">{m.source_links()}</label>
			<div class="flex gap-2">
				<Input type="text" bind:value={newLink} placeholder={m.add_link_placeholder()} />
				<Button type="button" onclick={addLink}>{m.contributor_source_add()}</Button>
			</div>
			<input type="hidden" name="links" value={JSON.stringify(links)} />

			<ul class="mt-4 space-y-2">
				{#each links as link, i}
					<li class="flex items-center gap-2">
						<span class="flex-1 break-all">{link}</span>
						<Button type="button" variant="destructive" size="sm" onclick={() => removeLink(i)}>
							{m.contributor_source_remove()}
						</Button>
					</li>
				{/each}
			</ul>
		</div>
	</form>

	<div class="flex justify-between">
		<Button type="submit">{m.contributor_source_save()}</Button>

		<form
			method="POST"
			action="?/delete"
			use:enhance={() => {
				return async ({ result }) => {
					if (result.type === 'success') {
						goto('/contributor/sources');
					}
				};
			}}
		>
			<input type="hidden" name="id" value={data.source.id} />
			<Button type="submit" variant="destructive">{m.contributor_source_delete()}</Button>
		</form>
	</div>
</div>
