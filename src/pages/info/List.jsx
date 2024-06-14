import React from "react";

const List = ({ totalCnt, pageNo, board, view, write, selectPosts, hidePosts, deletePosts, isAdmin, select })=>{
    return (
        <>
            <div className="table__info">
                <span>전체 : <strong>{totalCnt}</strong> / 현재 페이지 : <strong>{pageNo}</strong></span>
                {isAdmin &&
                    <div className="box__adm__btns">
                        {!select &&
                            <button className="btn__adm__icon btn__adm__write" onClick={write}><span
                                className="material-symbols-outlined">edit_square</span></button>
                        }
                        {select &&
                            <>
                                <button className="btn__adm__icon btn__adm__hide" onClick={hidePosts}>
                                    <span className="material-symbols-outlined">visibility_off</span>
                                </button>
                                <button className="btn__adm__icon btn__adm__delete" onClick={deletePosts}>
                                    <span className="material-symbols-outlined">delete</span>
                                </button>
                            </>
                        }
                        <button className="btn__adm__icon btn__adm__checkbox" onClick={selectPosts}>
                            {
                                select ?
                                    <span className="material-symbols-outlined">select</span> :
                                    <span className="material-symbols-outlined">select_check_box</span>
                            }
                        </button>
                    </div>
                }
            </div>
            <ul className="table__board">
                <li className="table__header">
                    {select &&
                        <div className="table__header__text w10"><span
                            className="material-symbols-outlined">check</span></div>
                    }
                    <div className="table__header__text w10">번호</div>
                    <div className="table__header__text w50">제목</div>
                    <div className="table__header__text w10">작성자</div>
                    <div className="table__header__text w20">등록일</div>
                    <div className="table__header__text w10">조회</div>
                </li>
                {totalCnt === 0 ?
                    <div className="table__content__no-data">
                        <span>게시글이 없습니다.</span>
                    </div>
                    :
                    board.map((post, index) => (
                        <li key={index}
                            className={`table__content ${post.display === 'n' ? 'table__content__hide' : ''}`}
                            onClick={view}
                            data-ntc-no={post.ntcNo}>
                            {select &&
                                <input className="table__content__text w10" type="checkbox"
                                       onClick={event => event.stopPropagation()} name='select'/>
                            }
                            <div className="table__content__text w10">{index + ((pageNo - 1) * 10) + 1}</div>
                            <div
                                className="table__content__text w50 tl text-overflow">{post.title}</div>
                            <div className="table__content__text w10">{post.userId}</div>
                            <div className="table__content__text w20">{post.date}</div>
                            <div className="table__content__text w10">{post.vcnt}</div>
                        </li>
                    ))
                }
            </ul>
        </>
    )
}
export default List;