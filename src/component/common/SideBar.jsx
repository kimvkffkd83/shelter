import React from "react";
import {Link, useLocation} from "react-router-dom";
import MenuJson from "../../jsons/Menu.json"

function SideBar(props){
    return (
        <aside className="sideBar" >
            <div>{props.data.title}</div>
            <hr/>
            <ul>
                { props.data.subMenu.map((str, index ) => (
                    <li key={index}>
                        <Link to={str.addr} state={{index:props.data.index}}>{str.addrKR}</Link>
                    </li>))
                }
            </ul>
        </aside>
    )
}

export default SideBar;