import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers['authorization']?.split(' ')[1]; // Bearer <token>

  if (!token){
    res.status(401).json({ message: 'Token no proporcionado' }); 
   return ;
  } 

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);

    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token inválido' });
    return ;
    
    }
};

// Middleware para verificar si el usuario es admin
export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (req.user && req.user.role && req.user.role=== 'admin') {
    return next();
  }
   res.status(403).json({ message: 'Acceso denegado: solo administradores' });
   return;
};
