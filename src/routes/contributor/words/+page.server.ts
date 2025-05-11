import { adminService } from '$lib/server/injection.js';
import { tryParseInt } from '$lib/utils.js';
export async function load({ locals, url }) {
	const searchParams = url.searchParams;
	const search = searchParams.get('search') ?? '';
	const page = tryParseInt(searchParams.get('page') || '1') ?? 1;
	const limit = tryParseInt(searchParams.get('limit') || '10') ?? 10;

	const { words, total } = await adminService.getWords({
		search,
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
