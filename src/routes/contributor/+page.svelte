<script lang="ts">
	import { BookA, LibraryBig } from '@lucide/svelte';
	import * as m from '$lib/paraglide/messages.js';
	import { i18n } from '$lib/i18n';
</script>

<div class="grid gap-6 md:grid-cols-3">
	<a
		href="/contributor/words"
		class="p-6 bg-card text-card-foreground rounded-lg border border-border hover:border-primary transition-colors"
	>
		<BookA class="w-12 h-12 mb-4" />
		<h2 class="text-2xl font-semibold mb-2">{m.contributor_panel_words()}</h2>
		<p class="text-muted-foreground">{m.contributor_panel_words_description()}</p>
	</a>

	<a
		href="/contributor/sources"
		class="p-6 bg-card text-card-foreground rounded-lg border border-border hover:border-primary transition-colors"
	>
		<LibraryBig class="w-12 h-12 mb-4" />
		<h2 class="text-2xl font-semibold mb-2">{m.contributor_panel_sources()}</h2>
		<p class="text-muted-foreground">{m.contributor_panel_sources_description()}</p>
	</a>
</div>
