<script lang="ts">
	import { applyAction, deserialize, enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { fade } from 'svelte/transition';
	import { Textarea } from '$lib/components/ui/textarea';
	import * as m from '$lib/paraglide/messages';
	import { Copy, Loader2, X } from '@lucide/svelte';
	import { toast } from 'svelte-sonner';

	const { data } = $props();

	let newLink = $state('');

	let form = $state({
		label: data.source.label,
		description: data.source.description,
		links: data.source.links,
		loading: false
	});
	$effect(() => {
		form.label = data.source.label;
		form.description = data.source.description;
		form.links = data.source.links;
	});
	let canSave = $derived(
		form.label &&
			form.description &&
			form.links.length > 0 &&
			JSON.stringify({
				label: form.label,
				description: form.description,
				links: form.links
			}) !==
				JSON.stringify({
					label: data.source.label,
					description: data.source.description,
					links: data.source.links
				})
	);

	function addLink() {
		if (newLink) {
			form.links.push(newLink);
			newLink = '';
		}
	}

	function removeLink(index: number) {
		form.links.splice(index, 1);
	}

	async function submitSave() {
		const formData = new FormData();
		formData.append('id', data.source.id);
		formData.append('label', form.label);
		formData.append('description', form.description);
		formData.append('links', JSON.stringify(form.links));
		const response = await fetch('?/save', {
			method: 'POST',
			body: formData
		});
		const result = deserialize(await response.text());
		if (result.type === 'success') {
			invalidateAll();
		} else {
			toast.error(m.contributor_source_save_error());
		}
	}
</script>

<div class="flex gap-4">
	<h1 class="text-3xl font-bold mb-8">{m.edit_source()}</h1>
	<div class="flex-1"></div>
	<form
		method="POST"
		action="?/delete"
		use:enhance={() => {
			form.loading = true;
			return async ({ result }) => {
				await applyAction(result);
				form.loading = false;
				toast.success(m.contributor_source_delete_success());
			};
		}}
	>
		<input type="hidden" name="id" value={data.source.id} />
		<Button type="submit" variant="destructive" disabled={form.loading}>
			{#if form.loading}
				<Loader2 class="w-4 h-4 animate-spin" />
			{/if}
			{m.contributor_source_delete()}
		</Button>
	</form>

	<Button disabled={form.loading || !canSave} onclick={submitSave}>
		{#if form.loading}
			<Loader2 class="w-4 h-4 animate-spin" />
		{/if}
		{m.contributor_source_save()}
	</Button>
</div>

<div class="space-y-6">
	<div class="space-y-2">
		<label for="label" class="text-sm font-medium">{m.source_label()}</label>
		<Input type="text" id="label" name="label" bind:value={form.label} required />
	</div>

	<div class="space-y-2">
		<label for="description" class="text-sm font-medium">{m.source_description()}</label>
		<Textarea id="description" name="description" bind:value={form.description} />
	</div>

	<div class="space-y-2">
		<label class="text-sm font-medium">{m.source_links()}</label>
		<div class="flex gap-2">
			<Input type="text" bind:value={newLink} placeholder={m.add_link_placeholder()} />
			<Button type="button" onclick={addLink}>{m.contributor_source_add()}</Button>
		</div>

		<ul class="mt-4 space-y-2 bg-secondary">
			{#each form.links as link, i}
				<li class="flex items-center gap-2" transition:fade>
					<Button type="button" variant="ghost" onclick={() => removeLink(i)}>
						<Copy />
					</Button>
					<span class="flex-1 break-all">{link}</span>
					<Button type="button" variant="destructive" onclick={() => removeLink(i)}>
						<X />
					</Button>
				</li>
			{/each}
		</ul>
	</div>
</div>
