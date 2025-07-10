import jwt, { SignOptions, VerifyOptions } from 'jsonwebtoken';
import { ENV } from '../config/env';

export function generateToken(payload: object): string {
  // Ensure expiresIn is a number or a valid string value for JWT
  const expiresIn: number | undefined = ENV.JWT_EXPIRES_IN
    ? Number(ENV.JWT_EXPIRES_IN)
    : undefined;
  const options: SignOptions = {};
  if (expiresIn) {
    options.expiresIn = expiresIn;
  }
  return jwt.sign(payload, ENV.JWT_SECRET, options);
}

export function verifyToken(token: string): any {
  try {
    const options: VerifyOptions = {};
    return jwt.verify(token, ENV.JWT_SECRET, options);
  } catch (err) {
    return null;
  }
} 