import React from "react";
import Header from "../../component/common/Header.jsx";
import "../../css/Main.css"
import {Outlet} from "react-router-dom";

function Layout() {
    return (
        <div className={"wrap"}>
            <Header/>
            <div className="content">
                <Outlet />
            </div>
            <footer>
                <h1>푸터</h1>
            </footer>
        </div>
    )
}

export default Layout;