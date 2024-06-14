import AnmView from "./AnmView.jsx";
import React, {useState} from "react";
import Filter from "../../component/Filter.jsx";

const List = ({ totalCnt, pageNo, board, dataSelectAction, dataCntAction, view, write, update, remove, isAdmin, setViewState, setEditState})=>{
    //0이면 갤러리형, 1이면 리스트형 보기
    const [viewSt, setViewSt] = useState(0);

    return (
        <>
            <div className="filter__content">
                <div className="filter__box">
                    <Filter id="region" selected={0} onChange={dataSelectAction} />
                    <Filter id="st" selected={0} onChange={dataSelectAction} />
                    <Filter id="sex" selected={0} onChange={dataSelectAction} />
                    <Filter id="neutering" selected={0} onChange={dataSelectAction} />
                    <Filter id="chip" selected={0} onChange={dataSelectAction} />
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
                        <button type="button" className="filter__item__btn" onClick={remove}>
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
                <AnmView
                    viewSt={viewSt}
                    board={board}
                    view={view}
                    update={update}
                    remove={remove}
                    isAdmin={isAdmin}/>
            </div>
        </>
    )
}
export default List;