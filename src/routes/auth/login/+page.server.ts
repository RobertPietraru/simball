import { fail, redirect } from '@sveltejs/kit';
import { authService } from '$lib/server/injection';
import { zod } from 'sveltekit-superforms/adapters';
import { z } from 'zod';
import { setError, superValidate } from 'sveltekit-superforms';
import * as m from '$lib/paraglide/messages.js';
import log from '$lib/logging.js';

const schema = z.object({
	email: z.string().max(320, m.login_email_too_long()),
	password: z.string().max(640, m.login_password_too_long()),
});


export const load = async (event) => {
	if (event.locals.user) {
		return redirect(302, '/');
	}
	const redirectUrl = event.url.searchParams.get('redirect') ?? '/';
	const form = await superValidate(zod(schema));
	return { form, redirectUrl };
};

export const actions = {
	default: async (event) => {

		const actionId = crypto.randomUUID();
		log.info(`Logging in | ${actionId}`);

		const form = await superValidate(event.request, zod(schema));
		if (!form.valid) {
			return fail(400, { form });
		}

		const { email, password } = form.data;
		const userId = await authService.login(email, password);
		if (userId === 'wrongCredentials') {
			log.info(`Wrong credentials | ${actionId}`);
			setError(form, 'email', m.login_wrong_credentials());
			setError(form, 'password', m.login_wrong_credentials());
			return fail(400, { form });
		}
		log.info(`User found | ${actionId}`);
		log.info(`Generating session token | ${actionId}`);
		const sessionToken = await authService.generateSessionToken();
		log.info(`Creating session | ${actionId}`);
		const session = await authService.createSession(sessionToken, userId);
		log.info(`Setting session token cookie | ${actionId}`);
		authService.setSessionTokenCookie(event, sessionToken, session.expiresAt);
		log.info(`Logged in | ${actionId}`);

		const redirectUrl = event.url.searchParams.get('redirect') ?? '/';
		return redirect(302, redirectUrl);
	},
};