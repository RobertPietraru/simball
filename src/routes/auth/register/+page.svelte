<script lang="ts">
	import { Button } from "$lib/components/ui/button";
	import { Input } from "$lib/components/ui/input";
	import { Label } from "$lib/components/ui/label";
	import { Alert, AlertDescription } from "$lib/components/ui/alert";
	import {
		Card,
		CardHeader,
		CardTitle,
		CardContent,
		CardFooter,
	} from "$lib/components/ui/card";
	import SuperDebug, { superForm } from "sveltekit-superforms";
	import { Loader2, ArrowLeft } from "@lucide/svelte";

	let { data } = $props();
	const { form, message, errors } = superForm(data.form);
	let isLoading = $state(false);
</script>

<div
	class="relative grid h-[100vh] flex-col items-center justify-center px-8 lg:max-w-none lg:grid-cols-2 lg:px-0"
>
	<Button
		href="/"
		variant="ghost"
		class="absolute right-4 top-4 md:right-8 md:top-8"
	>
		<ArrowLeft class="h-4 w-4" />
	</Button>
	<div
		class="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex"
	>
		<div
			class="absolute inset-0 bg-cover"
			style="
				background-image: linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.5) 100%),
					url(/images/shake.jpg);"
		/>
		<div class="relative z-20 flex items-center text-lg font-medium">
			Enroute
		</div>
		<div class="relative z-20 mt-auto">
			<blockquote class="space-y-2">
				<p class="text-lg">
					&ldquo;Această aplicație mă ajută să-mi gestionez clienții
					în mod eficient. Este perfectă pentru activitatea mea de
					agent de vânzări!&rdquo;
				</p>
				<footer class="text-sm">Utilizator anonim</footer>
			</blockquote>
		</div>
	</div>
	<div class="lg:p-8">
		<div
			class="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]"
		>
			<div class="flex flex-col space-y-2 text-center">
				<h1 class="text-2xl font-semibold tracking-tight">
					Creează un cont nou
				</h1>
				<p class="text-sm text-muted-foreground">
					Completează datele pentru a crea un cont nou
				</p>
			</div>

			<div class="grid gap-6">
				<form method="POST">
					{#if $message}
						<Alert
							variant="destructive"
							class="mb-4"
							data-test="error-message"
						>
							<AlertDescription>{$message}</AlertDescription>
						</Alert>
					{/if}
					<div class="grid gap-2">
						<div class="flex gap-2">
							<Label class="sr-only" for="name">Nume</Label>
							<Input
								id="name"
								placeholder="Nume"
								name="name"
								type="text"
								aria-invalid={$errors.name ? "true" : "false"}
								required
								bind:value={$form.name}
							/>
							{#if $errors.name}
								<p
									class="text-destructive"
									data-test="firstName-error"
								>
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
								placeholder="email@exemplu.com"
								name="email"
								autocapitalize="none"
								autocomplete="email"
								autocorrect="off"
								type="email"
								aria-invalid={$errors.email ? "true" : "false"}
								required
								bind:value={$form.email}
							/>
							{#if $errors.email}
								<p
									class="text-destructive"
									data-test="email-error"
								>
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
								placeholder="Parola"
								aria-invalid={$errors.password
									? "true"
									: "false"}
								bind:value={$form.password}
								autocomplete="new-password"
								required
							/>
							{#if $errors.password}
								<p
									class="text-destructive"
									data-test="password-error"
								>
									{$errors.password}
								</p>
							{:else}
								<p class="text-destructive"></p>
							{/if}
						</div>

						<div class="grid gap-1">
							<Label class="sr-only" for="invitation"
								>Cod de acces</Label
							>
							<Input
								id="invitation"
								name="invitation"
								type="text"
								placeholder="Cod de acces"
								aria-invalid={$errors.invitation
									? "true"
									: "false"}
								bind:value={$form.invitation}
								required
							/>
							{#if $errors.invitation}
								<p
									class="text-destructive"
									data-test="invitation-error"
								>
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
							Înregistrează-te
						</Button>
					</div>
				</form>
				<div class="relative">
					<div class="absolute inset-0 flex items-center">
						<span class="w-full border-t" />
					</div>
					<div class="relative flex justify-center text-xs uppercase">
						<span class="bg-background px-2 text-muted-foreground"
							>Sau, dacă ai deja cont</span
						>
					</div>
				</div>
				<Button variant="outline" type="button" href="/auth/login"
					>Autentifică-te</Button
				>
			</div>

			<p class="px-8 text-center text-sm text-muted-foreground">
				Continuând, accepți
				<a
					href="/terms"
					class="underline underline-offset-4 hover:text-primary"
				>
					Termenii și condițiile
				</a>
				și
				<a
					href="/privacy"
					class="underline underline-offset-4 hover:text-primary"
				>
					Politica de confidențialitate
				</a>
				.
			</p>
		</div>
	</div>
</div>
