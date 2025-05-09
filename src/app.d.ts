// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
        interface Locals {
          user: import("$lib/server/services/auth_service").SessionValidationResult["user"];
          session: import("$lib/server/services/auth_service").SessionValidationResult["session"];
        }
    }
}

export {};
