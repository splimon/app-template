
import * as argon2 from "argon2";
import { db } from "../db/kysely/client";
import { Errors } from "../errors";
import { AuthUser, SessionType } from "@/src/types/auth";

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

    console.log('[login] Account found:', account.id.slice(0, 6), '|', account.username);

    // Verify password
    if (!(await argon2.verify(account.password_hash, password))) {
        throw Errors.INVALID_CREDENTIALS;
    }

    console.log('[login] Password verified successfully.');
    
    return {
        ...account,
        type
    } as AuthUser;
}