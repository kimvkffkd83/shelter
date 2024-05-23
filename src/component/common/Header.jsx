import React, {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import MenuJson from "../../jsons/Menu.json"
import useRefFocusEffect from "../../js/useRefFocusEffect.js";

function Header (){
    const {ref,showTopBtn} = useRefFocusEffect();
    const [activeMenu, setActiveMenu] = useState(false);

    useEffect(() => {
        const topBtn = document.getElementById("btn__top");
        if(showTopBtn){
            topBtn.style.display = 'block';
        }else{
            topBtn.style.display = 'none';
        }
    }, [showTopBtn]);

    const handleScrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const mouseEnter = (index) => {
        setActiveMenu(index);
    }
    const mouseLeave = (index) => {
        setActiveMenu(null);
    }

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
                                <li key={mainIndex} className="gnb__menu" onMouseOver={() =>mouseEnter(mainIndex)} onMouseOut={mouseLeave}>
                                    <Link to={menu.addr} state={{index: mainIndex}}
                                          className="gnb__menu-link"
                                          data-link={mainIndex}>{menu.addrKR}</Link>
                                    <ul className={`lnb ${activeMenu === mainIndex ? 'lnb-show' : 'lnb-disabled'}`}
                                        onMouseEnter={() => mouseEnter(mainIndex)}
                                        onMouseLeave={mouseLeave}>
                                        {menu.subMenu.map((subMenu, index) => (
                                            <li key={index} className="lnb__menu">
                                                <Link to={subMenu.addr} state={{index: mainIndex}}
                                                      className="lnb__menu-link">{subMenu.addrKR}</Link>
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