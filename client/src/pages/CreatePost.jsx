import { Button, FileInput, Select, TextInput } from 'flowbite-react';
import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const CreatePost = () => {


  const [post, setPost] = useState();


  return (
    <div className='p-3 max-w-3xl mx-auto min-h-screen'>
      <h1 className='text-center text-3xl my-7 font-semibold'>Create Post</h1>
      <form className='flex flex-col gap-4'>
        <div className='flex-col gap-4 sm:flex-row justify-between'></div>
        <TextInput type='text' placeholder='Title' required id='title' className='flex-1' />
        <Select>
          <option value="uncategorized">Select a category</option>
          <option value="javascript">Javascript</option>
          <option value="reactjs">ReactJs</option>
          <option value="machinelearning">Machine Learning</option>
          <option value="python">Python</option>
        </Select>

        <div className='flex gap-4 items-center justify-between border-4 border-teal-500 border-dotted p-3'>
          <FileInput type="file" accept='image/*' />
          <Button type="button" gradientDuoTone="purpleToBlue" size="sm" outline>Upload image</Button>
        </div>
        <ReactQuill theme='snow' required value={post} onChange={setPost} className='h-72 mb-12' placeholder='Enter text here...' />
        <Button type='submit' gradientDuoTone='purpleToPink'>Publish</Button>
      </form>
    </div>
  );
};

export default CreatePost;