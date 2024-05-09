import '../../css/Main.css';
import React from "react";
import {Outlet, useLocation} from "react-router-dom";
import SideBar from "../../component/common/SideBar.jsx";
import MenuJson from "../../jsons/Menu.json";
function Main(){
    const location= useLocation();
    const path = location.pathname;
    const pathArray = path.split("/",3);
    if(location.state == null){
        location.state = {};
        MenuJson.mainMenu.map((menu,index) =>{
            if(menu.addr == '/'+pathArray[1]) location.state.index = index;
        });
    }
    const target = MenuJson.mainMenu[location.state.index];
    const title = target.addrKR;
    const subMenu = target.subMenu;
    let subIndex = 0;

    if(pathArray.length > 2) {
        subMenu.map((subMenu, index) =>{
            if(subMenu.addr == path) {
                subIndex = index;
            }
        })
    }
    const subTitle = subMenu[subIndex].addrKR;


    const data = {
        index : location.state.index,
        target : target,
        title : title,
        subMenu : subMenu
    }

    return (
        <div className="flexContent">
            <SideBar data={data} />
            <div className="subBox">
                <p className="boardTitle">{subTitle}</p>
                <hr />
                <div className="boardContents">
                    <Outlet data={data} />
                </div>
            </div>

        </div>


    )
}

export default Main;