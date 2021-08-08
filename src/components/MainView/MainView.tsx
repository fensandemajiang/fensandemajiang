import React, { FunctionComponent } from 'react';
import Nav from './Nav';
import Hero from './Hero';
import Footer from './Footer';

const MainView: FunctionComponent = () => {
  return (
    <div className="flex flex-col h-screen">
      <div className="flex-auto flex-shrink-0">
        <Nav />
        <Hero />
      </div>
      <Footer />
    </div>
  );
};

export default MainView;
