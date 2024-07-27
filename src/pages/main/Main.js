import '../../css/Main.css';
import React from "react";
import MainSlideBox from "./MainSlideBox.jsx";
import MainBoard from "./MainBoard.jsx";
import RapidSearch from "./RapidSearch.jsx";
function Main(){
    return (
        <div>
            <MainSlideBox/>
            <div className="main__contents">
                <div className="main__box__rapid">
                    <RapidSearch />
                </div>
                <div className="main__box__board">
                    <MainBoard title="notice"/>
                    <MainBoard title="review"/>
                </div>
            </div>
            <div className="main__box__statistics">
                <h1> 보호소 통계 </h1>
            </div>
        </div>
    );
}

export default Main;