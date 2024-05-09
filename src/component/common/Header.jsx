import React from "react";
import {Link} from "react-router-dom";
import MenuJson from "../../jsons/Menu.json"

function Header (){
    return (
        <>
            <div className="toolbar"></div>
            <header>
                <div className={"logo"}>
                    {<Link to="/" />}
                </div>
                <nav>
                    <ul className="mainMenu">
                        {
                            MenuJson.mainMenu.map((menu, mainIndex) => (
                                <li key={mainIndex}>
                                    <Link to={menu.addr} state={{index:mainIndex}}>{menu.addrKR}</Link>
                                    <ul className="subMenu">
                                        {menu.subMenu.map((subMenu, index) =>(
                                            <li key={index}>
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