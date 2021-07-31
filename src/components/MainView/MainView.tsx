import React, { FunctionComponent } from 'react';
import Nav from './Nav';
import Hero from './Hero';
import Footer from './Footer';

const MainView: FunctionComponent = () => {
  return (
    <>
      <Nav />
      <Hero />
      <Footer />
    </>
  );
};

export default MainView;
