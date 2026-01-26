import { db } from "../../db/kysely/client";
import { Errors } from "../errors";
import { AuthUser } from "@/types/auth";
import { verifyPassword } from "./password";
import { UserRole } from "@/types/db";

export async function login(identifier: string, password: string): Promise<AuthUser> {
    if (process.env.NODE_ENV === "development") console.log('[login] Attempting login for:', identifier, '|', password);

    // Fetch user by email or username
    const accountResult = await db.selectFrom('users')
    .select(['id', 'email', 'username', 'password_hash', 'system_role', 'created_at'])
    .where((eb) => eb.or([
        eb('email', '=', identifier),
        eb('username', '=', identifier)
    ]))
    .executeTakeFirst();

    if (!accountResult) {
        throw Errors.INVALID_CREDENTIALS;
    }

    const { password_hash, ...account } = accountResult

    console.log('[login] Account found:', account.id.slice(0, 6), '... |', account.username);
    console.log('[login] Verifying password...');

    // Verify password
    if (!(await verifyPassword(accountResult.password_hash, password))) {
        throw Errors.INVALID_CREDENTIALS;
    }

    // Early return for a system admin
    if (account.system_role === 'sysadmin') {
        console.log('[login] User is a system administrator...')
        return { ...account } as AuthUser;
    }

    console.log(`[login] Fetching user's organization role...`)

    const role = await fetchUserRole(account.id)

    return { ...account, role } as AuthUser;
}

export async function fetchUserRole(userId: string): Promise<UserRole | null> {

    // Fetch user's role in an org (if any)
    const roleResult = await db.selectFrom('members')
    .select('user_role')
    .where('user_id', '=', userId)
    .executeTakeFirst()

    // User is public or something went wrong
    if (!roleResult) {
        console.log(`[fetchUserRole] No role found in any organization for ${userId.slice(0,6)}...`)
        console.log('[fetchUserRole] Assuming user is public (no associated org)')
        return null
    }

    return roleResult.user_role
}