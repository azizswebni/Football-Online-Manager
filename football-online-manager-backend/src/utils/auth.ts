import { Request } from 'express';
import { JwtPayload } from '../interfaces/auth.interface';

export function getUserIdFromRequest(req: Request): string | null {
  const user = (req as any).user as JwtPayload;
  return user?.userId || null;
}

export function getUserFromRequest(req: Request): JwtPayload | null {
  return (req as any).user as JwtPayload || null;
}

export function requireUserId(req: Request): string {
  const userId = getUserIdFromRequest(req);
  if (!userId) {
    throw new Error('User ID not found in request');
  }
  return userId;
} 