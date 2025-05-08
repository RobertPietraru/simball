import log from '$lib/logging.js';
export const load = async ({ locals }) => {
    const user = locals.user;
    return {
        user,
    };
};
