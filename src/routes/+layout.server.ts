import log from '$lib/logging.js';
export const load = async ({ locals, url }) => {
    const user = locals.user;
    const isAuthPage = url.pathname.includes('auth');
    return {
        user,
        isAuthPage
    };
};
