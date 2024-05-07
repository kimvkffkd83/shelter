import '../../css/Main.css';
import React from "react";
import {Outlet} from "react-router-dom";
function Main(){
    return (
        <div className="flexContent">
            <aside className="sideBar" />
            <div className="subBox">
                <Outlet />
            </div>

        </div>


    )
}

export default Main;