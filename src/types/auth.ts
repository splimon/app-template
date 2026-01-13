import { SystemRole, User, UserRole } from "./db";

/**
 * Interface data shape for an authenticated user (system admin, org admin, org member, org guest, or public user)
 * - id
 * - email
 * - username
 * - created_at
 * - system_role ('sysadmin' | 'user')
 * - role ('org_admin' | 'member' | 'guest' | null)
 */
export interface AuthUser extends Omit<User, 'password_hash'> {
    role: UserRole | null
}

export type SessionType = SystemRole