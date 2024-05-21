import React, {useEffect, useState} from "react";
import "../../css/Main.css"
import Board from '../../api/Board.jsx';
import write from "./Write.jsx";
import Write from "./Write.jsx";
import {Link, useLocation} from "react-router-dom";
import View from "./View.jsx";
import Paging from "../../component/common/Paging.jsx";

function Notice() {
    const title = 'notice';
    const [board,setBoard] = useState([]);
    const [totalCnt , setTotalCnt] = useState(0);
    const [pageNo, setPageNo] = useState(1);

    const isAdmin = true;

    //type 0 : view, type 1 : write, type 2 : update
    const [isEditable, setIsEditable] = useState(
        {"editable" : false, "type" : 0}
    );
    const [isVisible, setIsVisible] = useState({visible : false , ntcNo : 0})
    const [select, setSelect] = useState(false);

    useEffect(() => {
        Board.list(pageNo).then((res)=> {
            setBoard(res);
        });
        Board.tcnt().then((res) =>{
            setTotalCnt(res[0].cnt);
        });
    }, [isEditable, isVisible, pageNo, select]);

    const setEditState = (childState) =>{
        setIsEditable(childState);
    }

    const setViewState = (childState)=>{
        setIsVisible(childState);
    }

    const setPageState = (childState) =>{
        setPageNo(childState);
    }
    const write = ()=>{
        setPost([]);
        setIsEditable({"editable" : true, "type" : 1});
    }

    const selectPosts = ()=>{
        if(totalCnt === 0){
            window.alert('삭제할 게시글이 없습니다.');
            return;
        }
        setSelect(!select);
    }

    const deletePosts = () =>{
        if(window.confirm('선택한 게시물들을 삭제하시겠습니까?')){
            const selectedPosts = document.getElementsByName("select")

            const postNos = [];
            selectedPosts.forEach((post,idx) =>{
                if(post.checked) postNos.push(post.parentElement.dataset.ntcNo)
            })

            Board.removeSelected(postNos).then((res) =>{
                console.log(res);
                setSelect(false);
            })
        }
    }

    const getView = (ntcNo)=>{
        Board.vcnt(ntcNo).then((res) =>{
            console.log(res);
            }
        )
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
        if(state?.boardNo){
            getView(state.boardNo);
        }
    }, [state]);

    const cancleProp = (e)=>{
        e.cancelBubble()
    }

    return (
        <>
        {(isEditable.editable) ?
            <Write data={isEditable} post={post} changeEditable={setEditState}/> :
            <>
                {
                    (isVisible.visible) ?
                        <View data={post} changeVisible={setViewState} changeEditable={setEditState}/> :
                        <>
                            <div className="table__info">
                                <span>전체 : {totalCnt} / 현재 페이지 : {pageNo}</span>
                            </div>
                            <ul className="table__board">
                                <li className="table__header">
                                    {select &&
                                        <div className="table__header__text w10"><span className="material-symbols-outlined">check</span></div>
                                    }
                                    <div className="table__header__text w10">번호</div>
                                    <div className="table__header__text w50">제목</div>
                                    <div className="table__header__text w10">작성자</div>
                                    <div className="table__header__text w20">등록일</div>
                                    <div className="table__header__text w10">조회</div>
                                </li>
                                {totalCnt === 0? 
                                    <div className="table__content__no-data">
                                        <span>게시글이 없습니다.</span>
                                    </div>
                                    :
                                    board.map((post, index) => (
                                        <li key={index} className="table__content" onClick={view}
                                            data-ntc-no={post.ntcNo}>
                                            {select &&
                                                <input className="table__content__text w10" type="checkbox" onClick={event => event.stopPropagation()} name='select'/>
                                            }
                                            <div className="table__content__text w10">{index+((pageNo-1)*10)+1}</div>
                                            <div
                                                className="table__content__text w50 tl text-overflow">{post.title}</div>
                                            <div className="table__content__text w10">{post.userId}</div>
                                            <div className="table__content__text w20">{post.date}</div>
                                            <div className="table__content__text w10">{post.vcnt}</div>
                                        </li>
                                    ))
                                }
                            </ul>
                            <div className="board__paging">
                                {totalCnt > 0 &&
                                    <Paging pageNo={pageNo} changePage={setPageState} totalRows={totalCnt} ></Paging>
                                }
                            </div>
                            {isAdmin &&
                                <div className="box__adm">
                                    <div className="box__adm__btns">
                                        {!select &&
                                        <button className="btn__adm" onClick={write}>등록</button>
                                        }
                                        {select &&
                                            <button className="btn__adm" onClick={deletePosts}>{'삭제'}</button>
                                        }
                                        <button className="btn__adm" onClick={selectPosts}>{select ? '취소' : '삭제'}</button>
                                    </div>
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