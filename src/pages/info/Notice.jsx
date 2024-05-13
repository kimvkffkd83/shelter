import React, {useEffect, useState} from "react";
import "../../css/Main.css"
import Board from '../../js/board.jsx';
import write from "./Write.jsx";
import Write from "./Write.jsx";
import {Link} from "react-router-dom";

function Notice() {
    const title = 'notice';
    const [board,setBoard] = useState([]);
    const [totalCnt , setTotalCnt] = useState(0);
    const isAdmin = true;

    const [isEditable, setIsEditable] = useState(
        {"editable" : false, "type" : 0}
    );

    useEffect(() => {
        Board.getData(title).then((res)=> {
            setBoard(res.data);
        });
        Board.getCnt(title).then((res) =>{
            setTotalCnt(res.data[0].cnt);
        });
    }, [isEditable]);



    const setEditState = (childState) =>{
        setIsEditable(childState);
    }




    const write = ()=>{
        setIsEditable({"editable" : true, "type" : 1});
    }

    const update = ()=>{
        setIsEditable({"editable" : true, "type" : 2});
    }

    return (
        <>
        {(isEditable.editable) ?
            <Write data={isEditable} changeEditable={setEditState}/> :
            <>
                <div>
                    <span>전체 : {totalCnt} / 페이지수 : {1}</span>
                </div>
                <ul className="boardTable">
                    <li>
                        <div className="table th">번호</div>
                        <div className="table th">제목</div>
                        <div className="table th">작성자</div>
                        <div className="table th">등록일</div>
                        <div className="table th">조회</div>
                    </li>
                    {
                        board.map((post, index)=>(
                            <li key={index}>
                                <div className="table tc">{index}</div>
                                <div className="table tc">{post.title}</div>
                                <div className="table tc">{post.userId}</div>
                                <div className="table tc">{post.date}</div>
                                <div className="table tc">{post.vcnt}</div>
                            </li>
                        ))
                    }
                </ul>
                {isAdmin &&
                    <div className="admin">
                        <button onClick={write}>등록</button>
                        {/*<button onClick={update}>수정</button>*/}
                        <button>삭제</button>
                    </div>
                }
            </>
        }
        </>
    )
}

export default Notice;