import { i18n } from '$lib/i18n.js';
import { redirect } from '@sveltejs/kit'

export const load = async ({ params }) => {
    redirect(301, i18n.resolveRoute(`/contributor/sources`));
}
