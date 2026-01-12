import { NextRequest, NextResponse } from 'next/server';

const SESSION_COOKIE_NAME = 'session_token';

export function getSessionTokenFromBrowser(request: NextRequest): string | null {
    const cookie = request.cookies.get(SESSION_COOKIE_NAME);
    if (cookie) return cookie.value;    
    else return null;
}

export function setSessionCookieInBrowser(response: NextResponse, rawToken: string, expiresAt: Date): NextResponse<unknown> {
    response.cookies.set(SESSION_COOKIE_NAME, rawToken, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        expires: expiresAt,
        path: "/"
    });

    return response;
}

export function deleteSessionCookieInBrowser(response: NextResponse): void {
    response.cookies.set(SESSION_COOKIE_NAME, "", {
        httpOnly: true,
        sameSite: "lax",
        maxAge: 0,
        path: "/"
    });
}