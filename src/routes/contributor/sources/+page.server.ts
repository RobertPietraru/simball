import { injection } from '$lib/server/injection';

export async function load({ locals }) {
	const { adminService } = injection();
	const sources = await adminService.getSources();
	return { sources };
}
