<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Alert, AlertDescription } from '$lib/components/ui/alert';
	import * as m from '$lib/paraglide/messages.js';

	import { superForm } from 'sveltekit-superforms';
	import { Loader2 } from '@lucide/svelte';
	import { i18n } from '$lib/i18n';
	let { data } = $props();
	const { form, message, errors } = superForm(data.form);
	let isLoading = $state(false);
</script>

<div class="lg:p-8">
	<div class="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
		<div class="flex flex-col space-y-2 text-center">
			<h1 class="text-2xl font-semibold tracking-tight">{m.register_title()}</h1>
			<p class="text-sm text-muted-foreground">{m.register_description()}</p>
		</div>

		<div class="grid gap-6">
			<form method="POST">
				{#if $message}
					<Alert variant="destructive" class="mb-4" data-test="error-message">
						<AlertDescription>{$message}</AlertDescription>
					</Alert>
				{/if}
				<div class="grid gap-2">
					<div class="flex gap-2">
						<Label class="sr-only" for="name">{m.register_name_placeholder()}</Label>
						<Input
							id="name"
							placeholder={m.register_name_placeholder()}
							name="name"
							type="text"
							aria-invalid={$errors.name ? 'true' : 'false'}
							required
							bind:value={$form.name}
						/>
						{#if $errors.name}
							<p class="text-destructive" data-test="firstName-error">
								{$errors.name}
							</p>
						{:else}
							<p class="text-destructive"></p>
						{/if}
					</div>

					<div class="grid gap-1">
						<Label class="sr-only" for="email">Email</Label>
						<Input
							id="email"
							placeholder={m.register_email_placeholder()}
							name="email"
							autocapitalize="none"
							autocomplete="email"
							autocorrect="off"
							type="email"
							aria-invalid={$errors.email ? 'true' : 'false'}
							required
							bind:value={$form.email}
						/>
						{#if $errors.email}
							<p class="text-destructive" data-test="email-error">
								{$errors.email}
							</p>
						{:else}
							<p class="text-destructive"></p>
						{/if}
					</div>

					<div class="grid gap-1">
						<Label class="sr-only" for="password">Parola</Label>
						<Input
							id="password"
							name="password"
							type="password"
							placeholder={m.register_password_placeholder()}
							aria-invalid={$errors.password ? 'true' : 'false'}
							bind:value={$form.password}
							autocomplete="new-password"
							required
						/>
						{#if $errors.password}
							<p class="text-destructive" data-test="password-error">
								{$errors.password}
							</p>
						{:else}
							<p class="text-destructive"></p>
						{/if}
					</div>

					<div class="grid gap-1">
						<Label class="sr-only" for="invitation">{m.register_invitation_placeholder()}</Label>
						<Input
							id="invitation"
							name="invitation"
							type="text"
							placeholder={m.register_invitation_placeholder()}
							aria-invalid={$errors.invitation ? 'true' : 'false'}
							bind:value={$form.invitation}
							required
						/>
						{#if $errors.invitation}
							<p class="text-destructive" data-test="invitation-error">
								{$errors.invitation}
							</p>
						{:else}
							<p class="text-destructive"></p>
						{/if}
					</div>

					<Button type="submit" disabled={isLoading}>
						{#if isLoading}
							<Loader2 class="mr-2 h-4 w-4 animate-spin" />
						{/if}
						{m.register_submit_button()}
					</Button>
				</div>
			</form>
			<div class="relative">
				<div class="absolute inset-0 flex items-center">
					<span class="w-full border-t" />
				</div>
				<div class="relative flex justify-center text-xs uppercase">
					<span class="bg-background px-2 text-muted-foreground"
						>{m.register_alternative_text()}</span
					>
				</div>
			</div>
			<Button variant="outline" type="button" href="/auth/login?redirect={data.redirectUrl}"
				>{m.register_alternative_button()}</Button
			>
		</div>

		<p class="px-8 text-center text-sm text-muted-foreground">
			{m.register_terms_and_conditions()}
		</p>
	</div>
</div>
