<script lang="ts">
	import { applyAction, deserialize, enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { fade } from 'svelte/transition';
	import { Textarea } from '$lib/components/ui/textarea';
	import * as m from '$lib/paraglide/messages';
	import { Copy, X } from '@lucide/svelte';
	import { toast } from 'svelte-sonner';

	const { data } = $props();

	let newLink = $state('');

	let form = $state({
		label: '',
		description: '',
		links: [] as string[],
		loading: false
	});

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
		form.loading = true;
		const formData = new FormData();
		formData.append('label', form.label);
		formData.append('description', form.description);
		formData.append('links', JSON.stringify(form.links));

		const response = await fetch('?/create', {
			method: 'POST',
			body: formData
		});
		const result = deserialize(await response.text());
		if (result.type === 'success' || result.type === 'redirect') {
			await applyAction(result);
			toast.success(m.contributor_source_save_success());
		} else {
			toast.error(m.contributor_source_save_error());
		}
		form.loading = false;
	}
	let canSave = $derived(form.label && form.description && form.links.length > 0);
</script>

<div class="flex gap-4">
	<h1 class="text-3xl font-bold mb-8">{m.edit_source()}</h1>
	<div class="flex-1"></div>
	<Button onclick={submitSave} disabled={form.loading || !canSave}>{m.contributor_source_save()}</Button>
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
