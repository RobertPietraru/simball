<script lang="ts">
	import * as Breadcrumb from '$lib/components/ui/breadcrumb/index.js';

	let { children, data } = $props();
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
