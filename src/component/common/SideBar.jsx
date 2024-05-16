import React from "react";
import {Link, useLocation} from "react-router-dom";
import MenuJson from "../../jsons/Menu.json"

function SideBar(props){
    return (
        <aside className="box__snb">
            <h1 className="box__title">{props.data.title}</h1>
            <hr className="box__line"/>
            <ul className="snb">
                { props.data.subMenu.map((str, index ) => (
                    <li className="snb__menu" key={index}>
                        <Link to={str.addr} state={{index:props.data.index}}>{str.addrKR}</Link>
                    </li>))
                }
            </ul>
        </aside>
    )
}

export default SideBar;