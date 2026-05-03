import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { prisma } from './db.js';

export const hash = (p) => bcrypt.hashSync(p, 10);
export const compare = (p, h) => bcrypt.compareSync(p, h);

export function sign(user) {
  return jwt.sign({ uid: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
}

export function requireAuth(req, res, next) {
  const h = req.headers.authorization || '';
  const token = h.startsWith('Bearer ') ? h.slice(7) : null;
  if (!token) return res.status(401).json({ error: 'unauthorized' });
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: 'unauthorized' });
  }
}
