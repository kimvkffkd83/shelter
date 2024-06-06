import React from "react";
import "../../css/Main.css"
import Filter from "./Filter.jsx";

function Protection() {
    const isAdmin = true;

    const write = ()=>{
        // setPost([]);
        // setIsEditable({"editable" : true, "type" : 1});
    }

    return (
        <>
            <Filter/>
            {isAdmin &&
                <div className="box__adm">
                    <div className="box__adm__btns">
                        <button className="btn__adm" onClick={write}>등록</button>
                    </div>
                </div>
            }
        </>

    )
}

export default Protection;