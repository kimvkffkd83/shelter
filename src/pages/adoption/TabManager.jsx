import React, {useEffect, useRef, useState} from "react";
import {ReactSortable} from "react-sortablejs";
import Adopt from "../../api/Adopt.jsx";
import vdt from "../../js/validation.js";
import Editor from "../../component/Editor.jsx";
import dp from "dompurify";
import cvt from "../../js/converter.js";
const TabManager = ({setEditState})=>{
    const [list, setList] = useState([]);
    const [tempList, setTempList] = useState([]);
    const [reset, setReset] = useState(false);

    //탭 순서 변경에 관여
    const [isListEditable, setIsListEditable] = useState(false);

    //탭 내용 변경에 관여
    //type 0 : view, type 1 : write, type 2 : update
    const [isPostEditable, setIsPostEditable] = useState({editable : false, type : 0});
    const [post, setPost] = useState([]);

    const titleRef = useRef();
    const contentsRef = useRef();

    const date = new Date();
    const newDate = cvt.dateYmdCvt(date);

    useEffect(() => {
        Adopt.tabList().then((res)=> {
            setList(res);
            setTempList(res);
        });
    }, [reset]);

    const getView = (no)=>{
        Adopt.tabView(no).then((res)=>{
            setPost(res[0]);
        })
    }

    const showStaticList = ()=>{
        return(
            <>
                {
                    list.map((item,idx) => (
                        <div key={idx} className="tab__block__static"
                             onClick={()=>getView(item.no)}>{item.title}</div>
                    ))
                }
            </>
        )
    }

    const showDynamicList = () => {
        return(
            <ReactSortable list={list} setList={setList}>
                {
                    list.map((item,idx) => (
                        <div key={idx} className="tab__block__dynimic">
                            <span className="material-symbols-outlined">drag_pan</span>{item.title}</div>
                    ))
                }
            </ReactSortable>
        )
    };

    const changeListEditable = () => {
        if(JSON.stringify(list)!==JSON.stringify(tempList)){
            if(window.confirm('현재 상태가 저장되지 않습니다. 정말 취소하시겠습니까?')){
                setReset((prevState) => !prevState);
            }
        }
        setIsListEditable((prevState) => !prevState);
    }

    const orderSave = ()=>{
        const filtered = list.map(item => ({
            no: item.no,
            title: item.title,
            tabOrder: item.tabOrder
        }));

        Adopt.tabList().then((res)=> {
            //같으면 저장할 필요 없음
            if(JSON.stringify(res)===JSON.stringify(filtered)){
                setIsListEditable((prevState) => !prevState);
            }else{
                const change = [];
                res.forEach((item, idx) => {
                    if (item.no !== filtered[idx].no) {
                        change.push({ orderNo: idx + 1, no: filtered[idx].no });
                    }
                });

                change.forEach(async (c) =>{
                    await Adopt.tabListUpdate(c.no, c.orderNo)
                })
                setReset((prevState) => !prevState);
                setIsListEditable((prevState) => !prevState);
            }
        });
    }
    const undo = ()=>{
        //컨펌하고 뒤로가기 할 것
        setIsPostEditable({"editable" : false, "type" : 0});
    }

    const write = () =>{
        //리스트 편집 안 되게 할 것

        setPost([])
        setIsPostEditable({"editable" : true, "type" : 1});
    }
    const modify = () =>{
        //리스트 편집 안 되게 할 것

        if(post.length === 0 || post.no === undefined){
            return;
        }else {
            setIsPostEditable({"editable" : true, "type" : 2});
        }
    }

    const validatation = ()=>{
        let flag  = {pass : true, comment : ''};
        flag = vdt.chkInputIsEmpty(flag, titleRef,'제목을 작성해주세요.');
        flag = vdt.chkInputIsEmpty(flag, contentsRef,'내용을 작성해주세요.');
        return flag;
    }

    const save = ()=>{
        if(window.confirm('저장하시겠습니까?')){
            const check = validatation();
            if(!check.pass){
                alert(check.comment)
                return;
            }

            const data = {
                title : titleRef.current.value,
                contents : contentsRef.current.value,
                userNo : 1,
                userId : 'se6651',
                regDate : newDate,
                udtDate : newDate,
                orderNo : list.length+1
            }

            if(isPostEditable.type === 1){
                //등록
                Adopt.tabWrite(data).then((res)=>{
                    setReset((prevState) => !prevState);
                    setIsPostEditable({"editable" : false, "type" : 0});
                })
            }else if(isPostEditable.type === 2){
                //수정
                delete data.regDate;
                delete data.orderNo;
                Adopt.tabUpdate(post.no,data).then((res)=>{
                    getView(post.no);
                    setReset((prevState) => !prevState);
                    setIsPostEditable({"editable" : false, "type" : 0});
                })
            }
        }
    }

    const remove = ()=>{
        if(post.length === 0 || post.no === undefined){
            return;
        }else{
            if(window.confirm("정말로 삭제하시겠습니까?")){
                Adopt.tabRemove(post.no).then((res)=>{
                    console.log(res)
                    setPost([]);
                    setReset((prevState) => !prevState);
                })
            }
        }
    }

    const goBack = () =>{
        if(window.confirm('저장하지 않은 내용은 반영되지 않습니다.\n이전 화면으로 돌아가시겠습니까?')){
            setEditState({"editable" : false, "type" : 0})
        }
    }

    return (
        <div className="tab__manage__box">
            <h3>탭 순서 변경</h3>
            <div className="tab__manage__list">
                <div className="box__adm__btns">
                    <button className="btn__adm__icon btn__adm__write" onClick={changeListEditable}>
                        {
                            isListEditable ?
                                <span className="material-symbols-outlined">undo</span> :
                                <span className="material-symbols-outlined">swap_vert</span>
                        }
                    </button>
                    {
                        isListEditable &&
                        <button className="btn__adm__icon btn__adm__write" onClick={orderSave}>
                            <span className="material-symbols-outlined">save</span>
                        </button>
                    }
                </div>
                <div id="target" className="tab__manage__content">
                    {
                        isListEditable ?
                            showDynamicList() :
                            showStaticList()
                    }
                </div>
            </div>
            <br />
            <h3>탭 미리보기</h3>
            <div className="tab__manage__view">
                <div className="box__adm__btns">
                    {
                        isPostEditable.editable ?
                            <>
                                <button className="btn__adm__icon btn__adm__write" onClick={undo}>
                                    <span className="material-symbols-outlined">undo</span>
                                </button>
                                <button className="btn__adm__icon btn__adm__write" onClick={save}>
                                    <span className="material-symbols-outlined">save</span>
                                </button>
                            </> :
                            <>
                                <button className="btn__adm__icon btn__adm__write" onClick={write}>
                                    <span className="material-symbols-outlined">variable_add</span>
                                </button>
                                <button className="btn__adm__icon btn__adm__write" onClick={modify}>
                                    <span className="material-symbols-outlined">edit</span>
                                </button>
                                <button className="btn__adm__icon btn__adm__write" onClick={remove}>
                                    <span className="material-symbols-outlined">delete</span>
                                </button>
                            </>
                    }
                </div>
                {
                    isPostEditable.editable ?
                        <>
                            <div className="post__item">
                                <span className="post__item__title">탭 명</span>
                                <div className="post__item__contents">
                                    <input className="post__item__input" ref={titleRef} defaultValue={post?.title}
                                           onKeyUp={() => vdt.chkInputLength(titleRef, 50)}
                                           onKeyDown={() => vdt.chkInputLength(titleRef, 50)}
                                           onBlur={() => vdt.chkInputLength(titleRef, 50)}
                                    />
                                </div>
                            </div>
                            <div className="post__item">
                                <span className="post__item__title">작성자</span>
                                <div className="post__item__contents">{post.userId ?? 'se6651'}</div>
                            </div>
                            <div className="post__item">
                                <span className="post__item__title">{isPostEditable.type === 1 ? '등록일' : '수정일'}</span>
                                <div className="post__item__contents">{post.udtDate ?? newDate}</div>
                            </div>
                            <div className="post__item">
                                <span className="post__item__title">내용</span>
                                <div className="post__item__contents">
                                    <Editor ref={contentsRef} route={'adopt'} defaultValue={post.contents}/>
                                </div>
                            </div>
                        </>
                        :
                        <>
                            <div className="post__item">
                                <span className="post__item__title">탭 명</span>
                                <div className="post__item__contents">{post.title}</div>
                            </div>
                            <div className="post__item">
                                <span className="post__item__title">작성자</span>
                                <div className="post__item__contents">{post.userId}</div>
                            </div>
                            <div className="post__item">
                                <span className="post__item__title">수정일</span>
                                <div className="post__item__contents">{post.udtDate}</div>
                            </div>
                            <div className="post__item">
                                <span className="post__item__title">내용</span>
                                <div className="post__item__contents">
                                    <div className="custom_editor clearfix"
                                         dangerouslySetInnerHTML={{__html: dp.sanitize(post.contents)}}/>
                                </div>
                            </div>
                        </>
                }
            </div>
            <div className="tab__manage__btns">
                <button className="btn__adm" onClick={goBack}> 돌아가기</button>
            </div>
        </div>
    )

}
export default TabManager;