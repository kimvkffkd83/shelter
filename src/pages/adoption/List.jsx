import React, {forwardRef} from "react";
import Filter from "../../component/Filter.jsx";

const List = forwardRef(({ totalCnt, pageNo, board, dataSelectAction, dataSearchAction, view, write, update, remove, isAdmin}, ref)=>{
    return (
        <>
            <div className="filter__content">
                <div className="filter__box">
                    <Filter id="reviewType" selected={0} onChange={dataSelectAction} />
                    <Filter id="searchReview" selected={0}/>
                    <div className="filter__item">
                        <input type="text" className="filter__input" ref={ref}/>
                        <button type="button" className="filter__item__btn" onClick={dataSearchAction}>
                            <span className="material-symbols-outlined">search</span>
                        </button>
                    </div>
                </div>
                <div className="filter__box">
                    <div className="filter__item">
                        <span>전체 : <strong>{totalCnt}</strong> / 현재 페이지 : <strong>{pageNo}</strong></span>
                    </div>
                </div>
                <div className="filter__box">
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
                <>
                    <ul className="table__board">
                        <li className="table__header">
                            {/*{select &&*/}
                            {/*    <div className="table__header__text w10"><span*/}
                            {/*        className="material-symbols-outlined">check</span></div>*/}
                            {/*}*/}
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
                                    data-post-no={post.no}>
                                    {/*{select &&*/}
                                    {/*    <input className="table__content__text w10" type="checkbox"*/}
                                    {/*           onClick={event => event.stopPropagation()} name='select'/>*/}
                                    {/*}*/}
                                    <div className="table__content__text w10">{index + ((pageNo - 1) * 10) + 1}</div>
                                    <div
                                        className="table__content__text w50 tl text-overflow">{post.title}</div>
                                    <div className="table__content__text w10">{post.id}</div>
                                    <div className="table__content__text w20">{post.regDate}</div>
                                    <div className="table__content__text w10">{post.vcnt}</div>
                                </li>
                            ))
                        }
                    </ul>
                </>
            </div>
        </>
    )
})
export default List;