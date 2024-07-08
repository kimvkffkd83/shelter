import cvt from "../../js/converter.js";
import React from "react";

const View = ({isAdmin,post,remove,undo,setEditState})=>{
    console.log("post",post);

    return(
        <>
            <div className="box__post">
                <div className="post__header">
                            <span className="post__title w80">
                                <strong>[{cvt.stSubPrtcCvt(post?.stSub)}] </strong>
                                <strong>{post?.serialNo} </strong>
                                {cvt.spcCvt(post?.spc)} / {cvt.regionCvt(post?.region)} / {cvt.sexCvt(post?.sex)}
                            </span>
                    <span className="post__user-id w10 tc">{post?.userId}</span>
                    <span className="post__date w20 tc">{post?.rDate}</span>
                    {isAdmin &&
                        <div className="box__adm__btns">
                            <button className="btn__adm__icon btn__adm__modify" onClick={(e) => setEditState({"editable": true, "type": 2})}>
                                <span className="material-symbols-outlined">edit_note</span>
                            </button>
                            <button className="btn__adm__icon btn__adm__delete" onClick={(e) => remove(e, post.postNo)}>
                                <span className="material-symbols-outlined">delete</span>
                            </button>
                        </div>
                    }
                </div>
                <div className="post__table">
                    <table className="table__default w90">
                        <tbody className="table__default__body">
                        <tr>
                            <td className="table_item_title">종</td>
                            <td className="table_item_content">{cvt.spcCvt(post?.spc)}</td>
                            <td className="table_item_title">세부 종</td>
                            <td className="table_item_content">{post?.spcSub}</td>
                        </tr>
                        <tr>
                            <td className="table_item_title">이름</td>
                            <td className="table_item_content">{post?.name?.length > 0 ? post.name : '-'}</td>
                            <td className="table_item_title">성별</td>
                            <td className="table_item_content">{cvt.sexCvt(post?.sex)}</td>
                        </tr>
                        <tr>
                            <td className="table_item_title">중성화</td>
                            <td className="table_item_content">{cvt.ntrCvt(post?.ntr)}</td>
                            <td className="table_item_title">내장칩</td>
                            <td className="table_item_content">{cvt.chipCvt(post?.chip)}</td>
                        </tr>
                        <tr>
                            <td className="table_item_title">체중</td>
                            <td className="table_item_content">{post?.weight}Kg</td>
                            <td className="table_item_title">생년</td>
                            <td className="table_item_content">{post?.bYear}년 {post?.bMonth ? post?.bMonth + '월' : ''}(추정)</td>
                        </tr>
                        <tr>
                            <td className="table_item_title">구조 지역</td>
                            <td className="table_item_content">{cvt.regionCvt(post?.region)}</td>
                            <td className="table_item_title">지역 상세</td>
                            <td className="table_item_content">{post?.regionSub}</td>
                        </tr>
                        <tr>
                            <td className="table_item_title">등록일</td>
                            <td className="table_item_content">{post?.rDate}</td>
                            <td className="table_item_title">구조일</td>
                            <td className="table_item_content">{post?.cDate}</td>
                        </tr>
                        <tr>
                            <td className="table_item_title">공고 상태</td>
                            <td className="table_item_content">{cvt.stSubPrtcCvt(post?.stSub)}</td>
                            <td className="table_item_title">공고기간</td>
                            <td className="table_item_content">{post?.sDate}</td>
                        </tr>
                        <tr>
                            <td className="table_item_title">색</td>
                            <td className="table_item_content">{cvt.colorCvt(post?.color)}</td>
                            <td className="table_item_title">조회수</td>
                            <td className="table_item_content">{post?.vcnt}</td>
                        </tr>
                        <tr>
                            <td className="table_item_title">일련번호</td>
                            <td className="table_item_content">{post?.serialNo}</td>
                        </tr>
                        <tr>
                            <td className="table_item_title">특징</td>
                            <td className="table_item_content">{post?.feature}</td>
                        </tr>
                        {isAdmin &&
                            <>
                                <tr>
                                    <td className="table_item_title">비고(기관용)</td>
                                    <td className="table_item_content">{post?.memo}</td>
                                </tr>
                            </>
                        }
                        </tbody>
                    </table>
                </div>
                <div className="post__image">
                    {
                        post?.photoUrl &&
                        post?.photoUrl.split(',').map((url, idx) => {
                            return (
                                <img className="post__image-single" key={idx}
                                     src={url}
                                     onClick={(e) => {
                                         e.preventDefault();
                                         window.open(url);
                                     }}
                                     alt="보호사진"/>
                            )
                        })
                    }
                </div>
            </div>
            <div className="box__btns">
                <button className="btn__default" onClick={undo}>목록으로</button>
            </div>
            {/*{isAdmin &&*/}
            {/*    <div className="box__adm">*/}
            {/*        <div className="box__adm__btns">*/}
            {/*            <button className="btn__adm" onClick={update}>수정</button>*/}
            {/*            <button className="btn__adm" onClick={remove}>삭제</button>*/}
            {/*        </div>*/}
            {/*    </div>*/}
            {/*}*/}
        </>
    )

}
export default View;
