import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../../components/header/header';
import Footer from '../../components/Footer/footer';

function Home(props) {
    return (
        <div>
            <Header />
            <Outlet />
            <Footer />
        </div>
    );
}

export default Home;