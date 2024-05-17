import React, {useEffect, useState} from "react";
import "../../css/Main.css"
import Board from '../../api/Board.jsx';
import write from "./Write.jsx";
import Write from "./Write.jsx";
import {Link, useLocation} from "react-router-dom";
import View from "./View.jsx";

function Notice() {
    const title = 'notice';
    const [board,setBoard] = useState([]);
    const [totalCnt , setTotalCnt] = useState(0);

    const isAdmin = true;

    //type 0 : view, type 1 : write, type 2 : update
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

    const update = ()=>{
        setIsEditable({"editable" : true, "type" : 2});
    }

    const getView = (ntcNo)=>{
        Board.view(ntcNo).then((res)=> {
            if(res.length === 0){
                alert("존재하지 않는 게시글입니다")
            }else{
                setPost(res);
                setIsVisible({visible : true , ntcNo : ntcNo})
            }
        })
    }

    const [post, setPost] = useState([])
    const view =(e)=>{
        const ntcNo = e.currentTarget.dataset.ntcNo;
        getView(ntcNo);
    }

    //메인페이지 -> 공지사항 게시글 클릭 시
    let {state} = useLocation();
    useEffect(() => {
        console.log("state:",state);
        if(state?.boardNo){
            // const boardNo = state.boardNo;
            // console.log("boardNo:",boardNo);
            getView(state.boardNo);
        }
    }, [state]);


    return (
        <>
        {(isEditable.editable) ?
            <Write data={isEditable} post={post} changeEditable={setEditState}/> :
            <>
                {
                    (isVisible.visible) ?
                        <View data={post} changeVisible={setViewable} changeEditable={setEditState}/> :
                        <>
                            <div className="table__info">
                                <span>전체 : {totalCnt} / 페이지 : {1}</span>
                            </div>
                            <ul className="table__board">
                                <li className="table__header">
                                    <div className="table__header__text w10">번호</div>
                                    <div className="table__header__text w50">제목</div>
                                    <div className="table__header__text w10">작성자</div>
                                    <div className="table__header__text w20">등록일</div>
                                    <div className="table__header__text w10">조회</div>
                                </li>
                                {
                                    board.map((post, index) => (
                                        <li key={index} className="table__content" onClick={view}
                                            data-ntc-no={post.ntcNo}>
                                            <div className="table__content__text w10">{index}</div>
                                            <div
                                                className="table__content__text w50 tl text-overflow">{post.title}</div>
                                            <div className="table__content__text w10">{post.userId}</div>
                                            <div className="table__content__text w20">{post.date}</div>
                                            <div className="table__content__text w10">{post.vcnt}</div>
                                        </li>
                                    ))
                                }
                            </ul>
                            <div className="board__paging"> 페이지네이션</div>
                            {isAdmin &&
                                <div className="box__adm">
                                    <button className="btn__adm" onClick={write}>등록</button>
                                    {/*<button onClick={update}>수정</button>*/}
                                    <button className="btn__adm">수정</button>
                                    <button className="btn__adm">삭제</button>
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