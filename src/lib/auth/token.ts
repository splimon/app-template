import { db } from '../db/kysely/client';
import { createHash, randomBytes } from 'crypto';

// == Token Management Functions ==
export async function generateToken(): Promise<{ rawToken: string; hashedToken: string }> {

  const rawToken = randomBytes(32).toString('hex');
  const hashedToken = hashToken(rawToken);

  return { rawToken, hashedToken };
}

export function hashToken(rawToken: string): string {
    const hashedToken = createHash('sha256').update(rawToken).digest('hex');
    return hashedToken;
}

// == DB Cookie Management Functions == 
export async function storeTokenInDB(userId: string, hashedToken: string, expiresAt: Date): Promise<void> {
    const result = await db
        .insertInto('sessions')
        .values({ 
            token_hash: hashedToken,
            expires_at: expiresAt,
            user_id: userId,
        })    
        .executeTakeFirst();

    if (!result) {
        throw new Error('SESSION_INSERTION_FAILED');
    }
}

export async function deleteTokenInDB(hashedToken: string): Promise<void> {
    await db
        .deleteFrom('sessions')
        .where('token_hash', '=', hashedToken)
    .execute();
}