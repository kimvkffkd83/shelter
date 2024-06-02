import React from "react";
import "../../css/Main.css"
import {useLocation} from "react-router-dom";
import Filter from "./Filter.jsx";
import AnmView from "./AnmView.jsx";

function Protection() {
    return (
        <>
            <Filter/>
        </>
    )
}

export default Protection;