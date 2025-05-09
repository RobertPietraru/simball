<script lang="ts">
	import { ParaglideJS } from '@inlang/paraglide-sveltekit';
	import '../app.css';
	import { Toaster } from '$lib/components/ui/sonner/index.js';

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

<Toaster />
<ParaglideJS {i18n}>
	{#if !data.isAuthPage}
		<nav class="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-sm">
			<div class=" mx-auto px-4 py-4">
				<div class="flex items-center justify-between">
					<div class="flex items-center gap-8">
						<a href='/' class="text-2xl font-bold">
							Simball
							<span class="text-xs text-muted-foreground">
								{languageTag()}
							</span>
						</a>
					</div>

					<div class="gap-1 md:gap-3 flex items-center">
						<Button
							onclick={() => {
								isDarkTheme = !isDarkTheme;
							}}
							variant="ghost"
							size="icon"
						>
							<Sun
								class="h-[1.2rem] w-[1.2rem] absolute transition-all duration-500 ease-in-out dark:opacity-0 dark:translate-y-8 dark:rotate-180 dark:scale-75"
							/>
							<Moon
								class="h-[1.2rem] w-[1.2rem] transition-all duration-500 ease-in-out opacity-0 translate-y-8 rotate-180 scale-75 dark:opacity-100 dark:translate-y-0 dark:rotate-0 dark:scale-100"
							/>
							<span class="sr-only">Toggle theme</span>
						</Button>
						<DropdownMenu.Root>
							<DropdownMenu.Trigger class={buttonVariants({ variant: 'ghost', size: 'icon' })}>
								<Languages class="h-[1.2rem] w-[1.2rem]" />
							</DropdownMenu.Trigger>
							<DropdownMenu.Content align="end">
								<DropdownMenu.Item
									onclick={() => switchToLanguage('ro')}
									class={languageTag() === 'ro' ? 'bg-accent' : ''}>Română</DropdownMenu.Item
								>
								<DropdownMenu.Item
									onclick={() => switchToLanguage('en')}
									class={languageTag() === 'en' ? 'bg-accent' : ''}>English</DropdownMenu.Item
								>
								<DropdownMenu.Item
									onclick={() => switchToLanguage('hu')}
									class={languageTag() === 'hu' ? 'bg-accent' : ''}>Magyar</DropdownMenu.Item
								>
								<DropdownMenu.Item
									onclick={() => switchToLanguage('uk')}
									class={languageTag() === 'uk' ? 'bg-accent' : ''}>Українська</DropdownMenu.Item
								>
								<DropdownMenu.Item
									onclick={() => switchToLanguage('de')}
									class={languageTag() === 'de' ? 'bg-accent' : ''}>Deutsch</DropdownMenu.Item
								>
								<DropdownMenu.Item
									onclick={() => switchToLanguage('ru')}
									class={languageTag() === 'ru' ? 'bg-accent' : ''}>Русский</DropdownMenu.Item
								>
							</DropdownMenu.Content>
						</DropdownMenu.Root>
						{#if !data.user}
							<Button href='/auth/login' variant="outline"
								>{m.sign_in_button()}</Button
							>
						{:else}
							<DropdownMenu.Root>
								<DropdownMenu.Trigger
									class={buttonVariants({
										variant: 'default',
										class:
											'rounded-full aspect-square bg-accent text-accent-foreground hover:bg-accent/60'
									})}
								>
									{#if data.user.name}
										<div class="w-8 h-8 flex items-center justify-center">
											{data.user.name
												.split(' ')
												.map((name: string) => name[0])
												.join('')
												.toUpperCase()}
										</div>
									{/if}
								</DropdownMenu.Trigger>
								<DropdownMenu.Content align="end" class="w-56">
									<DropdownMenu.Label>
										<div class="flex items-center gap-2">
											<div
												class="rounded-full aspect-square bg-accent text-accent-foreground hover:bg-accent/60"
											>
												{#if data.user.name}
													<div class=" h-10 w-10 flex items-center justify-center">
														{data.user.name
															.split(' ')
															.map((name: string) => name[0])
															.join('')
															.toUpperCase()}
													</div>
												{/if}
											</div>
											<div class="flex flex-col gap-1 px-2 py-1.5">
												<p class="text-sm font-medium truncate">{data.user.name}</p>
												<p class="text-xs text-muted-foreground capitalize">
													{#if data.user.roles.includes('admin')}
														{m.role_admin_account()}
													{:else if data.user.roles.includes('contributor')}
														{m.role_contributor_account()}
													{/if}
												</p>
											</div>
										</div>
									</DropdownMenu.Label>
									<DropdownMenu.Separator />
									{#if data.user.roles.includes('contributor')}
										<DropdownMenu.Item
											class="flex items-center {window.location.pathname.startsWith(
												i18n.resolveRoute('/contributor')
											)
												? 'bg-accent'
												: ''}"
											onclick={() => goto(i18n.resolveRoute('/contributor'))}
											disabled={signoutLoading}
										>
											<HeartHandshake class="mr-2.5 h-4 w-4" />
											<span>{m.contributor_panel_button()}</span>
										</DropdownMenu.Item>
									{/if}

									<DropdownMenu.Separator />
									{#if data.user.roles.includes('admin')}
										<DropdownMenu.Item
											class="flex items-center {window.location.pathname.startsWith(
												i18n.resolveRoute('/admin')
											)
												? 'bg-accent'
												: ''}"
											onclick={() => goto(i18n.resolveRoute('/admin'))}
											disabled={signoutLoading}
										>
											<ShieldUser class="mr-2.5 h-4 w-4" />
											<span>{m.admin_panel_button()}</span>
										</DropdownMenu.Item>
									{/if}
									<DropdownMenu.Separator />
									<DropdownMenu.Item
										class="flex items-center text-destructive focus:text-destructive"
										onclick={signOut}
										disabled={signoutLoading}
									>
										{#if signoutLoading}
											<Loader2 class="mr-2.5 h-4 w-4 animate-spin" />
										{:else}
											<LogOut class="mr-2.5 h-4 w-4" />
										{/if}
										<span>{m.sign_out_button()}</span>
									</DropdownMenu.Item>
								</DropdownMenu.Content>
							</DropdownMenu.Root>
						{/if}
					</div>
				</div>
			</div>
		</nav>
	{/if}
	{@render children()}
</ParaglideJS>
