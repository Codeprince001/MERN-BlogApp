import React from 'react';
import PostCard from './PostCard';

const RecentArticles = ({ recentPosts }) => {
  return (
    <div className='flex flex-col justify-center items-center mb-5'>
      <h1 className='text-md mt-5'>Recent Articles</h1>
      <div className='flex flex-wrap gap-5 mt-5 justify-center'>
        {
          recentPosts && recentPosts.map((post) => {
            return (
              <PostCard key={post._id} post={post} />
            );
          })
        }
      </div>
    </div>
  );
};

export default RecentArticles;