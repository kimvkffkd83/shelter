import React, {useEffect, useRef, useState} from "react";
import {useLocation} from "react-router-dom";
import api from "../../api/Adopt.jsx";
import View from "../adoption/View.jsx";
import List from "../adoption/List.jsx";
import Paging from "../../component/common/Paging.jsx";
import Write from "./Write.jsx";

const Review = () =>{
    const isAdmin = true;
    //
    //type 0 : view, type 1 : write, type 2 : update
    const [isEditable, setIsEditable] = useState({editable : false, type : 0});
    const [isSingleView, setIsSingleView] = useState({single : false , postNo : 0});

    const [rowMax, setRowMax] = useState(16)
    const [pageNo, setPageNo] = useState(1);
    const setPageState = (childState) =>{
        setPageNo(childState);
    }

    const location = useLocation();
    const [query, setQuery] = useState({});
    //select로 검색 시
    const dataSelectAction = (e) =>{
        setQuery(prevQuery => ({
            ...prevQuery,
            [e.target.id]: e.target.value
        }));
    }

    const searchRef = useRef();
    //검색 버튼으로 검색 시
    const dataSearchAction = (e) =>{
        const a = document.querySelector('select[id=searchReview]')
        setQuery(prevQuery => ({
            ...prevQuery,
            target: a.value,
            text:searchRef.current.value,
        }));
    }

    // //게시판 리스트 조회
    const [board, setBoard] = useState([]);
    const [totalCnt, setTotalCnt] = useState(0);

    const getList  = async ()=>{
        await api.reviewList(query, pageNo, rowMax).then((res)=> {
            setTotalCnt(res.totalCount);
            setBoard(res.lists);
        });
    }

    //View 에서 isSingleView 때문에 두번 랜더링 되는 문제 있음.
    useEffect( () => {
        const list = async () => {
            await getList();
        }
        list();
    }, [isEditable, isSingleView, pageNo, rowMax, query]);

    //
    // //사이드바
    // useEffect(() => {
    //     const list = async ()=> {
    //         await getList().then(()=>{
    //             setIsSingleView({single: false,postNo: 0})
    //             setIsEditable({editable : false, type : 0})
    //         })
    //     }
    //     list();
    // }, [location.search]);
    //
    // //메인페이지 -> 보호 게시글 클릭 시
    // useEffect(() => {
    //     if(location.state?.postNo){
    //         getView(location.state.postNo).then(()=>{
    //             setIsSingleView({single : true , postNo : location.state.postNo})
    //         });
    //     }
    // }, [location.state]);
    //
    const setEditState = (childState) =>{
        setIsEditable(childState);
    }

    const [post, setPost] = useState([]);
    const getView = async (postNo)=>{
        await api.reviewVcnt(postNo);
        const res = await api.reviewView(postNo);

        if (res.length === 0) {
            alert("존재하지 않는 게시글입니다");
            setPost([]);
        } else {
            console.log("post res : ", res);
            setPost(res[0]);
        }
    }

    const view = async (e)=>{
        e.stopPropagation();
        const postNo = e.currentTarget.dataset.postNo;
        await getView(postNo).then(()=>{
            setIsSingleView({single : true , postNo : postNo})
        });
    }
    //
    const write = ()=>{
        setPost([]);
        setIsEditable({"editable" : true, "type" : 1});
    }
    //
    // const update = async (e,postNo) =>{
    //     e.stopPropagation();
    //     await getView(postNo).then(()=>{
    //         setIsEditable({"editable": true, "type": 2});
    //     })
    // }
    //
    // const remove = (e,postNo) =>{
    //     e.stopPropagation();
    //     if(window.confirm('정말로 해당 게시글을 삭제하시겠습니까?')){
    //         api.remove(postNo).then( async (res)=>{
    //             if(res.status === 500 || res.status === 404 ){
    //                 alert(res.data);
    //             }else{
    //                 alert("삭제가 완료되었습니다.")
    //                 await getList().then(setIsSingleView({single : false , postNo : 0}));
    //             }
    //         })
    //     }
    // }
    //
    const undo = ()=>{
        setPost([]);
        setIsSingleView({single : false, postNo : 0});
    }
    
    //댓글 기능 추가해야함

    return (
        <>
            {(isEditable.editable) ?
                <Write post={post} isEditable={isEditable} changeEditable={setEditState}
                       getView={getView} getList={getList}/> :
                <>
                    {(isSingleView.single) ?
                        <View
                            isAdmin={isAdmin}
                            post={post}
                            // remove={remove}
                            undo={undo}
                            setEditState = {setEditState}
                        /> :
                        <>
                            <List
                                totalCnt={totalCnt}
                                pageNo={pageNo}
                                board={board}
                                dataSelectAction={dataSelectAction}
                                dataSearchAction={dataSearchAction}
                                view={view}
                                write={write}
                                // update={update}
                                // remove={remove}
                                isAdmin={isAdmin}
                                ref={searchRef}
                            />

                            <div className="board__paging">
                                {totalCnt > 0 &&
                                    <Paging pageNo={pageNo} changePage={setPageState} totalRows={totalCnt} rowMax={rowMax}></Paging>
                                }
                            </div>
                        </>
            }
                </>
            }
        </>
    )
}
export default Review;