import log from '$lib/logging.js';
export const load = async ({ locals, url, cookies }) => {
    const user = locals.user;
    console.log('cookies', cookies.getAll());
    const isAuthPage = url.pathname.includes('auth');
    return {
        user,
        isAuthPage
    };
};
