import { Footer, } from 'flowbite-react';
import React from 'react';
import { FaDiscord, FaFacebook, FaGithub, FaInstagram, FaTwitter } from 'react-icons/fa';
import { Link } from 'react-router-dom';


const FooterComponent = () => {
  return (
    <Footer container className='border-t-2'>
      <div className='w-full max-w-7xl mx-auto'>
        <div className='sm:flex gap-5 sm:items-center md:grid-cols-1 grid w-full'>
          <div className='mr-5'>
            <Link to="/" className='self-center whitespace-nowrap text-lg sm:text-xl font-semibold dark:text-white'>
              <span className='mr-1 px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-700 rounded-lg text-white'>Wisdom's</span>
              Blog
            </Link>
          </div>

          <div className='grid grid-cols-2 gap-3 sm:mt-4 sm:grid-cols-4 sm:gap-6 flex-1'>
            <div>
              <Footer.Title title='About' />
              <Footer.LinkGroup col>
                <Footer.Link>Our Team</Footer.Link>
                <Footer.Link>Careers</Footer.Link>
                <Footer.Link>Blog</Footer.Link>
              </Footer.LinkGroup>
            </div>

            {/* Column 2 */}
            <div>
              <Footer.Title title='Services' />
              <Footer.LinkGroup col>
                <Footer.Link>Consulting</Footer.Link>
                <Footer.Link>Development</Footer.Link>
                <Footer.Link>Design</Footer.Link>
              </Footer.LinkGroup>
            </div>

            {/* Column 3 */}
            <div>
              <Footer.Title title='Support' />
              <Footer.LinkGroup col>
                <Footer.Link>Help Center</Footer.Link>
                <Footer.Link>FAQs</Footer.Link>
                <Footer.Link>Contact Us</Footer.Link>
              </Footer.LinkGroup>
            </div>

            {/* Column 4 */}
            <div>
              <Footer.Title title='Legal' />
              <Footer.LinkGroup col>
                <Footer.Link>Privacy Policy</Footer.Link>
                <Footer.Link>Terms of Service</Footer.Link>
                <Footer.Link>Cookie Policy</Footer.Link>
              </Footer.LinkGroup>
            </div>
          </div>
        </div>

        <div>
          <Footer.Divider />
          <div className='w-full sm:flex sm:items-center  sm:justify-between'>
            <Footer.Copyright href='#' by='Wisdom Blog' year={new Date().getFullYear()} />
            <div className='flex gap-6 sm:mt-2 mt-4 justify-center'>
              <Footer.Icon href='#' icon={FaFacebook} />
              <Footer.Icon href='#' icon={FaInstagram} />
              <Footer.Icon href='#' icon={FaDiscord} />
              <Footer.Icon href='https://github.com/Codeprince001' icon={FaGithub} />
            </div>
          </div>
        </div>
      </div>
    </Footer>
  );
};

export default FooterComponent;
