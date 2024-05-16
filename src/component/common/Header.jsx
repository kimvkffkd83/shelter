import React from "react";
import {Link} from "react-router-dom";
import MenuJson from "../../jsons/Menu.json"

function Header (){
    return (
        <>
            <div id="toolbar"></div>
            <header id="header">
                <div className="header__logo">
                    {<Link to="/" />}
                </div>
                <nav className="header__nav">
                    <ul id="gnb">
                        {
                            MenuJson.mainMenu.map((menu, mainIndex) => (
                                <li key={mainIndex} className="gnb__menu">
                                    <Link to={menu.addr} state={{index:mainIndex}}>{menu.addrKR}</Link>
                                    <ul id="lnb">
                                        {menu.subMenu.map((subMenu, index) =>(
                                            <li key={index} className="lnb__menu">
                                                <Link to={subMenu.addr} state={{index:mainIndex}}>{subMenu.addrKR}</Link>
                                            </li>
                                        ))}
                                    </ul>
                                </li>
                            ))
                        }
                    </ul>
                </nav>
            </header>
        </>
    )
}

export default Header;