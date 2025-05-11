import { adminService } from "$lib/server/injection";
import { error, redirect } from "@sveltejs/kit";

export const load = async (event) => {
    const source = await adminService.getSourceById(event.params.source_id);

    if (!source) {
        error(404, 'Source not found');
    }

    return {
        source,
    };
}

export const actions = {
    save: async (event) => {
        const formData = await event.request.formData();
        const label = formData.get('label');
        const description = formData.get('description');
        const links = JSON.parse(formData.get('links') as string);
        if (!label || !links) {
            error(400, 'Bad request');
        }
        await adminService.updateSource(event.params.source_id, label as string, description as string, links as string[]);
    },

    delete: async (event) => {
        await adminService.deleteSource(event.params.source_id);
        redirect(302, '/contributor/sources');
    },
}