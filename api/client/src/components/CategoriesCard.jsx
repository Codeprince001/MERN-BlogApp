import React from 'react';

const CategoryCard = ({ icon: Icon, title }) => {
  return (
    <div className="m-4 flex flex-col  max-w-[50%] items-center bg-[#f0f0f2] shadow-lg rounded-lg p-6 hover:shadow-xl transition-shadow duration-300 cursor-pointer">
      <div className="text-teal-500 text-4xl mb-4"><Icon /></div>
      <h3 className="text-lg font-semibold text-gray-700 text-center">{title}</h3>
    </div>
  );
};

export default CategoryCard;
