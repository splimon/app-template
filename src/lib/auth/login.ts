
import { db } from "../db/kysely/client";
import { Errors } from "../errors";
import { AuthUser, SessionType } from "@/src/types/auth";
import { hash } from "crypto";
import { hashPassword, verifyPassword } from "./password";

export async function login(type: SessionType, identifier: string, password: string): Promise<AuthUser> {
    if (process.env.NODE_ENV === "development") console.log('[login] Attempting login for:', identifier, '|', password);

    // Fetch user by email or username
    const account = await db.selectFrom('users')
    .select(['id', 'email', 'username', 'password_hash', 'system_role', 'created_at'])
    .where((eb) => eb.or([
        eb('email', '=', identifier),
        eb('username', '=', identifier)
    ]))
    .executeTakeFirst();

    if (!account) {
        throw Errors.INVALID_CREDENTIALS;
    }

    console.log('[login] Account found:', account.id.slice(0, 6), '... |', account.username);
    console.log('[login] Verifying password...');

    // Verify password
    if (!(await verifyPassword(account.password_hash, password))) {
        throw Errors.INVALID_CREDENTIALS;
    }
    
    return {
        ...account,
        type
    } as AuthUser;
}