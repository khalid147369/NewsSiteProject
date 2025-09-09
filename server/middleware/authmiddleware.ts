import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers['authorization']?.split(' ')[1]; // Bearer <token>

  if (!token) return res.status(401).json({ message: 'Token no proporcionado' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);

    req.user = decoded;
    next();
  } catch (error) {
    
    return res.status(401).json({ message: 'Token inválido' });
    
    }
};

// Middleware para verificar si el usuario es admin
export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (req.user && req.user.role && req.user.role=== 'admin') {
    return next();
  }
  return res.status(403).json({ message: 'Acceso denegado: solo administradores' });
};
