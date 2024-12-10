import { Button } from 'flowbite-react';
import React from 'react';

const CallToAction = () => {
  return (
    <div className='flex flex-col sm:flex-row p-3 border border-teal-500 justify-center items-center rounded-tl-3xl rounded-br-3xl mt-4'>
      <div className='flex-1 justify-center flex-col text-center sm:text-left'>
        <h2 className='text-2xl font-black'>Welcome to the World of Computer Languages</h2>
        <p className='text-gray-500 my-2 text-xs'>Checkout these resources with over 10 available programming language</p>
        <Button gradientDuoTone='purpleToPink' className='mx-auto sm:mx-0'><a href='/' target='_blank' rel='noopener noreferrer'>Learn More</a></Button>
      </div>
      <div className='p-7 flex-1 justify-items-end'>
        <img width={200} src='https://camo.githubusercontent.com/a615ccee1fede08a3322b260a6c9b09fa7c9d76bb410469650b284ebebcaef57/68747470733a2f2f692e70696e696d672e636f6d2f6f726967696e616c732f65382f66342f35332f65386634353334363961336563393765636433353464663436356437333931332e676966' alt='...' />
      </div>
    </div>
  );
};

export default CallToAction;