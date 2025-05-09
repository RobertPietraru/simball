import { fail, redirect } from '@sveltejs/kit';
import { authService } from '$lib/server/injection';
import { zod } from 'sveltekit-superforms/adapters';
import { z } from 'zod';
import { setError, superValidate } from 'sveltekit-superforms';
import { isValidUUID } from '$lib/utils';
import * as m from '$lib/paraglide/messages.js';
import { i18n } from '$lib/i18n';

const schema = z.object({
	name: z.string().max(128, m.register_name_too_long()).min(1, m.register_name_required()),
	email: z.string().max(320, m.register_email_too_long()).min(1, m.register_email_required()),
	password: z.string().max(640, m.register_password_too_long()).min(8, m.register_password_required()),
	invitation: z.string().max(120, m.register_invitation_too_long()).min(1, m.register_invitation_required()),
});


export const load = async (event) => {
	if (event.locals.user) {
		return redirect(302, '/');
	}

	const pathParams = new URL(event.url).searchParams;
	const pathCode = pathParams.get('code') ?? '';
	const form = await superValidate(zod(schema));
	form.data.invitation = pathCode;
	return { form };
};

export const actions = {
	default: async (event) => {

		const form = await superValidate(event.request, zod(schema));
		if (!form.valid) {
			return fail(400, { form });
		}

		const { email, password, name, invitation: invitationId } = form.data;
		if (!isValidUUID(invitationId)) {
			setError(form, 'invitation', m.register_invitation_error());
			return fail(400, { form });
		}


		const userId = await authService.createContributorAccount({
			email,
			name,
			password,
			invitationId,
		});
		if (userId === 'unknown') {
			setError(form, 'invitation', m.register_invitation_error());
			return fail(400, { form });
		}
		if (userId === 'emailAlreadyExists') {
			setError(form, 'email', m.register_email_already_exists());
			return fail(400, { form });
		}
		const sessionToken = await authService.generateSessionToken();
		const session = await authService.createSession(sessionToken, userId);

		authService.setSessionTokenCookie(event, sessionToken, session.expiresAt);

		return redirect(302, '/');
	},
};