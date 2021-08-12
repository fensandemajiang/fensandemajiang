import React, { FunctionComponent } from 'react';
import { Link } from 'react-router-dom';

const Footer: FunctionComponent = () => {
  return (
    <footer className="bg-gray-300 text-center bottom-0 p-4 flex-shrink-0">
      <div className="font-bold">
        <Link to="/">FEN SAN DE MA JIANG</Link>
      </div>
    </footer>
  );
};

export default Footer;
