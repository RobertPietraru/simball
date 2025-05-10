import { adminService } from "$lib/server/injection";
import { error } from "@sveltejs/kit";

export const load = async (event) => {
    const source = await adminService.getSourceById(event.params.id);

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
        await adminService.updateSource(event.params.id, label as string, description as string, links as string[]);
    },

    delete: async (event) => {
        const formData = await event.request.formData();
        const id = formData.get('id');
        if (!id) {
            error(400, 'Bad request');
        }
        await adminService.deleteSource(id as string);
    },
}