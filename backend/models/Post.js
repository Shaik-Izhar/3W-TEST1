import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  username: { type: String, required: true },
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const postSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  username: { type: String, required: true },
  userAvatar: { type: String },
  text: { type: String },
  image: { type: String },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  likeUsers: [{ type: String }],
  shares: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  shareUsers: [{ type: String }],
  comments: [commentSchema],
}, { timestamps: true });

const Post = mongoose.model('Post', postSchema);
export default Post;
