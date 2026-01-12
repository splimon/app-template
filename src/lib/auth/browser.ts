// Edge-runtime compatible session cookie management

import { NextRequest, NextResponse } from 'next/server';
import { SessionType } from '../../types/auth';
const ADMINSESSION_COOKIE_NAME = 'admin_session';
const USERSESSION_COOKIE_NAME = 'user_session';

export type SessionCookie = {
    value: string;
    session_type: SessionType;
}

// -- Browser Cookie Management Functions --
/**
 * Checks for session cookies in the browser request and returns the session token if found and what type of session token.
 * If both cookies are present, admin session takes precedence.
 * @param request NextRequest object from Next.js middleware
 * @returns SessionCookie object containing the session value and type (admin or user)
 */
export function getSessionCookieFromBrowser(request: NextRequest): SessionCookie | null {
    const adminCookie = request.cookies.get(ADMINSESSION_COOKIE_NAME);
    if (adminCookie) {
        return {
            value: adminCookie.value,
            session_type: 'admin'
        };
    }
    
    const userCookie = request.cookies.get(USERSESSION_COOKIE_NAME);
    if (userCookie) {
        return {
            value: userCookie.value,
            session_type: 'user'
        };
    }

    // No session found
    return null;
}

export function setSessionCookieInBrowser(response: NextResponse, rawToken: string, expiresAt: Date, session_type: SessionType): NextResponse<unknown> {
    const cookieName = session_type === 'admin' ? ADMINSESSION_COOKIE_NAME : USERSESSION_COOKIE_NAME;
    
    response.cookies.set(cookieName, rawToken, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        expires: expiresAt,
        path: "/"
    });

    return response;
}

export function deleteSessionCookieInBrowser(response: NextResponse, session_type: SessionType): void {
    const cookieName = session_type === 'admin' ? ADMINSESSION_COOKIE_NAME : USERSESSION_COOKIE_NAME;
    
    response.cookies.set(cookieName, "", {
        httpOnly: true,
        sameSite: "lax",
        maxAge: 0,
        path: "/"
    });
}