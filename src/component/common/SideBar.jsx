import React from "react";
import {Link, useLocation} from "react-router-dom";

function SideBar(props){
    return (
        <aside className="box__snb">
            <h1 className="box__title">{props.data.title}</h1>
            <hr className="box__line"/>
            <ul className="snb">
                { props.data.target?.subMenu?.map((str, index ) => (
                    <li className={"snb__menu "+(index===props.data.subIndex? "snb__menu_selected" : "")} key={index}>
                        <Link to={str.addr} state={{index:props.data.index}} className="sbn__menu-link">{str.addrKR}</Link>
                    </li>))
                }
            </ul>
        </aside>
    )
}

export default SideBar;