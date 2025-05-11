import { adminService } from '$lib/server/injection.js';

export async function load({ locals }) {
	const sources = await adminService.getSources();
	return { sources };
}
