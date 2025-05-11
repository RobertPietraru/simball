<script lang="ts">
	import { Languages } from '@lucide/svelte';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import { buttonVariants } from '$lib/components/ui/button/index.js';
	import { goto } from '$app/navigation';
	import { i18n } from '$lib/i18n.js';
	import type { AvailableLanguageTag } from '$lib/paraglide/runtime';
	import { page } from '$app/state';

    import * as m from '$lib/paraglide/messages.js';
	function switchToLanguage(newLanguage: AvailableLanguageTag) {
		const canonicalPath = i18n.route(page.url.pathname);
		const localisedPath = i18n.resolveRoute(canonicalPath, newLanguage);
		goto(localisedPath);
	}
	let { children } = $props();
</script>

<div
	class="relative grid h-[100vh] flex-col items-center justify-center px-8 lg:max-w-none lg:grid-cols-2 lg:px-0"
>
	<DropdownMenu.Root>
		<DropdownMenu.Trigger
			class={buttonVariants({
				variant: 'ghost',
				size: 'icon',
				className: 'absolute right-4 top-4 md:right-8 md:top-8'
			})}
		>
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
	<div class="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
		<div
			class="absolute inset-0 bg-cover"
			style="
				background-position: bottom;
				background-image: linear-gradient(to bottom, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.8) 50%, rgba(0,0,0,0) 100%),
					url(/images/book.jpg);"
		></div>
		<a href="/" class="relative z-20 flex items-center text-lg font-medium">{m.title()}</a>
		<div class="relative z-20 mt-auto">
			<blockquote class="space-y-2">
				<p class="text-lg">
					&ldquo;{m.auth_quote_content()}&rdquo;
				</p>
				<footer class="text-sm">{m.auth_quote_author()}</footer>
			</blockquote>
		</div>
	</div>
	{@render children()}
</div>
