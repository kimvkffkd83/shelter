import React from "react";
import {Link} from "react-router-dom";

function SideBar(){
    let title ="센터소개";
    let subTitle =[
        {addr : '/info', addrKR :"소개하는 글"},
        {addr : '/info/notice',addrKR : '공지사항'},
        {addr : '/info/orgn',addrKR : '조직도'},
        {addr : '/info/map',addrKR : '찾아오시는 길'}
    ];


    return (
        <aside className="sideBar" >
            <div>{title}</div>
            <ul>
                { subTitle.map((str, index ) => (
                    <ul>
                        <li key={index}><Link to={str.addr}>{str.addrKR}</Link></li>
                    </ul>))
                }
            </ul>


        </aside>
    )

}

export default SideBar;