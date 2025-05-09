<script lang="ts">
	import { ParaglideJS } from '@inlang/paraglide-sveltekit';
	import '../app.css';
	import { Toaster } from '$lib/components/ui/sonner/index.js';
	import { i18n } from '$lib/i18n';
	let { children} = $props();
</script>


<Toaster />
<ParaglideJS {i18n}>
	{@render children()}
</ParaglideJS>
