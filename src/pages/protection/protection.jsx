import React from "react";
import "../../css/Main.css"
import {useLocation} from "react-router-dom";
import Filter from "./Filter.jsx";
import AnmView from "./AnmView.jsx";

function Protection() {
    const location = useLocation();
    console.log("location",location.search);
    return (
        <>
            <Filter />
            <AnmView />
        </>
    )
}

export default Protection;