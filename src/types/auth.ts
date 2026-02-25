import { Tenant, SystemRole, User, UserRole } from "./db";

/**
 * Interface data shape for an authenticated user (system admin, tenant admin, worker, or public user)
 * - id
 * - email
 * - username
 * - created_at
 * - system_role ('sysadmin' | 'user')
 * - role ('admin' | 'worker' | null)
 */
export interface AuthUser extends Omit<User, 'password_hash'> {
    role: UserRole | null
    tenant?: Tenant
}

export type SessionType = SystemRole

export interface SessionCookie {
    type: SessionType;
    token: string;
}
