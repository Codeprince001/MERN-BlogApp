import React from 'react';
import { useSelector } from 'react-redux';
import profilePic from "../assets/images/Developer.png";

const About = () => {
  const { currentUser } = useSelector(state => state.user);

  return (
    <div className="flex flex-col md:flex-row items-center justify-between p-6 md:p-10 gap-4">
      {/* Left Column: Text */}
      <div className="md:w-1/2 space-y-6">
        <h1 className="text-3xl md:text-4xl font-bold text-teal-600 text-center">About Me</h1>
        <p className="text-lg">
          Hi, I’m a passionate developer with expertise in building web applications.
          This blog app was crafted using modern tools and technologies like <strong>React.js</strong> for
          the frontend, <strong>React Redux</strong> for state management, <strong>Node.js</strong> for the backend, <strong> Express </strong> for server-side logic, <strong >MongoDB </strong> for the database and <strong >AWS S3 Bucket </strong> for storage.
          I also employed libraries like <strong> Flowbite </strong> for beautiful UI components and  <strong> Tailwind CSS </strong> for styling.
        </p>
        <p className="text-lg">
          I strive to create user-friendly, scalable, and efficient applications. My love for clean code and
          attention to detail drives me to deliver the best user experience. Thank you for exploring this blog!
        </p>
      </div>

      {/* Right Column: Image */}
      <div className="mt-6 md:mt-0 md:w-1/3 flex justify-center">
        <img
          src={profilePic}
          alt="About the Creator"
          className="rounded-lg shadow-lg w-80 md:w-full"
        />
      </div>
    </div>
  );
};

export default About;