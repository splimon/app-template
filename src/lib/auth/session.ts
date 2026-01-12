import { NextRequest, NextResponse } from 'next/server';
import { SessionType } from '../../types/auth';
import { deleteTokenInDB, generateToken, hashToken, storeTokenInDB } from './token';
import { getSessionTokenFromBrowser, setSessionCookieInBrowser } from './browser';
import { Errors } from '../errors';

function getExpirationDate(): Date {
    return new Date(Date.now() + 1000 * 60 * 60 * 24); // 24 hours from now
}

export async function createSession(userID: string, session_type: SessionType, response: NextResponse): Promise<NextResponse<unknown>> {
    console.log('[session] Creating session for user:', userID.slice(0, 6), 'of type:', session_type);

    console.log('[session] Generating tokens...');
    const expiresAt = getExpirationDate();
    const { rawToken, hashedToken } = await generateToken();

    console.log('[session] Storing session token in DB...');
    await storeTokenInDB(userID, hashedToken, expiresAt);

    console.log('[session] Setting session cookie in browser...');
    const res = setSessionCookieInBrowser(response, rawToken, expiresAt);
    
    return res;
}

/**
 * @param request NextRequest object
 * @returns the SessionCookie that was invalidated to determine which cookie to delete in the browser
 */
export async function invalidateSession(request: NextRequest): Promise<string> {
    console.log('[session] Invalidating session...');

    console.log('[session] Getting token from browser...');
    const token = getSessionTokenFromBrowser(request);
    if (!token) {
        throw Errors.NO_SESSION;
    }
    
    console.log('[session] Deleting session from DB...');
    const hashedToken = hashToken(token);
    await deleteTokenInDB(hashedToken);

    return token;

    // Note: Cookie deletion from browser is handled in the route handler
}