import '../../css/Main.css';
import React from "react";
import MainSlideBox from "./MainSlideBox.jsx";
import MainBoard from "./MainBoard.jsx";
import RapidSearch from "./RapidSearch.jsx";
import Statistics from "./Statistics.jsx";
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
                <Statistics />
            </div>
        </div>
    );
}

export default Main;