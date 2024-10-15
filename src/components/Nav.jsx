import React from 'react';
import { Link } from 'react-router-dom';

const Nav = () => {
  return (
    <nav className="bg-gray-800 shadow-md p-4">
      <div className="flex justify-center">
        <Link 
          className="mr-4 text-sm uppercase font-semibold text-white hover:bg-gray-500 px-3 py-2 rounded transition duration-300"
          to="/"
        >
          Home
        </Link>
        <Link 
          className="text-sm uppercase text-white font-semibold hover:bg-gray-500 px-3 py-2 rounded transition duration-300"
          to="/gallery"
        >
          Gallery
        </Link>
      </div>
    </nav>
  );
};

export default Nav;