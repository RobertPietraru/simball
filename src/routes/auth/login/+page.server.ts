import { error, fail, redirect } from '@sveltejs/kit';
import { authService } from '$lib/injection';
import { zod } from 'sveltekit-superforms/adapters';
import { z } from 'zod';
import { message, setError, superValidate } from 'sveltekit-superforms';

const schema = z.object({
	email: z.string().max(320, 'Emailul trebuie sa aiba maxim 320 caractere'),
	password: z.string().max(640, 'Parola trebuie sa aiba maxim 640 caractere'),
});


export const load = async (event) => {
	if (event.locals.user) {
		return redirect(302, '/');
	}
	const form = await superValidate(zod(schema));
	return { form };
};

export const actions = {
	default: async (event) => {
		const form = await superValidate(event.request, zod(schema));
		if (!form.valid) {
			return fail(400, { form });
		}

		const { email, password } = form.data;
		const userId = await authService.login(email, password);
		if (userId === 'wrongCredentials') {
			setError(form, 'email', 'Email sau parola gresita');
			setError(form, 'password', 'Email sau parola gresita');
			return fail(400, { form });
		}
		const sessionToken = await authService.generateSessionToken();
		const session = await authService.createSession(sessionToken, userId);

		authService.setSessionTokenCookie(event, sessionToken, session.expiresAt);

		return redirect(302, '/');
	},
};