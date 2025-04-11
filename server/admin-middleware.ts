import { Request, Response, NextFunction } from "express";

export function isAdmin(req: Request, res: Response, next: NextFunction) {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ error: "Not authenticated" });
  }
  
  if (!req.user?.isAdmin) {
    return res.status(403).json({ error: "Not authorized" });
  }
  
  next();
}