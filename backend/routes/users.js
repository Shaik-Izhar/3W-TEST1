import express from 'express';
import User from '../models/User.js';
import Post from '../models/Post.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/me', protect, async (req, res) => {
  res.json({
    id: req.user._id,
    name: req.user.name,
    email: req.user.email,
    avatar: req.user.avatar,
    followers: req.user.followers.length,
    following: req.user.following.length,
  });
});

router.get('/', protect, async (req, res) => {
  const users = await User.find({_id: { $ne: req.user._id }}).select('name avatar followers following');
  res.json(users.map((user) => ({
    id: user._id,
    name: user.name,
    avatar: user.avatar,
    followers: user.followers.length,
    following: user.following.length,
    isFollowing: req.user.following.includes(user._id),
  })));
});

router.post('/:id/follow', protect, async (req, res) => {
  const target = await User.findById(req.params.id);
  if (!target) return res.status(404).json({ message: 'User not found' });
  if (target._id.toString() === req.user._id.toString()) return res.status(400).json({ message: 'Cannot follow yourself' });

  const currentUser = await User.findById(req.user._id);
  const alreadyFollowing = currentUser.following.includes(target._id);
  if (alreadyFollowing) {
    currentUser.following.pull(target._id);
    target.followers.pull(currentUser._id);
  } else {
    currentUser.following.push(target._id);
    target.followers.push(currentUser._id);
  }

  await currentUser.save();
  await target.save();

  res.json({
    following: currentUser.following.length,
    followers: target.followers.length,
    isFollowing: !alreadyFollowing,
  });
});

router.get('/:id/feed', protect, async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: 'User not found' });

  const posts = await Post.find({ user: { $in: [...user.following, user._id] } }).sort({ createdAt: -1 });
  res.json(posts);
});

export default router;
