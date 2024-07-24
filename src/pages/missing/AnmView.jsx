import React, {useState} from "react";
import "../../css/Main.css"
import cvt from "../../js/converter.js"
function AnmView({ board, view, update,remove, isAdmin }) {
    const galleryView = (idx, data,urlArray)=>{
        return (
            <div key={idx} className="gallery__item" onClick={view}
                 data-post-no={data.postNo}>
                <article className="gallery__box">
                    {isAdmin &&
                        <div className="adm__gallery__btns">
                            <button className="btn__adm__icon btn__adm__modify"
                                    onClick={(e) => update(e, data.postNo)}>
                                <span className="material-symbols-outlined">edit_note</span>
                            </button>
                            <button className="btn__adm__icon btn__adm__delete"
                                    onClick={(e) => remove(e, data.postNo)}>
                                <span className="material-symbols-outlined">delete</span>
                            </button>
                        </div>
                    }
                    <div className="gallery__img__box">
                        <img className="gallery__img" src={urlArray ? urlArray[data.photoThumb ?? 0] : ''} alt="사진오류"/>
                    </div>
                    <h3 className="gallery__title">[{cvt.stSubPrtcCvt(data.stSub)}] {data.serialNo}</h3><br/>
                    <div className="gallery__info">
                        <span className="gallery__info__text">
                            {cvt.spcCvt(data.spc)} / {cvt.regionCvt(data.region)} / {cvt.sexCvt(data.sex)} </span><br/>
                        <span className="gallery__info__text">
                            {cvt.weightStrCvt(data.weight)} / {cvt.ageStrCvt(data.bYear)}
                        </span>
                    </div>
                </article>
            </div>
        )
    }
    return (
        <>
            {
                board?.length === 0 ?
                    <div className="table__content__no-data">
                        <span>게시글이 없습니다.</span>
                    </div> :
                    board?.map((data, idx) => {
                        const urlArray = data.photoUrl?.split(',');
                        return (
                            galleryView(idx, data, urlArray)
                        )
                    })
            }
        </>
    )
}

export default AnmView;