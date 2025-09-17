import { i18n } from "$lib/i18n.js";
import log from "$lib/logging.js";
import { injection } from '$lib/server/injection';
import { error, redirect } from "@sveltejs/kit";

export const load = async (event) => {
}

export const actions = {
    create: async (event) => {
        log.info('Saving source');
        const { adminService } = injection();
        const formData = await event.request.formData();
        const label = formData.get('label');
        const description = formData.get('description');
        const links = JSON.parse(formData.get('links') as string);
        if (!label || !links) {
            log.error('Bad request');
            error(400, 'Bad request');
        }
        await adminService.createSource(label as string, description as string, links as string[]);
        log.info('Source saved');
        redirect(302, i18n.resolveRoute('/contributor/sources'));
    },
}