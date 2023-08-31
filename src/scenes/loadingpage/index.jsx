import React from 'react';
import Header from '../../components/header/header';
import Footer from '../../components/Footer/footer';
import LoadingBody from '../../components/widgets/LoadingBody';

function Loading(props) {

    return (
        <div>
            <Header />
            <LoadingBody />
            <Footer />
        </div>
    );
}

export default Loading;