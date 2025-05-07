<script lang="ts">
	import { ParaglideJS } from '@inlang/paraglide-sveltekit';
	import '../app.css';
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
	let { children} = $props();
</script>


<Toaster />
<ParaglideJS {i18n}>
	{@render children()}
</ParaglideJS>
