import { useEffect, useState, useContext, useRef } from 'react';
import { AuthContext } from '../context/AuthContext';
import { fetchPosts, createPost, likePost, sharePost, commentPost, fetchUsers, followUser, fetchMe } from '../services/api';
import { sortPosts, getFeedStats } from '../utils/feedUtils';

export default function Home() {
  const { user, setUser } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);
  const [tab, setTab] = useState('all');
  const [text, setText] = useState('');
  const [image, setImage] = useState('');
  const [imageName, setImageName] = useState('');
  const [commentText, setCommentText] = useState('');
  const [activeCommentId, setActiveCommentId] = useState(null);
  const [message, setMessage] = useState('');
  const [profileOpen, setProfileOpen] = useState(false);
  const [likedPosts, setLikedPosts] = useState({});
  const [sharedPosts, setSharedPosts] = useState({});
  const fileInputRef = useRef(null);

  const refresh = async () => {
    try {
      const [feed, userList] = await Promise.all([fetchPosts(), fetchUsers()]);
      setPosts(feed.data || []);
      setUsers(userList.data || []);
    } catch (error) {
      setMessage('Unable to load social feed right now.');
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  const handleImagePick = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      setMessage('Images up to 2MB are supported.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result);
      setImageName(file.name);
    };
    reader.readAsDataURL(file);
  };

  const submitPost = async (e) => {
    e.preventDefault();
    if (!text.trim() && !image.trim()) {
      setMessage('Please add some text or an image before posting.');
      return;
    }

    try {
      await createPost({ text, image });
      setText('');
      setImage('');
      setImageName('');
      if (fileInputRef.current) fileInputRef.current.value = '';
      setMessage('Your post is live.');
      refresh();
    } catch (error) {
      setMessage(error.response?.data?.message || 'Post failed.');
    }
  };

  const handleLike = async (id) => {
    try {
      await likePost(id);
      setLikedPosts((prev) => ({ ...prev, [id]: !prev[id] }));
      refresh();
    } catch (error) {
      setMessage('Could not update the like.');
    }
  };

  const handleComment = async (postId) => {
    if (!commentText.trim()) return;

    try {
      await commentPost(postId, commentText);
      setCommentText('');
      setActiveCommentId(null);
      refresh();
    } catch (error) {
      setMessage('Comment could not be posted.');
    }
  };

  const handleShare = async (id) => {
    try {
      await sharePost(id);
      setSharedPosts((prev) => ({ ...prev, [id]: !prev[id] }));
      refresh();
    } catch (error) {
      setMessage('Share action failed.');
    }
  };

  const handleFollow = async (id) => {
    try {
      await followUser(id);
      const updatedUser = await fetchMe();
      setUser(updatedUser.data);
      refresh();
    } catch (error) {
      setMessage('Follow action failed.');
    }
  };

  const filtered = sortPosts(posts, tab);
  const stats = getFeedStats(posts);

  return (
    <div className="screen home-screen">
      <header className="topbar">
        <div>
          <p className="eyebrow">3W Social</p>
          <h1>Discover ideas, people, and stories.</h1>
          <p className="subtle">A clean space to share updates, connect with creators, and follow momentum.</p>
        </div>
        <div className="topbar-actions">
          <button className="ghost-btn" onClick={() => setProfileOpen((open) => !open)}>Profile</button>
          <button className="logout" onClick={() => { localStorage.removeItem('token'); setUser(null); }}>Logout</button>
        </div>
      </header>

      {message && <div className="message-banner">{message}</div>}

      {profileOpen && (
        <section className="panel profile-card">
          <div className="profile-pill">
            <div className="avatar">{user?.name?.charAt(0) || 'U'}</div>
            <div>
              <strong>{user?.name || 'Guest'}</strong>
              <span>{user?.followers || 0} followers · {user?.following || 0} following</span>
            </div>
          </div>
          <div className="profile-stats">
            <div><strong>{posts.length}</strong><span>Posts</span></div>
            <div><strong>{users.length}</strong><span>People</span></div>
            <div><strong>{stats.topShares}</strong><span>Shares</span></div>
          </div>
        </section>
      )}

      <section className="panel hero-card">
        <div className="hero-copy">
          <div className="profile-pill">
            <div className="avatar">{user?.name?.charAt(0) || 'U'}</div>
            <div>
              <strong>{user?.name || 'Guest'}</strong>
              <span>{user?.followers || 0} followers · {user?.following || 0} following</span>
            </div>
          </div>
          <form className="post-form" onSubmit={submitPost}>
            <textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="Share what’s on your mind today..." />
            <div className="composer-tools">
              <input ref={fileInputRef} type="file" accept="image/*" hidden onChange={handleImagePick} />
              <button type="button" className="icon-btn" onClick={() => fileInputRef.current?.click()} aria-label="Add image">+</button>
              <input value={imageName} onChange={(e) => setImage(e.target.value)} placeholder="Paste image URL (optional)" />
              <button type="submit" className="primary-btn">Post</button>
            </div>
            {image && (
              <div className="image-preview">
                <img src={image} alt="selected preview" />
                {imageName && <span>{imageName}</span>}
              </div>
            )}
          </form>
        </div>
      </section>

      <section className="panel filter-tabs">
        <button className={tab === 'all' ? 'active' : ''} onClick={() => setTab('all')}>All Posts</button>
        <button className={tab === 'liked' ? 'active' : ''} onClick={() => setTab('liked')}>Most Liked</button>
        <button className={tab === 'commented' ? 'active' : ''} onClick={() => setTab('commented')}>Most Commented</button>
        <button className={tab === 'shared' ? 'active' : ''} onClick={() => setTab('shared')}>Most Shared</button>
      </section>

      <section className="feed-grid">
        <div className="feed-column">
          {filtered.map((post) => (
            <article key={post._id} className="post-card">
              <div className="post-header">
                <div className="post-author">
                  <div className="avatar">{post.username?.charAt(0) || 'U'}</div>
                  <div>
                    <strong>{post.username}</strong>
                    <span>{new Date(post.createdAt).toLocaleString()}</span>
                  </div>
                </div>
                <button className="follow-chip" onClick={() => handleFollow(post.user)}>{users.find((userItem) => userItem.id === post.user)?.isFollowing ? 'Following' : 'Follow'}</button>
              </div>
              <div className="post-body">
                {post.text && <p>{post.text}</p>}
                {post.image && <img src={post.image} alt="post" />}
              </div>
              <div className="post-actions">
                <button className={likedPosts[post._id] ? 'action-btn active-like' : 'action-btn'} onClick={() => handleLike(post._id)} title="Like">❤ {post.likes?.length || 0}</button>
                <button className="action-btn" onClick={() => setActiveCommentId(activeCommentId === post._id ? null : post._id)} title="Comment">💬 {post.comments?.length || 0}</button>
                <button className={sharedPosts[post._id] ? 'action-btn active-share' : 'action-btn'} onClick={() => handleShare(post._id)} title="Share">↗ {post.shares?.length || 0}</button>
              </div>
              {activeCommentId === post._id && (
                <div className="comment-box">
                  <input value={commentText} onChange={(e) => setCommentText(e.target.value)} placeholder="Write a comment..." />
                  <button onClick={() => handleComment(post._id)}>Send</button>
                </div>
              )}
              {post.comments?.length > 0 && (
                <div className="comment-list">
                  {post.comments.slice(-2).map((comment) => (
                    <div key={comment._id} className="comment-item">
                      <strong>{comment.username}</strong>
                      <span>{comment.text}</span>
                    </div>
                  ))}
                </div>
              )}
            </article>
          ))}
        </div>

        <aside className="sidebar">
          <div className="panel stats-panel">
            <h2>Trending</h2>
            <div className="stat-card"><span>Top likes</span><strong>{stats.topLikes}</strong></div>
            <div className="stat-card"><span>Top comments</span><strong>{stats.topComments}</strong></div>
            <div className="stat-card"><span>Shared posts</span><strong>{stats.sharedPosts}</strong></div>
          </div>
          <div className="panel follow-panel">
            <h2>Discover people</h2>
            {users.map((item) => (
              <div key={item.id} className="follow-item">
                <div className="author">
                  <div className="avatar">{item.name?.charAt(0) || 'U'}</div>
                  <div>
                    <strong>{item.name}</strong>
                    <span>{item.followers} followers</span>
                  </div>
                </div>
                <button onClick={() => handleFollow(item.id)}>{item.isFollowing ? 'Unfollow' : 'Follow'}</button>
              </div>
            ))}
          </div>
        </aside>
      </section>
    </div>
  );
}
