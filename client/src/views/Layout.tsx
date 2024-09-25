import  NavBar  from '@/components/global/NavBar';
import React from 'react';
import { Outlet } from 'react-router-dom';
import Footer from '@/components/global/Footer';


const Layout: React.FC = () => {
  return (
    <>
      <NavBar />
      <div className="content">
        {/* Outlet renders the matched child route */}
        <Outlet />
      </div>
      <Footer/>
    </>
  );
};

export default Layout;
