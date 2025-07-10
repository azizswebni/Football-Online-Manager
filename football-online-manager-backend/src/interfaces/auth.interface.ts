export interface JwtPayload {
  userId: string;
  email: string;
  role: string;
}

export interface AuthRequest extends Request {
  user?: JwtPayload;
}

export interface TeamCreationData {
  userId: string;
  userEmail: string;
} 