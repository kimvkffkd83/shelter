import React from "react";
import {Link, useLocation} from "react-router-dom";
import MenuJson from "../../jsons/Menu.json"

function SideBar(){
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
    const subTitle = target.subMenu;

    return (
        <aside className="sideBar" >
            <div>{title}</div>
            <hr/>
            <ul>
                { subTitle.map((str, index ) => (
                    <li key={index}>
                        <Link to={str.addr} state={{index:location.state.index}}>{str.addrKR}</Link>
                    </li>))
                }
            </ul>
        </aside>
    )
}

export default SideBar;