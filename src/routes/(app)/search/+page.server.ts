import { injection } from '$lib/server/injection';
import { tryParseInt } from '$lib/utils.js';
export async function load({ locals, url }) {
    const { adminService } = injection();
    const searchParams = url.searchParams;
    const search = searchParams.get('search') ?? '';
    const searchInDefinition = (searchParams.get('searchInDefinition') || 'false') === 'true';
    const searchInWord = (searchParams.get('searchInWord') || 'true') === 'true';
    const page = tryParseInt(searchParams.get('page') || '1') ?? 1;
    const limit = tryParseInt(searchParams.get('limit') || '10') ?? 10;

    const { words, total } = await adminService.searchWords({
        search,
        searchInDefinition,
        searchInWord,
        page,
        limit,
    });
    return {
        words,
        search,
        total,
        page,
        limit,
    };
}
