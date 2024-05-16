import React from "react";
import Header from "../../component/common/Header.jsx";
import "../../css/Main.css"
import {Outlet} from "react-router-dom";

function Layout() {
    return (
        <div id="wrap">
            <Header/>
            <div id="container">
                <Outlet />
            </div>
            <footer id="footer">
                <h1>푸터</h1>
            </footer>
        </div>
    )
}

export default Layout;