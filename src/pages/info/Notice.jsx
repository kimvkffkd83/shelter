import React, {useEffect, useState} from "react";
import "../../css/Main.css"
import Board from '../../api/Board.jsx';
import write from "./Write.jsx";
import Write from "./Write.jsx";
import {Link} from "react-router-dom";
import View from "./View.jsx";

function Notice() {
    const title = 'notice';
    const [board,setBoard] = useState([]);
    const [totalCnt , setTotalCnt] = useState(0);

    const isAdmin = true;

    //type 0 : view
    //type 1 : write
    //type 1 : update
    const [isEditable, setIsEditable] = useState(
        {"editable" : false, "type" : 0}
    );
    const [isVisible, setIsVisible] = useState({visible : false , ntcNo : 0})

    useEffect(() => {
        Board.list(title).then((res)=> {
            setBoard(res);
        });
        Board.tcnt(title).then((res) =>{
            setTotalCnt(res[0].cnt);
        });
        // setPost([]);
    }, [isEditable, isVisible]);



    const setEditState = (childState) =>{
        setIsEditable(childState);
    }

    const setViewable = (childState)=>{
        setIsVisible(childState);
    }




    const write = ()=>{
        setPost([]);
        setIsEditable({"editable" : true, "type" : 1});
    }

    const [post, setPost] = useState([])
    const view =(e)=>{
        const ntcNo = e.currentTarget.dataset.ntcNo;
        Board.view(ntcNo).then((res)=> {
            if(res.length === 0){
                alert("존재하지 않는 게시글입니다")
            }else{
                setPost(res);
                setIsVisible({visible : true , ntcNo : ntcNo})
            }
        });
    }

    const update = ()=>{
        setIsEditable({"editable" : true, "type" : 2});
    }

    return (
        <>
        {(isEditable.editable) ?
            <Write data={isEditable} post={post} changeEditable={setEditState}/> :
            <>
                {
                    (isVisible.visible) ?
                        <View data={post} changeVisible={setViewable} changeEditable={setEditState}/> :
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
                                    board.map((post, index) => (
                                        <li key={index} className="view" onClick={view} data-ntc-no={post.ntcNo}>
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
        }
        </>
    )
}

export default Notice;