import { Button } from 'flowbite-react';
import React from 'react';

const CallToAction = () => {
  return (
    <div className='flex flex-col sm:flex-row p-3 border border-teal-500 justify-center items-center rounded-tl-3xl rounded-br-3xl mt-4'>
      <div className='flex-1 justify-center flex-col text-center sm:text-left'>
        <h2 className='text-3xl font-black'>Welcome to the World of Computer Languages</h2>
        <p className='text-gray-500 my-2 text-xs'>Checkout these resources with over 10 available programming language</p>
        <Button gradientDuoTone='purpleToPink' className='mx-auto sm:mx-0'><a href='#' rel='noopener noreferrer'>Learn More</a></Button>
      </div>
      <div className='p-7 flex-1 justify-items-end'>
        <img src='https://xiengineering.com/wp-content/uploads/2023/10/AdobeStock_519767884-1-scaled.jpeg' alt='...' />
      </div>
    </div>
  );
};

export default CallToAction;