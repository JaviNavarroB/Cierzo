import { NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken';

export function authenticateToken(req: Request, res: Response, next: NextFunction): void {
  // Log the Authorization header value.
  const authHeader = req.headers['authorization'];
  console.log("Authorization header:", authHeader);

  // Extract token.
  const token = authHeader && authHeader.split(' ')[1];
  console.log("Extracted token:", token);

  if (!token) {
    console.error('Auth middleware: Missing token');
    res.status(401).json({ error: 'Token no proporcionado' });
    return;
  }

  // Use secret key.
  const secretKey = process.env.JWT_SECRET || 'miClaveSecreta';
  console.log("Using secretKey:", secretKey);

  jwt.verify(token, secretKey, (err, decoded) => {
    if (err || !decoded) {
      console.error('Auth middleware: Token invalid', err);
      res.status(403).json({ error: 'Token inválido o expirado' });
      return;
    }
    req.user = { id: (decoded as any).id, ...(decoded as object) };
    console.log('Auth middleware: Authenticated user', req.user);
    next();
  });
}
