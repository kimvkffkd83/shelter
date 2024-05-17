import React, {useEffect} from "react";
import {Link} from "react-router-dom";
import MenuJson from "../../jsons/Menu.json"
import useRefFocusEffect from "../../js/useRefFocusEffect.js";

function Header (){
    const {ref,showTopBtn} = useRefFocusEffect();

    useEffect(() => {
        const topBtn = document.getElementById("btn__top");
        if(showTopBtn){
            topBtn.style.display = 'block';
        }else{
            topBtn.style.display = 'none';
        }
        console.log("showTopBtn:",showTopBtn);
    }, [showTopBtn]);

    const handleScrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <>
            <div id="toolbar"></div>
            <header id="header">
                <div className="header__logo">
                    {<Link to="/" className="header__logo-link"/>}
                </div>
                <nav className="header__nav" ref={ref}>
                    <ul id="gnb">
                        {
                            MenuJson.mainMenu.map((menu, mainIndex) => (
                                <li key={mainIndex} className="gnb__menu">
                                    <Link to={menu.addr} state={{index: mainIndex}}
                                          className="gnb__menu-link">{menu.addrKR}</Link>
                                    <ul id="lnb">
                                        {menu.subMenu.map((subMenu, index) => (
                                            <li key={index} className="lnb__menu">
                                                <Link to={subMenu.addr} state={{index: mainIndex}}
                                                      className="lng__menu-link">{subMenu.addrKR}</Link>
                                            </li>
                                        ))}
                                    </ul>
                                </li>
                            ))
                        }
                    </ul>
                </nav>
            </header>
            <button id="btn__top" onClick={handleScrollToTop}>
                <span className="material-symbols-outlined">north</span>
            </button>
        </>
    )
}

export default Header;