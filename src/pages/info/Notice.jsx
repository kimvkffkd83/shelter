import React, {useEffect, useState} from "react";
import "../../css/Main.css"
import Board from '../../api/Board.jsx';
import Write from "./Write.jsx";
import {useLocation} from "react-router-dom";
import View from "./View.jsx";
import Paging from "../../component/common/Paging.jsx";
import List from "./List.jsx";
import ath from "../../js/authority.js";

function Notice() {
    const [board,setBoard] = useState([]);
    const [totalCnt , setTotalCnt] = useState(0);
    const [pageNo, setPageNo] = useState(1);

    const [isAdmin ,setIsAdmin]= useState(ath.isAdmin());

    useEffect(()=>{
        console.log(isAdmin);
        setIsAdmin(ath.isAdmin())
    }, [localStorage.getItem('token')]);


    //type 0 : view, type 1 : write, type 2 : update
    const [isEditable, setIsEditable] = useState({editable : false, type : 0});
    const [isSingleView, setIsSingleView] = useState({single : false , ntcNo : 0})
    const [select, setSelect] = useState(false);

    const getList = () =>{
        Board.list(pageNo).then((res)=> {
            setTotalCnt(res.totalCount);
            setBoard(res.lists);
        });
    }
    useEffect(() => {
        getList();
    }, [isEditable, isSingleView, pageNo, select]);

    const setEditState = (childState) =>{
        setIsEditable(childState);
    }

    const setViewState = (childState)=>{
        setIsSingleView(childState);
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

            if(postNos.length<=0){
                alert("삭제할 게시물을 선택해주세요.")
                return;
            }

            Board.removeSelected(postNos).then((res) =>{
                console.log(res);
                setSelect(false);
            })
        }
    }

    const hidePosts = () =>{
        if(window.confirm('선택한 게시물들을 비공개하시겠습니까?')){
            const selectedPosts = document.getElementsByName("select")

            const postNos = [];
            selectedPosts.forEach((post,idx) =>{
                if(post.checked) postNos.push(post.parentElement.dataset.ntcNo)
            })

            if(postNos.length<=0){
                alert("비공개할 게시물을 선택해주세요.")
                return;
            }

            Board.hideSelected(postNos).then((res) =>{
                console.log(res);
                setSelect(false);
            })
        }
    }

    const getView = (ntcNo)=>{
        //관리자는 조회수 올리지 않기
        if(!isAdmin){
            Board.vcnt(ntcNo).then((res) =>{
                console.log(res);
            })
        }
        Board.view(ntcNo).then((res)=> {
            if(res.length === 0){
                alert("존재하지 않는 게시글입니다")
            }else{
                setPost(res[0]);
                setIsSingleView({single : true , ntcNo : ntcNo})
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

    return (
        <>
        {(isEditable.editable) ?
            <Write data={isEditable} post={post} changeEditable={setEditState}/> :
            <>
                {
                    (isSingleView.single) ?
                        <View
                            data={post}
                            isAdmin={isAdmin}
                            changeSingle={setViewState}
                            changeEditable={setEditState}/> :
                        <>
                            <List
                                   totalCnt={totalCnt}
                                   pageNo={pageNo}
                                   board={board}
                                   view={view}
                                   write={write}
                                   selectPosts={selectPosts}
                                   hidePosts={hidePosts}
                                   deletePosts={deletePosts}
                                   isAdmin={isAdmin}
                                   select={select}
                            />
                            <div className="board__paging">
                                {totalCnt > 0 &&
                                    <Paging pageNo={pageNo} changePage={setPageState} totalRows={totalCnt} rowMax={10}></Paging>
                                }
                            </div>
                        </>
                }
            </>
        }
        </>
    )
}

export default Notice;