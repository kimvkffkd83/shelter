import '../../css/Main.css';
import React from "react";
import MainSlideBox from "./MainSlideBox.jsx";
import MainBoard from "./MainBoard.jsx";
function Main(){
    return (
        <div>
            <MainSlideBox/>
            <div className="main__contents">
                <div className="main__box__fast-search">
                    <h1> 빠른 조건 검색 </h1>
                </div>
                <div className="main__box__board">
                    <MainBoard title="notice"/>
                    <MainBoard title="feedback"/>
                </div>
            </div>
            <div className="main__box__statistics">
                <h1> 보호소 통계 </h1>
            </div>
        </div>
    );
}

export default Main;