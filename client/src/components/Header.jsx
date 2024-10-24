import { Button, Navbar, TextInput } from 'flowbite-react';
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { IoSearchOutline } from "react-icons/io5";
import { FaMoon } from "react-icons/fa";

const Header = () => {
  const path = useLocation().pathname;

  return (
    <Navbar className='border-b-2'>
      <Link to="/" className='self-center whitespace-nowrap text-sm sm:text-xl font-semibold dark:text-white'>
        <span className='mr-1 px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-700 rounded-lg text-white'>Wisdom's</span>
        Blog
      </Link>

      <form>
        <TextInput
          type='text'
          placeholder='Search...'
          rightIcon={IoSearchOutline}
          className='hidden lg:inline'
        />
      </form>
      <Button className='w-12 h-10 lg:hidden' color='gray' pill>
        <IoSearchOutline />
      </Button>
      <div className='flex gap-2 md:order-2'>
        <Button className='w-12 h-10 hidden sm:inline' color='gray' pill>
          <FaMoon />
        </Button>

        <Link to="/sign-in">
          <Button gradientDuoTone="purpleToBlue" >
            Sign In
          </Button>
        </Link>

        <Navbar.Toggle />
      </div>
      <Navbar.Collapse>

        <Navbar.Link active={path === "/"} as={div}>
          <Link to="/">Home</Link>
        </Navbar.Link>

        <Navbar.Link active={path === "/about"} as={div}>
          <Link to="/about">About</Link>
        </Navbar.Link>

        <Navbar.Link active={path === "/projects"} as={div}>
          <Link to="/projects">Projects</Link>
        </Navbar.Link>

      </Navbar.Collapse>
    </Navbar>
  );
};

export default Header;