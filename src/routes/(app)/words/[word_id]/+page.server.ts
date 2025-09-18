import { injection } from "$lib/server/injection";
import { error } from "@sveltejs/kit";

export async function load({ params, url }) {
    const { word_id } = params;
    const { adminService } = injection();
    const word = await adminService.getWordById(word_id);
    const searchInDefinition = url.searchParams.get('searchInDefinition') === 'true';
    let search = url.searchParams.get('search');
    if (!word) {
        error(404, 'Word not found');
    }
    return {
        word,
        search: search || null,
        searchInDefinition
    };
}