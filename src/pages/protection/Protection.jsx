import React, {useEffect, useState} from "react";
import "../../css/Main.css"
import Write from "./Write.jsx";
import Paging from "../../component/common/Paging.jsx";
import api from "../../api/Protection.jsx";
import View from "./View.jsx";
import List from "./List.jsx";
import {useLocation} from "react-router-dom";

function Protection() {
    const isAdmin = true;

    //type 0 : view, type 1 : write, type 2 : update
    const [isEditable, setIsEditable] = useState({editable : false, type : 0});
    const [isSingleView, setIsSingleView] = useState({single : false , postNo : 0});

    //0이면 갤러리형, 1이면 리스트형 보기
    const [rowMax, setRowMax] = useState(16)
    const [pageNo, setPageNo] = useState(1);
    const setPageState = (childState) =>{
        setPageNo(childState);
    }

    const location = useLocation();
    const [query, setQuery] = useState({});
    const dataSelectAction = (e) =>{
        setQuery(prevQuery => ({
            ...prevQuery,
            [e.target.id]: e.target.value
        }));
    }


    //게시판 리스트 조회
    const [board, setBoard] = useState([]);
    const [totalCnt, setTotalCnt] = useState();

    const getList  = async ()=>{
        await api.list(location.search, query, pageNo, rowMax).then((res)=> {
            setTotalCnt(res.totalCount);
            setBoard(res.lists);
        });
    }

    useEffect( () => {
        const list = async () => {
            await getList();
        }
        list();
    }, [pageNo, rowMax, query]);

    //사이드바
    useEffect(() => {
        const list = async ()=> {
            await getList().then(()=>{
                setIsSingleView({single: false,postNo: 0})
                setIsEditable({editable : false, type : 0})
            })
        }
        list();
    }, [location.search]);

    //메인페이지 -> 보호 게시글 클릭 시
    useEffect(() => {
        if(location.state?.postNo){
            getView(location.state.postNo).then(()=>{
                setIsSingleView({single : true , postNo : location.state.postNo})
            });
        }
    }, [location.state]);



    const setEditState = (childState) =>{
        setIsEditable(childState);
    }

    const setViewState = (childState)=>{
        setIsSingleView(childState);
    }


    const [post, setPost] = useState([]);
    const getView = async (postNo)=>{
        await api.vcnt(postNo);
        const res = await api.view(postNo);

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

    const write = ()=>{
        setPost([]);
        setIsEditable({"editable" : true, "type" : 1});
    }

    const update = async (e,postNo) =>{
        e.stopPropagation();
        await getView(postNo).then(()=>{
            setIsEditable({"editable": true, "type": 2});
        })
    }

    const remove = (e,postNo) =>{
        e.stopPropagation();
        if(window.confirm('정말로 해당 게시글을 삭제하시겠습니까?')){
            api.remove(postNo).then( async (res)=>{
                if(res.status === 500 || res.status === 404 ){
                    alert(res.data);
                }else{
                    alert("삭제가 완료되었습니다.")
                    await getList().then(setIsSingleView({single : false , postNo : 0}));
                }
            })
        }
    }

    const undo = ()=>{
        setPost([]);
        setIsSingleView({single : false, postNo : 0});
    }


    const dataCntAction = (e)=>{
        setRowMax(e.target.value);
        if(e.target.value*pageNo >totalCnt) setPageNo(1);
    }

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
                            remove={remove}
                            undo={undo}
                            setEditState = {setEditState}
                        /> :
                        <>
                            <List
                                totalCnt={totalCnt}
                                pageNo={pageNo}
                                board={board}
                                dataSelectAction={dataSelectAction}
                                dataCntAction={dataCntAction}
                                view={view}
                                write={write}
                                update={update}
                                remove={remove}
                                isAdmin={isAdmin}
                            />

                            <div className="board__paging">
                                {totalCnt > 0 &&
                                    <Paging pageNo={pageNo} changePage={setPageState} totalRows={totalCnt} rowMax={rowMax}></Paging>
                                }
                            </div>
                        </>}
                </>
            }
        </>
    )
}

export default Protection;