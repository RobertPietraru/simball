import { injection } from "$lib/server/injection";
import { error } from "@sveltejs/kit";

export async function load({ params }) {
    const { word_id } = params;
    const { adminService } = injection();
    const word = await adminService.getWordById(word_id);
    if (!word) {
        error(404, 'Word not found');
    }
    return {
        word,
    };
}