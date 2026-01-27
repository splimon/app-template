import * as argon2 from 'argon2';

/**
 * Hashes a plaintext password using Argon2id.
 * @param password The plaintext password to hash.
 * @returns A promise that resolves to the hashed password string.
 */
export async function hashPassword(password: string): Promise<string> {
    return argon2.hash(password, 
        { 
            type: argon2.argon2id,
            secret: Buffer.from(process.env.PASSWORD_HASH_SECRET || '', 'utf-8'),
        });    
}

/**
 * Verifies a plaintext password against a stored Argon2id hash.
 * @param storedHash The hashed password to compare against.
 * @param password The plaintext password provided by the user.
 * @returns A promise that resolves to true if the password matches the hash, otherwise false.
 */
export async function verifyPassword(storedHash: string, password: string): Promise<boolean> {
    return argon2.verify(storedHash, password, 
        { 
            secret: Buffer.from(process.env.PASSWORD_HASH_SECRET || '', 'utf-8'),
        });
}