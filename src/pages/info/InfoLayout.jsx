import '../../css/Main.css';
import React from "react";
import {Outlet} from "react-router-dom";
import SideBar from "../../component/common/SideBar.jsx";
function Main(){
    return (
        <div className="flexContent">
            <SideBar />
            <div className="subBox">
                <Outlet />
            </div>

        </div>


    )
}

export default Main;