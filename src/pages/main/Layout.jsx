import React, {useEffect} from "react";
import Header from "../../component/common/Header.jsx";
import "../../css/Main.css"
import {Outlet} from "react-router-dom";
import useRefFocusEffect from "../../js/useRefFocusEffect.js";
import Footer from "../../component/common/Footer.jsx";

function Layout() {
    return (
        <div id="wrap">
            <Header />
            <div id="container">
                <Outlet/>
            </div>
            <Footer/>
        </div>
    )
}

export default Layout;