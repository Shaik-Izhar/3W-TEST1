import { sortPosts, getFeedStats } from './feedUtils';

describe('feedUtils', () => {
  const posts = [
    { _id: '1', text: 'First', image: '', likes: [1, 2], comments: [{}, {}], shares: [1] },
    { _id: '2', text: 'Second', image: 'https://img.com/1.jpg', likes: [1, 2, 3], comments: [{}, {}, {}], shares: [1, 2, 3] },
    { _id: '3', text: 'Third', image: 'https://img.com/2.jpg', likes: [1], comments: [], shares: [] },
  ];

  it('sorts posts by highest likes for the liked view', () => {
    const result = sortPosts(posts, 'liked');
    expect(result[0]._id).toBe('2');
  });

  it('sorts posts by highest shares for the shared view', () => {
    const result = sortPosts(posts, 'shared');
    expect(result[0]._id).toBe('2');
  });

  it('computes trending metrics from posts', () => {
    expect(getFeedStats(posts)).toEqual({
      topLikes: 3,
      topComments: 3,
      topShares: 3,
      sharedPosts: 2,
    });
  });
});
