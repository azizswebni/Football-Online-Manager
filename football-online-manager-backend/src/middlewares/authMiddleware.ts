import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt";
import { ENV } from "../config/env";
import { JwtPayload } from "../interfaces/auth.interface";

export function authenticateJWT(
  req: Request,
  res: Response,
  next: NextFunction
) {
  // Try to get token from cookie first
  let token = req.cookies[ENV.COOKIE_NAME];

  // Fallback to Authorization header for backward compatibility
  if (!token) {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    }
  }

  if (!token) {
    return res.status(401).json({
      message: "No token provided",
      status: 401,
      timestamp: new Date().toISOString(),
    });
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    return res.status(401).json({
      message: "Invalid or expired token",
      status: 401,
      timestamp: new Date().toISOString(),
    });
  }

  // Attach the decoded user information to the request
  (req as any).user = decoded;

  // Log successful authentication
  console.log(`User authenticated: ${decoded.email} (ID: ${decoded.userId})`);

  next();
}

// Optional middleware to extract user ID from JWT
export function extractUserId(req: Request, res: Response, next: NextFunction) {
  const user = (req as any).user as JwtPayload;

  if (!user || !user.userId) {
    return res.status(401).json({
      message: "User ID not found in token",
      status: 401,
      timestamp: new Date().toISOString(),
    });
  }

  // Add userId to request for easy access
  (req as any).userId = user.userId;
  next();
}
