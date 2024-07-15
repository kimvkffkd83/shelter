import {Outlet, useLocation} from "react-router-dom";
import React, {useEffect, useState} from "react";
import MenuJson from "../jsons/Menu.json";

const WideLayout = () =>{
    const location= useLocation();
    const [menu, setMenu] = useState({
        index: 0,
        target: MenuJson.mainMenu[0],
        title: '',
    });

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
        const target = MenuJson.mainMenu[index];
        const title = target.addrKR;

        //최종적으로 바뀔 값은 메뉴 데이터
        setMenu({
            index ,
            target,
            title
        })

    },[location])

    return (
        <div className="flex_container-wide">
            <div className="box__content-wide">
                <h2 className="box__content__title">{menu.title}</h2>
                <hr className="box__content__line"/>
                <div className="box__content__board">
                    <Outlet data={menu} />
                </div>
            </div>
        </div>
    )
}
export default WideLayout;