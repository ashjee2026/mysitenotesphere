import { Request, Response, NextFunction } from 'express';

export function isAdmin(req: Request, res: Response, next: NextFunction) {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: 'Authentication required' });
  }
  
  if (!(req.user as any).isAdmin) {
    return res.status(403).json({ message: 'Admin privileges required' });
  }
  
  next();
}