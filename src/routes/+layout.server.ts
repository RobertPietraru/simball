export const load = async ({ locals, url, cookies }) => {
    const user = locals.user;
    const isAuthPage = url.pathname.includes('auth');
    return {
        user,
        isAuthPage
    };
};
