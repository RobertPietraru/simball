<script lang="ts">
	import { enhance } from '$app/forms';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Plus } from '@lucide/svelte';
	import { languageTag } from '$lib/paraglide/runtime.js';
	import { Badge } from '$lib/components/ui/badge/index.js';
	import {
		Table,
		TableBody,
		TableCell,
		TableHead,
		TableHeader,
		TableRow
	} from '$lib/components/ui/table';
	import * as m from '$lib/paraglide/messages.js';
	import { Trash2 } from '@lucide/svelte';
	import { localeDate } from '$lib/utils.js';
	import { toast } from 'svelte-sonner';
	const { data } = $props();
	let loading = $state(false);
</script>

<main class="space-y-8 mb-8">
	<h1 class="text-2xl font-bold">{m.admin_users_users_title()}</h1>
	<Table class="rounded-md border">
		<TableHeader>
			<TableRow>
				<TableHead>{m.admin_users_id()}</TableHead>
				<TableHead>{m.admin_users_name()}</TableHead>
				<TableHead>{m.admin_users_email()}</TableHead>
				<TableHead>{m.admin_users_roles()}</TableHead>
				<TableHead></TableHead>
			</TableRow>
		</TableHeader>
		<TableBody>
			{#each data.users as user}
				<TableRow>
					<TableCell>{user.id}</TableCell>
					<TableCell>{user.name}</TableCell>
					<TableCell>{user.email}</TableCell>
					<TableCell>
						<ul class="flex flex-wrap gap-2">
							{#each user.roles as role}
								{#if role === 'admin'}
									<Badge variant="outline">{m.admin_users_roles_admin()}</Badge>
								{:else if role === 'contributor'}
									<Badge variant="outline">{m.admin_users_roles_contributor()}</Badge>
								{/if}
							{/each}
						</ul>
					</TableCell>
					<TableCell class="justify-end">
						<form
							action="?/deleteUser"
							method="post"
							use:enhance={() => {
								loading = true;
								return async ({ update }) => {
									await update();
									loading = false;
									toast.success(m.admin_users_users_delete_success());
								};
							}}
						>
							<input type="hidden" name="id" value={user.id} />
							<Button variant="destructive" type="submit" disabled={loading}
								><Trash2 class="w-4 h-4" /></Button
							>
						</form>
					</TableCell>
				</TableRow>
			{/each}
		</TableBody>
	</Table>

	<div class="flex gap-2 justify-between">
		<h1 class="text-2xl font-bold">{m.admin_users_admin_invitations_title()}</h1>
		<form
			action="?/createInvitation"
			method="post"
			use:enhance={() => {
				loading = true;
				return async ({ update }) => {
					await update();
					loading = false;
					toast.success(m.admin_users_invitations_create_success());
				};
			}}
		>
			<input type="hidden" name="role" value="admin" />
			<Button type="submit" class="rounded-none">
				<Plus class="w-4 h-4" />
				<span>
					{m.admin_users_roles_admin()}
				</span></Button
			>
		</form>
	</div>
	<Table class="rounded-md border">
		<TableHeader class="p-0 m-0">
			<TableRow class="p-0 m-0">
				<TableHead>{m.admin_users_id()}</TableHead>
				<TableHead>{m.admin_users_invitations_created_at()}</TableHead>
				<TableHead>{m.admin_users_invitations_expires_at()}</TableHead>
			</TableRow>
		</TableHeader>
		<TableBody>
			{#each data.adminInvitations as invitation}
				<TableRow>
					<TableCell>{invitation.id}</TableCell>
					<TableCell>{localeDate(invitation.createdAt, languageTag())}</TableCell>
					<TableCell>{localeDate(invitation.expiresAt, languageTag())}</TableCell>
					<TableCell class="justify-end">
						<form
							action="?/deleteInvitation"
							method="post"
							use:enhance={() => {
								loading = true;
								return async ({ update }) => {
									await update();
									loading = false;
									toast.success(m.admin_users_invitations_delete_success());
								};
							}}
						>
							<input type="hidden" name="id" value={invitation.id} />
							<Button variant="destructive" type="submit" disabled={loading}
								><Trash2 class="w-4 h-4" /></Button
							>
						</form>
					</TableCell>
				</TableRow>
			{/each}
		</TableBody>
	</Table>
	<div class="flex gap-2 justify-between">
		<h1 class="text-2xl font-bold">{m.admin_users_contributor_invitations_title()}</h1>
		<form
			action="?/createInvitation"
			method="post"
			use:enhance={() => {
				loading = true;
				return async ({ update }) => {
					await update();
					loading = false;
				};
			}}
		>
			<input type="hidden" name="role" value="contributor" />
			<Button type="submit" class="rounded-none">
				<Plus class="w-4 h-4" />
				<span>
					{m.admin_users_roles_contributor()}
				</span>
			</Button>
		</form>
	</div>

	<Table class="rounded-md border">
		<TableHeader>
			<TableRow>
				<TableHead>{m.admin_users_id()}</TableHead>
				<TableHead>{m.admin_users_invitations_created_at()}</TableHead>
				<TableHead>{m.admin_users_invitations_expires_at()}</TableHead>
				<TableHead></TableHead>
			</TableRow>
		</TableHeader>
		<TableBody>
			{#each data.contributorInvitations as invitation}
				<TableRow>
					<TableCell>{invitation.id}</TableCell>
					<TableCell>{localeDate(invitation.createdAt, languageTag())}</TableCell>
					<TableCell>{localeDate(invitation.expiresAt, languageTag())}</TableCell>
					<TableCell class="justify-end">
						<form
							action="?/deleteInvitation"
							method="post"
							use:enhance={() => {
								loading = true;
								return async ({ update }) => {
									await update();
									loading = false;
									toast.success(m.admin_users_invitations_delete_success());
								};
							}}
						>
							<input type="hidden" name="id" value={invitation.id} />
							<Button variant="destructive" type="submit" disabled={loading}
								><Trash2 class="w-4 h-4" /></Button
							>
						</form>
					</TableCell>
				</TableRow>
			{/each}
		</TableBody>
	</Table>
</main>
