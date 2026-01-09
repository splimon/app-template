import * as argon2 from 'argon2';

export async function hashPassword(password: string): Promise<string> {
    return argon2.hash(password, 
        { 
            type: argon2.argon2id,
            secret: Buffer.from(process.env.PASSWORD_HASH_SECRET || '', 'utf-8'),
        });    
}