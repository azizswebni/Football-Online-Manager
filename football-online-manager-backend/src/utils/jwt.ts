import jwt, { SignOptions, VerifyOptions } from 'jsonwebtoken';
import { ENV } from '../config/env';
import { JwtPayload } from '../interfaces/auth.interface';

export function generateToken(payload: JwtPayload): string {
  const options: SignOptions = {
    expiresIn: ENV.JWT_EXPIRES_IN,
    issuer: 'football-online-manager',
    audience: 'football-online-manager-users'
  };
  
  return jwt.sign(payload, ENV.JWT_SECRET, options);
}

export function verifyToken(token: string): JwtPayload | null {
  try {
    const options: VerifyOptions = {
      issuer: 'football-online-manager',
      audience: 'football-online-manager-users'
    };
    
    const decoded = jwt.verify(token, ENV.JWT_SECRET, options) as JwtPayload;
    
    // Validate that required fields are present
    if (!decoded.userId || !decoded.email || !decoded.role) {
      return null;
    }
    
    return decoded;
  } catch (err) {
    return null;
  }
}

export function decodeToken(token: string): JwtPayload | null {
  try {
    return jwt.decode(token) as JwtPayload;
  } catch (err) {
    return null;
  }
}