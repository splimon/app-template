import { NextRequest, NextResponse } from 'next/server';
import { AuthUser, SessionType } from '../../types/auth';
import { deleteTokenInDB, generateToken, hashToken, storeTokenInDB } from './token';
import { CookieStore, getSessionCookieFromBrowser, setSessionCookieInBrowser } from './browser';
import { Errors } from '../errors';
import { db } from '../db/kysely/client';
import { fetchUserRole } from './login';

/**
 * Helper function to set an expiration date (can edit for more tighter windows)
 * @returns Date object of when the session should expire (today + time)
 */
function getExpirationDate(): Date {
    return new Date(Date.now() + 1000 * 60 * 60 * 24); // 24 hours from now
}

/**
 * Creates session (stores hashed token in database and raw token in browser)
 * @param userID user that is requesting to be in session 
 * @param session_type type of session cookie to store (sysadmin or user)
 * @param response current response in the API
 * @returns new response including the new session cookie
 */
export async function createSession(userID: string, sessionType: SessionType, response: NextResponse): Promise<NextResponse<unknown>> {
    console.log('[session] Creating session for user:', userID.slice(0, 6), 'of type:', sessionType);

    console.log('[session] Generating tokens...');
    const expiresAt = getExpirationDate();
    const { rawToken, hashedToken } = await generateToken();

    console.log('[session] Storing session token in DB...');
    await storeTokenInDB(userID, hashedToken, expiresAt);

    console.log('[session] Setting session cookie in browser...');
    const res = setSessionCookieInBrowser(sessionType, response, rawToken, expiresAt);
    
    return res;
}

/**
 * Gets the raw token from browser cookies, then finds the hashed version in the DB )
 * @param request NextRequest object
 * @returns AuthUser (all user data needed for application)
 */
export async function validateSession(request: NextRequest): Promise<AuthUser> {
    const sessionCookie = getSessionCookieFromBrowser(request);
    if (!sessionCookie) {
        throw Errors.NO_SESSION;
    }

    const hashedToken = hashToken(sessionCookie.token);
    if (process.env.NODE_ENV === "development") console.log('[validateSession] Validating session for token:', sessionCookie.token);

    // Fetch account data from session token
    const account = await db.selectFrom('sessions as s')        
        .innerJoin('users as u', 's.user_id', 'u.id')
        .select(['u.id', 'u.email', 'u.username', 'u.system_role', 'u.created_at'])
        .where('token_hash', '=', hashedToken)
        .where('u.system_role', '=', sessionCookie.type)
        .where('expires_at', '>', new Date())
        .executeTakeFirst();
    
    if (!account) {
        throw Errors.NO_SESSION;
    }

    const role = await fetchUserRole(account.id)

    return { ...account, role } as AuthUser
}

export async function validateSessionFromCookies(cookieStore: CookieStore): Promise<AuthUser> {
    const sessionCookie = getSessionCookieFromBrowser(cookieStore);
    if (!sessionCookie) {
        throw Errors.NO_SESSION;
    }

    const hashedToken = hashToken(sessionCookie.token);
    if (process.env.NODE_ENV === "development") console.log('[validateSession] Validating session for token:', sessionCookie.token);

    // Fetch account data from session token
    const account = await db.selectFrom('sessions as s')        
        .innerJoin('users as u', 's.user_id', 'u.id')
        .select(['u.id', 'u.email', 'u.username', 'u.system_role', 'u.created_at'])
        .where('token_hash', '=', hashedToken)
        .where('u.system_role', '=', sessionCookie.type)
        .where('expires_at', '>', new Date())
        .executeTakeFirst();
    
    if (!account) {
        throw Errors.NO_SESSION;
    }

    const role = await fetchUserRole(account.id)

    return { ...account, role } as AuthUser
}

/**
 * Gets the session token from browser, then deletes the hashed version in the DB
 * @param request NextRequest object
 */
export async function invalidateSession(request: NextRequest): Promise<SessionType> {
    console.log('[session] Invalidating session...');

    console.log('[session] Getting token from browser...');
    const sessionCookie = getSessionCookieFromBrowser(request);
    if (!sessionCookie) {
        throw Errors.NO_SESSION;
    }
    
    console.log('[session] Deleting session from DB...');
    const hashedToken = hashToken(sessionCookie.token);
    await deleteTokenInDB(hashedToken);

    return sessionCookie.type;

    // Note: Cookie deletion from browser is handled in the route handler
}
