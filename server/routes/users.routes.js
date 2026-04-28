import { Router } from 'express';
import { store } from '../data/store.js';

const router = Router();

router.get('/', (req, res) => {
  const role = req.query.role?.trim();
  const users = store.getUsers({ role });
  return res.json({ users });
});

export default router;

