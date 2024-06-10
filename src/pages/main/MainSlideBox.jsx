import React, {useEffect, useState} from "react";
import MainSlide from "./MainSlide.jsx";
import Main from "../../api/Main.jsx";
import {useLocation} from "react-router-dom";

function MainSlideBox() {
    return (
        <div className="box__slider">
            <MainSlide />
        </div>
    )
}
export default MainSlideBox;