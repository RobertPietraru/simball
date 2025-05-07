import { error, fail, redirect } from '@sveltejs/kit';
import { authService } from '$lib/injection';
import { zod } from 'sveltekit-superforms/adapters';
import { z } from 'zod';
import { message, setError, superValidate } from 'sveltekit-superforms';
import { isValidUUID } from '$lib/utils';
const schema = z.object({
	name: z.string().max(128, 'Numele trebuie sa aiba maxim 128 caractere').min(1, 'Numele este obligatoriu'),
	email: z.string().max(320, 'Emailul trebuie sa aiba maxim 320 caractere').min(1, 'Emailul este obligatoriu'),
	password: z.string().max(640, 'Parola trebuie sa aiba maxim 640 caractere').min(8, 'Parola trebuie sa aiba minim 8 caractere'),
	invitation: z.string().max(120, 'Codul de acces trebuie sa aiba maxim 120 caractere').min(1, 'Codul de acces este obligatoriu'),
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
			setError(form, 'invitation', 'Codul de acces este invalid');
			return fail(400, { form });
		}


		const userId = await authService.createUserAccount({
			email,
			name,
			password,
			invitationId,
		});
		if (userId === 'unknown') {
			setError(form, 'invitation', 'Codul de acces este invalid');
			return fail(400, { form });
		}
		if (userId === 'emailAlreadyExists') {
			setError(form, 'email', 'Emailul este deja inregistrat');
			return fail(400, { form });
		}
		const sessionToken = await authService.generateSessionToken();
		const session = await authService.createSession(sessionToken, userId);

		authService.setSessionTokenCookie(event, sessionToken, session.expiresAt);

		return redirect(302, '/');
	},
};