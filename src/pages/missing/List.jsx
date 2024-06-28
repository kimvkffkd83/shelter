import AnmView from "./AnmView.jsx";
import React, {forwardRef} from "react";
import Filter from "../../component/Filter.jsx";

const List = forwardRef(({ totalCnt, pageNo, board, dataSelectAction, dataCntAction, dataWhenAction, dataSearchAction, view, write, update, remove, isAdmin}, ref)=>{
    return (
        <>
            <div className="filter__content">
                <div className="filter__box">
                    <Filter id="region" selected={0} onChange={dataSelectAction} />
                    <Filter id="spc" selected={0} onChange={dataSelectAction} />
                    <Filter id="search" selected="name"/>
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
                        <label htmlFor="cnt" className="filter__label">/ 보기:</label>
                        <select id="cnt" className="filter__select" onChange={dataCntAction}>
                            <option value={16}>16개</option>
                            <option value={24}>24개</option>
                            <option value={32}>32개</option>
                        </select>
                    </div>
                </div>
                <div className="filter__box">
                    <div className="filter__item">
                        <label htmlFor="date" className="filter__label">날짜:</label>
                        <input id="preDate" type="date" className="filter__input" onChange={dataWhenAction}/>
                        ~
                        <input id="aftDate" type="date" className="filter__input" onChange={dataWhenAction}/>
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
                <AnmView
                    board={board}
                    view={view}
                    update={update}
                    remove={remove}
                    isAdmin={isAdmin}/>
            </div>
        </>
    )
})
export default List;