import NavBar from '@/components/global/NavBar';
import React from 'react';
import { Outlet } from 'react-router-dom';
import Footer from '@/components/global/Footer';

const Layout: React.FC = () => {
  return (
    <>
      <NavBar />
      <div className="pt-16 min-h-screen flex flex-col">
        {/* Outlet renders the matched child route */}
        <div className="flex-grow">
          <Outlet />
        </div>
        <Footer />
      </div>
    </>
  );
};

export default Layout;
