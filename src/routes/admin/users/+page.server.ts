import { adminService } from "$lib/server/injection";
import { error } from "@sveltejs/kit";

export const load = async ({ locals }) => {
    const users = await adminService.showAllUsers();
    const invitations = await adminService.showAllInvitations();
    return {
        users,
        contributorInvitations: invitations.filter(invitation => !invitation.roles.includes('admin')),
        adminInvitations: invitations.filter(invitation => invitation.roles.includes('admin'))
    };
};

export const actions = {
    deleteUser: async ({ request }) => {
        const formData = await request.formData();
        const id = formData.get('id');
        await adminService.deleteUser(id as string);
        return { success: true };
    },

    createInvitation: async ({ request }) => {
        const formData = await request.formData();
        const role = formData.get('role')?.toString();
        if (!role) {
            error(400, 'Role is required');
        }
        await adminService.createInvitation(role === 'admin' ? ['admin', 'contributor'] : ['contributor']);
        return { success: true };
    },

    deleteInvitation: async ({ request }) => {
        const formData = await request.formData();
        const id = formData.get('id');
        await adminService.deleteInvitation(id as string);
        return { success: true };
    }
};