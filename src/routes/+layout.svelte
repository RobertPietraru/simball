<script lang="ts">
	import { ParaglideJS } from '@inlang/paraglide-sveltekit';
	import '../app.css';
	import { ModeWatcher } from 'mode-watcher';
	import { Toaster } from '$lib/components/ui/sonner/index.js';

	import { Sun, Moon, Languages } from '@lucide/svelte';

	import { toggleMode } from 'mode-watcher';
	import { Button } from '$lib/components/ui/button/index.js';

	import type { AvailableLanguageTag } from '$lib/paraglide/runtime';
	import { i18n } from '$lib/i18n';
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import { buttonVariants } from '$lib/components/ui/button/index.js';
	import * as m from '$lib/paraglide/messages.js';

	function switchToLanguage(newLanguage: AvailableLanguageTag) {
		const canonicalPath = i18n.route(page.url.pathname);
		const localisedPath = i18n.resolveRoute(canonicalPath, newLanguage);
		goto(localisedPath);
	}
	let { children } = $props();
</script>

<nav class="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-sm">
	<div class=" mx-auto px-4 py-4">
		<div class="flex items-center justify-between">
			<div class="flex items-center gap-8">
				<a href="/" class="text-2xl font-bold">Simball</a>
			</div>

			<div class="hidden gap-2 md:flex items-center">
				<Button onclick={toggleMode} variant="ghost" size="icon">
					<Sun
						class="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
					/>
					<Moon
						class="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
					/>
					<span class="sr-only">Toggle theme</span>
				</Button>
				<DropdownMenu.Root>
					<DropdownMenu.Trigger class={buttonVariants({ variant: 'ghost', size: 'icon' })}>
						<Languages class="h-[1.2rem] w-[1.2rem]" />
					</DropdownMenu.Trigger>
					<DropdownMenu.Content align="end">
						<DropdownMenu.Item onclick={() => switchToLanguage('ro')}>Română</DropdownMenu.Item>
						<DropdownMenu.Item onclick={() => switchToLanguage('en')}>English</DropdownMenu.Item>
						<DropdownMenu.Item onclick={() => switchToLanguage('hu')}>Magyar</DropdownMenu.Item>
						<DropdownMenu.Item onclick={() => switchToLanguage('uk')}>Українська</DropdownMenu.Item>
						<DropdownMenu.Item onclick={() => switchToLanguage('de')}>Deutsch</DropdownMenu.Item>
						<DropdownMenu.Item onclick={() => switchToLanguage('ru')}>Русский</DropdownMenu.Item>
					</DropdownMenu.Content>
				</DropdownMenu.Root>
				<Button href="/auth/login" variant="outline">Sign In</Button>
			</div>
		</div>
	</div>
</nav>
<ModeWatcher />

<Toaster />
<ParaglideJS {i18n}>
	{@render children()}
</ParaglideJS>
