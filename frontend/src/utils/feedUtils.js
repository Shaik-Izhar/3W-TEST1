export const sortPosts = (posts, tab) => {
  const list = [...posts];

  if (tab === 'liked') {
    return list.sort((a, b) => (b.likes?.length || 0) - (a.likes?.length || 0));
  }

  if (tab === 'commented') {
    return list.sort((a, b) => (b.comments?.length || 0) - (a.comments?.length || 0));
  }

  if (tab === 'shared') {
    return list.sort((a, b) => (b.shares?.length || 0) - (a.shares?.length || 0));
  }

  return list;
};

export const getFeedStats = (posts) => ({
  topLikes: posts.reduce((acc, post) => Math.max(acc, post.likes?.length || 0), 0),
  topComments: posts.reduce((acc, post) => Math.max(acc, post.comments?.length || 0), 0),
  topShares: posts.reduce((acc, post) => Math.max(acc, post.shares?.length || 0), 0),
  sharedPosts: posts.filter((post) => (post.shares?.length || 0) > 0).length,
});
