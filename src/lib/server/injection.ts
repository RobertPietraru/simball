import { AuthService } from "./services/auth_service";
import { AdminService } from "./services/admin_service";
import { db } from "./db";

export const authService = new AuthService(db);

export const adminService = new AdminService(db);