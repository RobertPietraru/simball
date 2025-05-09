import log from '$lib/logging.js';
import { authService } from '$lib/server/injection';
import { json, redirect } from '@sveltejs/kit';
import { i18n } from '$lib/i18n';
export async function POST(event) {
    if (!event.locals.session) {
        log.error('No session found');
        return json({ error: 'Unauthorized' }, { status: 401 });
    }
    await authService.invalidateSession(event.locals.session.id);
    authService.deleteSessionTokenCookie(event);
    
     redirect(302, i18n.resolveRoute('/auth/login'));
    
}