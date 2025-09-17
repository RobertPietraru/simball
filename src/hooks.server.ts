import { i18n } from '$lib/i18n';
import { injection } from '$lib/server/injection';
import { redirect, type Handle, } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
const handleParaglide: Handle = i18n.handle();
const handleAuth: Handle = async ({ event, resolve }) => {
	const { authService } = injection();
	const sessionToken = event.cookies.get(authService.sessionCookieName);
	if (!sessionToken) {
		event.locals.user = null;
		event.locals.session = null;
		return resolve(event);
	}

	const { session, user } = await authService.validateSessionTokenAndReturnUser(sessionToken);
	if (session) {
		authService.setSessionTokenCookie(event, sessionToken, session.expiresAt);
	} else {
		authService.deleteSessionTokenCookie(event);
	}

	event.locals.user = user;
	event.locals.session = session;


	return resolve(event);
};


const protectedRoutes = ['/contributor', '/admin'];
export const authentication: Handle = async ({ event, resolve }) => {
	// Protect any routes that don't start with the unprotectedPrefix or are not the root path
	if (protectedRoutes.some((path) => event.url.pathname.includes(path)) && !event.locals.user) {
		redirect(303, i18n.resolveRoute('/auth/login?redirect=' + event.url.pathname));
	}

	// If the request is still here, just proceed as normally
	const result = await resolve(event);
	return result;
};

export const adminAuthorization: Handle = async ({ event, resolve }) => {
	// Protect any routes that don't start with the unprotectedPrefix or are not the root path
	if (event.url.pathname.includes('/admin') && !event.locals.user?.roles.includes('admin')) {
		redirect(303, i18n.resolveRoute('/')	);
	}

	// If the request is still here, just proceed as normally
	const result = await resolve(event);
	return result;
};


export const handle: Handle = sequence(handleParaglide, handleAuth, authentication, adminAuthorization);



