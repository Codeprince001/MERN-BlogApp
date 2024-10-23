import React from 'react';

const Home = () => {
  return (
    <div>{console.log(process.env.SECRET)}</div>
  );
};

export default Home;