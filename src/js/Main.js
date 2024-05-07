import '../css/Main.css';
import React from "react";
import MainSlideArea from "../pages/main/MainSlideArea.jsx";
import MainBoard from "../pages/main/MainBoard.jsx";
function Main(){
    return (
        <div>
            <MainSlideArea/>
            <div className={"MainContentArea"}>
                <div className={"search"}>
                    <h1> 빠른 조건 검색 </h1>
                </div>
                <div className={"boards"}>
                    <MainBoard title="notice"/>
                    <MainBoard title="feedback"/>
                </div>
            </div>
            <div className={"statistics"}>
                <h1> 보호소 통계 </h1>
            </div>
        </div>
    );
}

export default Main;