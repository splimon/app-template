import { NextResponse } from 'next/server';
import { SessionType } from '../../types/auth';
import { generateToken, storeTokenInDB } from './token';
import { setSessionCookieInBrowser } from './browser';

function getExpirationDate(): Date {
    return new Date(Date.now() + 1000 * 60 * 60 * 24); // 24 hours from now
}

export async function createSession(userID: string, session_type: SessionType, response: NextResponse): Promise<NextResponse<unknown>> {
    console.log('[session] Creating session for user:', userID.slice(0, 6), 'of type:', session_type);

    console.log('[session] Generating tokens...');
    const expiresAt = getExpirationDate();
    const { rawToken, hashedToken } = await generateToken();

    console.log('[session] Storing session in DB...');
    await storeTokenInDB(userID, hashedToken, expiresAt);

    console.log('[session] Setting session cookie in browser...');
    const res = setSessionCookieInBrowser(response, rawToken, expiresAt, session_type);
    
    return res;
}