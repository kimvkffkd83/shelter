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
    console.log("location",location);
    console.log("index2",index);


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
    console.log("data",data);

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

export default SubLayout;