import React, {useEffect, useState} from "react";
import "../../css/Main.css"
import AnmView from "./AnmView.jsx";
import {useLocation} from "react-router-dom";
import Protection from "../../api/Protection.jsx";
import Paging from "../../component/common/Paging.jsx";
import dp from "dompurify";
import Region from "../../jsons/Region.json"
import Write from "./Write.jsx";

function Filter() {
    const isAdmin = true;
    const location = useLocation();
    //0이면 갤러리형, 1이면 리스트형 보기
    const [viewSt, setViewSt] = useState(0);
    //게시판 정보들
    const [datas, setDatas] = useState([]);
    const [totalCnt, setTotalCnt] = useState();

    const [rowMax, setRowMax] = useState(16)
    const [pageNo, setPageNo] = useState(1);
    const setPageState = (childState) =>{
        setPageNo(childState);
    }

    const [query, setQuery] = useState({});

    const dataSelectAction = (e) =>{
        setQuery(prevQuery => ({
            ...prevQuery,
            [e.target.id]: e.target.value
        }));
    }

    useEffect(() => {
        Protection.list(location.search, query, pageNo, rowMax).then((res)=> {
            setTotalCnt(res.totalCount);
            setDatas(res.lists);
        });
    }, [location, pageNo, rowMax, query]);

    const dataCntAction = (e)=>{
        setRowMax(e.target.value);
        if(e.target.value*pageNo >totalCnt) setPageNo(1);
    }

    const [isVisible, setIsVisible] = useState({visible : false , postNo : 0})
    const setViewState = (childState)=>{
        setIsVisible(childState);
    }

    const [isEditable, setIsEditable] = useState(
        {"editable" : false, "type" : 0}
    );

    const [post, setPost] = useState([]);

    useEffect(()=>{
        if(isVisible.postNo !== 0){
            Protection.vcnt(isVisible.postNo).then((res) =>{
                    console.log(res);
                }
            )
            Protection.view(isVisible.postNo).then((res)=> {
                if(res.length === 0){
                    alert("존재하지 않는 게시글입니다")
                }else{
                    console.log(res)
                    setPost(res);
                }
            })
        }
    },[isEditable, isVisible])

    const undo = ()=>{
        setIsVisible({visible : false, postNo : 0});
    }

    const stSubConverter = (stSub)=>{
        switch (stSub){
            case 'a': return '공고중';
            case 'b': return '입양가능';
            case 'c': return '입양예정';
            case 'd': return '귀가예정';
            case 'e': return '임시보호';
            case 'f': return '입양완료';
            case 'g': return '귀가';
            case 'h': return '기증';
            case 'i': return '자연사';
            case 'j': return '안락사';
            default : return '';
        }
    }

    const spcConverter = (stSub)=>{
        switch (stSub){
            case '1': return '개';
            case '2': return '고양이';
            case '3': return '기타';
            default : return '';
        }
    }

    const regionConverter = (region) =>{
        return Region.gu.map((g,index)=>{
            if(g.no === Number(region)) return g.addrKR;
        })
    }

    const write = ()=>{
        setPost([]);
        setIsEditable({"editable" : true, "type" : 1});
    }

    const setEditState = (childState) =>{
        setIsEditable(childState);
    }

    return (
        <>
            {(isEditable.editable) ?
                    <Write data={isEditable} post={post} changeEditable={setEditState}/> :
                    <>{
                        (isVisible.visible) ?
                        <>
                            <div className="box__post">
                                <div className="post__header">
                                <span className="post__title w80">
                                    <strong>[{stSubConverter(post[0]?.stSub)}] </strong>
                                    {spcConverter(post[0]?.spc)} / {regionConverter(post[0]?.region)} / {post[0]?.sex === "m" || post[0]?.sex === "M" ? "수컷" : "암컷"}
                                </span>
                                    <span className="post__user-id w10 tc">{post[0]?.userId}</span>
                                    <span className="post__date w10 tc">{post[0]?.rDate}</span>
                                </div>
                                <div className="post__content clearfix" dangerouslySetInnerHTML={{ __html: dp.sanitize(post[0]?.postMemo) }}>
                                </div>
                            </div>
                            <div className="box__btns">
                                <button className="btn__default" onClick={undo}>목록으로</button>
                            </div>
                            {/*{isUdmin &&*/}
                            {/*    <div className="box__adm">*/}
                            {/*        <div className="box__adm__btns">*/}
                            {/*            <button className="btn__adm" onClick={update}>수정</button>*/}
                            {/*            <button className="btn__adm" onClick={remove}>삭제</button>*/}
                            {/*        </div>*/}
                            {/*    </div>*/}
                            {/*}*/}
                        </> :
                        <>
                            <div className="filter__content">
                                <div className="filter__box">
                                    {/*<div className="filter__item">*/}
                                    {/*    <label htmlFor="spc" className="filter__label">종류:</label>*/}
                                    {/*    <select id="spc" className="filter__select" onChange={dataSelectAction}>*/}
                                    {/*        <option value="">전체</option>*/}
                                    {/*        <option value="1">개</option>*/}
                                    {/*        <option value="2">고양이</option>*/}
                                    {/*        <option value="3">기타</option>*/}
                                    {/*    </select>*/}
                                    {/*</div>*/}
                                    <div className="filter__item">
                                        <label htmlFor="region" className="filter__label">지역:</label>
                                        <select id="region" className="filter__select" onChange={dataSelectAction}>
                                            <option value="0">전체</option>
                                            <option value="1">동구</option>
                                            <option value="2">서구</option>
                                            <option value="3">남구</option>
                                            <option value="4">북구</option>
                                            <option value="5">광산구</option>
                                        </select>
                                    </div>
                                    <div className="filter__item">
                                        <label htmlFor="st" className="filter__label">상태:</label>
                                        <select id="st" className="filter__select" onChange={dataSelectAction}>
                                            <option value="">전체</option>
                                            <option value="a">공고중</option>
                                            <option value="b">입양가능</option>
                                            <option value="c">입양예정</option>
                                            <option value="d">귀가예정</option>
                                            <option value="e">임시보호</option>
                                            <option value="f">입양완료</option>
                                            <option value="g">귀가</option>
                                            <option value="h">기증</option>
                                        </select>
                                    </div>
                                    <div className="filter__item">
                                        <label htmlFor="sex" className="filter__label">성별:</label>
                                        <select id="sex" className="filter__select" onChange={dataSelectAction}>
                                            <option value="">전체</option>
                                            <option value="m">수컷</option>
                                            <option value="f">암컷</option>
                                        </select>
                                    </div>
                                    <div className="filter__item">
                                        <label htmlFor="neutering" className="filter__label">중성화:</label>
                                        <select id="neutering" className="filter__select" onChange={dataSelectAction}>
                                            <option value="">전체</option>
                                            <option value="y">유</option>
                                            <option value="n">무</option>
                                        </select>
                                    </div>
                                    <div className="filter__item">
                                        <label htmlFor="chip" className="filter__label">내장칩:</label>
                                        <select id="chip" className="filter__select" onChange={dataSelectAction}>
                                            <option value="">전체</option>
                                            <option value="y">유</option>
                                            <option value="n">무</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="filter__box">
                                    <div className="filter__item">
                                        <label htmlFor="cnt" className="filter__label">보기:</label>
                                        <select id="cnt" className="filter__select" onChange={dataCntAction}>
                                            <option value={viewSt === 0 ? 16 : 10}>{viewSt === 0 ? "16개" : "10개"}</option>
                                            <option value={viewSt === 0 ? 24 : 20}>{viewSt === 0 ? "24개" : "20개"}</option>
                                            <option value={viewSt === 0 ? 32 : 30}>{viewSt === 0 ? "32개" : "30개"}</option>
                                        </select>
                                    </div>
                                    <div className="filter__item">
                                        <button type="button" className="filter__item__btn">
                                    <span
                                        className="material-symbols-outlined">{viewSt === 0 ? "gallery_thumbnail" : "lists"}</span>
                                        </button>
                                    </div>
                                </div>
                                <div className="filter__box">
                                    <div className="filter__item">
                                        <label htmlFor="date" className="filter__label">날짜:</label>
                                        <input type="date" className="filter__input"/>
                                        ~
                                        <input type="date" className="filter__input"/>
                                    </div>
                                    <div className="filter__item">
                                        <input type="text" className="filter__input"/>
                                        <button type="button" className="filter__item__btn">
                                            <span className="material-symbols-outlined">search</span>
                                        </button>
                                    </div>
                                </div>
                                <div className="filter__box">
                                    <span>전체 : <strong>{totalCnt}</strong> / 현재 페이지 : <strong>{pageNo}</strong></span>
                                    {isAdmin &&
                                        <div className="box__adm">
                                            <div className="box__adm__btns">
                                                <button className="btn__adm__icon btn__adm__write" onClick={write}>
                                                    <span className="material-symbols-outlined">edit_square</span>
                                                </button>
                                            </div>
                                        </div>
                                    }
                                </div>
                            </div>

                            <div className="gallery__content">
                                <AnmView viewSt={viewSt} changeVisible={setViewState} datas={datas}/>
                            </div>

                            <div className="board__paging">
                                {totalCnt > 0 &&
                                    <Paging pageNo={pageNo} changePage={setPageState} totalRows={totalCnt}
                                            rowMax={rowMax}></Paging>
                                }
                            </div>
                        </>}
                    </>
            }
        </>
    )
}

export default Filter;