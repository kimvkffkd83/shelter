import '../css/Main.css';
import React, {useEffect, useState} from "react";
import {Outlet, useLocation} from "react-router-dom";
import SideBar from "./common/SideBar.jsx";
import MenuJson from "../jsons/Menu.json";
function SubLayout(){
    const location= useLocation();
    const [menu, setMenu] = useState({
        index: 0,
        target: MenuJson.mainMenu[0],
        title: '',
        subTitle: ''
    });

    // location이 정해지면 index,subIndex가 정해짐
    useEffect(()=>{
        const pathArray = location.pathname.split("/",3);

        //인덱스 정하기
        let index = location.state?.index ?? 0;
        if(location.state === null){
            const newIndex = MenuJson.mainMenu.findIndex(menu => menu.addr === '/'+pathArray[1])
            if(newIndex !== -1) {
                index = newIndex;
            }
        }

        //서브 인덱스 정하기
        const target = MenuJson.mainMenu[index];
        const title = target.addrKR;
        const subMenu = target.subMenu;
        let subIndex = 0;
        if(pathArray.length > 2) {
            subIndex = subMenu.findIndex(subMenu => subMenu.addr === location.pathname)
        }

        //서브 타이틀 정하기
        const subTitle = subMenu[subIndex].addrKR

        //최종적으로 바뀔 값은 메뉴 데이터
        setMenu({
            index ,
            target,
            title,
            subTitle
        })

    },[location])

    return (
        <div className="flex_container">
            <SideBar data={menu} />
            <div className="box__content">
                <h2 className="box__content__title">{menu.subTitle}</h2>
                <hr className="box__content__line"/>
                <div className="box__content__board">
                    <Outlet data={menu} />
                </div>
            </div>
        </div>
    )
}

export default SubLayout;