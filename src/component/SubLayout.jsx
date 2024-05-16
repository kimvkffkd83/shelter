import '../css/Main.css';
import React, {useEffect, useState} from "react";
import {Outlet, useLocation} from "react-router-dom";
import SideBar from "./common/SideBar.jsx";
import MenuJson from "../jsons/Menu.json";
function SubLayout(){
    const location= useLocation();
    const initialState = location.state?.index ?? 0;
    const [index,setIndex] = useState(initialState);

    const pathArray = location.pathname.split("/",3);
    useEffect(() => {
        if(location.state === null){
            const newIndex = MenuJson.mainMenu.findIndex(menu => menu.addr === '/'+pathArray[1])
            if(newIndex !== -1) {
                setIndex(newIndex);
            }
        }else{
            setIndex(initialState);
        }
    }, [location]);
    const target = MenuJson.mainMenu[index];
    const title = target.addrKR;
    const subMenu = target.subMenu;
    let subIndex = 0;

    if(pathArray.length > 2) {
        subIndex = subMenu.findIndex(subMenu => subMenu.addr === location.pathname);
    }
    const subTitle = subMenu[subIndex].addrKR;

    const data = {
        index ,
        target,
        title,
        subMenu
    }

    return (
        <div className="flex_container">
            <SideBar data={data} />
            <div className="box__content">
                <h2 className="box__content__title">{subTitle}</h2>
                <hr className="box__content__line"/>
                <div className="box__content__board">
                    <Outlet data={data} />
                </div>
            </div>

        </div>


    )
}

export default SubLayout;