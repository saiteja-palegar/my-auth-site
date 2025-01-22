import jwt from 'jsonwebtoken';

export async function generateJWT(payload) {
    return jwt.sign(payload, process.env.NEXTAUTH_SECRET, {
        expiresIn: '7d',
    });
}

export async function verifyJWT(token) {
    return jwt.verify(token, process.env.NEXTAUTH_SECRET);
}