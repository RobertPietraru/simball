<script lang="ts">
	import {
		Sun,
		Moon,
		Languages,
		LogOut,
		User,
		ShieldUser,
		HeartHandshake,
		Loader2
	} from '@lucide/svelte';

	// import { toggleMode } from 'mode-watcher';
	import { Button } from '$lib/components/ui/button/index.js';

	import { languageTag, type AvailableLanguageTag } from '$lib/paraglide/runtime';
	import { i18n } from '$lib/i18n';
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import { buttonVariants } from '$lib/components/ui/button/index.js';
	import * as m from '$lib/paraglide/messages.js';
	import { toast } from 'svelte-sonner';
	import { onMount } from 'svelte';

	import * as Breadcrumb from '$lib/components/ui/breadcrumb/index.js';

	function switchToLanguage(newLanguage: AvailableLanguageTag) {
		console.log('languageTag', languageTag());
		const canonicalPath = i18n.route(page.url.pathname);
		const localisedPath = i18n.resolveRoute(canonicalPath, newLanguage);
		goto(localisedPath);
	}
	let signoutLoading = $state(false);
	async function signOut() {
		signoutLoading = true;
		const response = await fetch('/auth/logout', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			}
		});
		if (response.ok) {
			signoutLoading = false;
			goto('/auth/login');
		} else {
			signoutLoading = false;
			toast.error(m.sign_out_error());
		}
	}
	let { children, data } = $props();
	let isDarkTheme = $state(false);
	onMount(() => {
		isDarkTheme = localStorage.getItem('isDarkTheme') === 'true';
	});
	$effect(() => {
		const htmlEl = document.documentElement;
		if (isDarkTheme) {
			localStorage.setItem('isDarkTheme', 'true');
			htmlEl.classList.add('dark');
		} else {
			localStorage.setItem('isDarkTheme', 'false');
			htmlEl.classList.remove('dark');
		}
	});
</script>

<div class="container">
	<Breadcrumb.Root class="py-4">
		<Breadcrumb.List>
			<Breadcrumb.Separator class="p-0 m-0" />
			{#each data.crumbs as crumb, index}
				<Breadcrumb.Item>
					<Breadcrumb.Link href={crumb.href}>{crumb.label}</Breadcrumb.Link>
				</Breadcrumb.Item>
				{#if index < data.crumbs.length - 1}
					<Breadcrumb.Separator />
				{/if}
			{/each}
		</Breadcrumb.List>
	</Breadcrumb.Root>

	{@render children()}
</div>
