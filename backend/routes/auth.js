import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import User from '../models/User.js';

dotenv.config();
const router = express.Router();

const createToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });

router.post('/signup', async (req, res) => {
  const { name, email, password, avatar } = req.body;
  if (!name || !email || !password) return res.status(400).json({ message: 'Name, email and password are required' });

  const existing = await User.findOne({ email });
  if (existing) return res.status(400).json({ message: 'Email already registered' });

  const hashed = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, password: hashed, avatar });
  res.status(201).json({
    token: createToken(user._id),
    user: { id: user._id, name: user.name, email: user.email, avatar: user.avatar, followers: user.followers.length, following: user.following.length },
  });
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: 'Email and password are required' });

  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: 'Invalid credentials' });

  const matched = await bcrypt.compare(password, user.password);
  if (!matched) return res.status(400).json({ message: 'Invalid credentials' });

  res.json({
    token: createToken(user._id),
    user: { id: user._id, name: user.name, email: user.email, avatar: user.avatar, followers: user.followers.length, following: user.following.length },
  });
});

export default router;
