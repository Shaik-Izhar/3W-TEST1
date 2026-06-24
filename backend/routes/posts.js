import express from 'express';
import Post from '../models/Post.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/', protect, async (req, res) => {
  const { text, image } = req.body;
  if (!text && !image) return res.status(400).json({ message: 'Post text or image is required' });

  const post = await Post.create({
    user: req.user._id,
    username: req.user.name,
    userAvatar: req.user.avatar,
    text,
    image,
  });

  res.status(201).json(post);
});

router.get('/', protect, async (req, res) => {
  const posts = await Post.find().sort({ createdAt: -1 });
  res.json(posts);
});

router.post('/:id/like', protect, async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) return res.status(404).json({ message: 'Post not found' });

  const liked = post.likes.includes(req.user._id);
  if (liked) {
    post.likes.pull(req.user._id);
    post.likeUsers = post.likeUsers.filter((name) => name !== req.user.name);
  } else {
    post.likes.push(req.user._id);
    post.likeUsers.push(req.user.name);
  }
  await post.save();
  res.json(post);
});

router.post('/:id/comment', protect, async (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).json({ message: 'Comment text is required' });

  const post = await Post.findById(req.params.id);
  if (!post) return res.status(404).json({ message: 'Post not found' });

  post.comments.push({ user: req.user._id, username: req.user.name, text });
  await post.save();
  res.json(post);
});

router.post('/:id/share', protect, async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) return res.status(404).json({ message: 'Post not found' });

  const shared = post.shareUsers.includes(req.user.name);
  if (shared) {
    post.shares.pull(req.user._id);
    post.shareUsers = post.shareUsers.filter((name) => name !== req.user.name);
  } else {
    post.shares.push(req.user._id);
    post.shareUsers.push(req.user.name);
  }
  await post.save();
  res.json(post);
});

router.delete('/:id', protect, async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) return res.status(404).json({ message: 'Post not found' });
  if (post.user.toString() !== req.user._id.toString()) return res.status(403).json({ message: 'Not authorized' });

  await post.remove();
  res.json({ message: 'Post deleted' });
});

export default router;
