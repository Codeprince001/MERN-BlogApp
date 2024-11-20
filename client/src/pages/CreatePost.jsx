import React, { useRef, useState } from 'react';
import { Alert, Button, FileInput, Select, TextInput } from 'flowbite-react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useNavigate } from 'react-router-dom';
import LoadingBar from 'react-top-loading-bar';

const CreatePost = () => {
  const navigate = useNavigate();
  const loadingBarRef = useRef(null);

  const [formData, setFormData] = useState({
    title: '',
    category: 'uncategorized',
    content: '',
    imageFile: null,
    imageFileUrl: null,
  });

  const [uploadState, setUploadState] = useState({
    isUploading: false,
    errorMessage: null,
    successMessage: null,
  });

  const [publishState, setPublishState] = useState({
    isPublishing: false,
    publishErrorMessage: null,
    publishSuccessMessage: null,
  });

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleUploadImage = async () => {
    const { imageFile } = formData;

    if (!imageFile) {
      setUploadState({ errorMessage: 'Please select an image.', isUploading: false });
      return;
    }

    setUploadState({ isUploading: true, errorMessage: null, successMessage: null });
    loadingBarRef.current.continuousStart();

    try {
      const uploadFormData = new FormData();
      uploadFormData.append('image', imageFile);

      const response = await fetch('/api/post/upload-postImage/', {
        method: 'POST',
        body: uploadFormData,
      });

      if (!response.ok) {
        throw new Error('Error uploading image.');
      }

      const data = await response.json();
      handleInputChange('imageFileUrl', data.signedUrl);

      setUploadState({
        isUploading: false,
        successMessage: 'Image uploaded successfully!',
        errorMessage: null,
      });
      loadingBarRef.current.complete();
    } catch (error) {
      setUploadState({ isUploading: false, errorMessage: error.message, successMessage: null });
      loadingBarRef.current.complete();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setPublishState({ isPublishing: true, publishErrorMessage: null, publishSuccessMessage: null });
    loadingBarRef.current.continuousStart();

    const { title, category, imageFileUrl, content } = formData;
    const submissionData = { title, category, content, imageFileUrl };

    try {
      const res = await fetch('/api/post/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submissionData),
      });

      const data = await res.json();

      if (!res.ok) {
        setPublishState({
          isPublishing: false,
          publishErrorMessage: data.message,
          publishSuccessMessage: null,
        });
        loadingBarRef.current.complete();
        return;
      }

      setPublishState({
        isPublishing: false,
        publishErrorMessage: null,
        publishSuccessMessage: 'Post successfully published!',
      });

      loadingBarRef.current.complete();
      navigate(`/post/${data.savedPost.slug}`);

    } catch (error) {
      setPublishState({
        isPublishing: false,
        publishErrorMessage: error.message,
        publishSuccessMessage: null,
      });
      loadingBarRef.current.complete();
    }
  };

  return (
    <div className="p-3 max-w-3xl mx-auto min-h-screen">
      {/* Progress Bar */}
      <LoadingBar color="#4F46E5" ref={loadingBarRef} height={3} />

      <h1 className="text-center text-3xl my-7 font-semibold">Create Post</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <TextInput
          type="text"
          placeholder="Title"
          required
          id="title"
          value={formData.title}
          onChange={(e) => handleInputChange('title', e.target.value)}
        />
        <Select
          value={formData.category}
          onChange={(e) => handleInputChange('category', e.target.value)}
        >
          <option value="uncategorized">Select a category</option>
          <option value="javascript">Javascript</option>
          <option value="reactjs">ReactJs</option>
          <option value="machinelearning">Machine Learning</option>
          <option value="python">Python</option>
        </Select>

        <div className="flex gap-4 items-center justify-between border-4 border-teal-500 border-dotted p-3">
          <FileInput
            type="file"
            accept="image/*"
            onChange={(e) => handleInputChange('imageFile', e.target.files[0])}
          />
          <Button
            type="button"
            gradientDuoTone="purpleToBlue"
            size="sm"
            outline
            onClick={handleUploadImage}
            disabled={uploadState.isUploading}
          >
            {uploadState.isUploading ? 'Uploading...' : 'Upload Image'}
          </Button>
        </div>

        {uploadState.errorMessage && <Alert color="failure">{uploadState.errorMessage}</Alert>}
        {uploadState.successMessage && <Alert color="success">{uploadState.successMessage}</Alert>}

        {formData.imageFileUrl && (
          <img
            src={formData.imageFileUrl}
            alt="Uploaded"
            className="mt-4 border rounded"
            style={{ maxHeight: '200px' }}
          />
        )}

        <ReactQuill
          theme="snow"
          required
          value={formData.content}
          onChange={(value) => handleInputChange('content', value)}
          className="h-72 mb-12"
          placeholder="Enter text here..."
        />
        <Button type="submit" gradientDuoTone="purpleToPink" disabled={publishState.isPublishing}>
          {publishState.isPublishing ? 'Publishing...' : 'Publish'}
        </Button>
        {publishState.publishErrorMessage && <Alert color="failure">{publishState.publishErrorMessage}</Alert>}
        {publishState.publishSuccessMessage && <Alert color="success">{publishState.publishSuccessMessage}</Alert>}
      </form>
    </div>
  );
};

export default CreatePost;
