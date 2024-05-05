import '../css/Main.css';
import React from "react";
import Header from "../component/common/Header.jsx";
import MainSlideArea from "../component/main/MainSlideArea.jsx";
import MainBoard from "../component/main/MainBoard.jsx";
function Main(){
    return (
        <div className={"wrap"}>
            <Header />
            <MainSlideArea />
            <div className={"contents"}>
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
            <footer>
                 <h1>푸터</h1>
            </footer>
        </div>
    );
}

export default Main;