import { Request } from "express";

export interface JwtPayload {
  userId: string;
  email: string;
  role: string;
  iat?: number; // Issued at
  exp?: number; // Expiration time
  iss?: string; // Issuer
  aud?: string; // Audience
}

export interface AuthRequest extends Request {
  user?: JwtPayload;
  userId?: string;
}

export interface TeamCreationData {
  userId: string;
  userEmail: string;
}

export interface TokenPayload {
  userId: string;
  email: string;
  role: string;
}
