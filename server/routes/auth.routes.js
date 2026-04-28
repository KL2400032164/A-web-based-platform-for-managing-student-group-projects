import { Router } from 'express';
import { store } from '../data/store.js';

const router = Router();

router.post('/login', (req, res) => {
  const { email, password, role } = req.body;

  if (!email?.trim() || !password?.trim() || !role?.trim()) {
    return res.status(400).json({ message: 'Email, password, and role are required.' });
  }

  const result = store.login({ email, password, role });
  if (result.error) {
    return res.status(401).json({ message: result.error });
  }

  return res.json({ user: result.user });
});

router.post('/signup', (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name?.trim() || !email?.trim() || !password?.trim() || !role?.trim()) {
    return res.status(400).json({ message: 'Name, email, password, and role are required.' });
  }

  const result = store.signup({ name, email, password, role });
  if (result.error) {
    return res.status(409).json({ message: result.error });
  }

  return res.status(201).json({ user: result.user });
});

export default router;

