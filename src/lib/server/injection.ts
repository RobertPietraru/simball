import { AuthService } from "./services/auth_service";
import { AdminService } from "./services/admin_service";
import { db } from "./db";
export function injection() {
    const authService = new AuthService(db);
    const adminService = new AdminService(db);

    return { authService, adminService, }

}
