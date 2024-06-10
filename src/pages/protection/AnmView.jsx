import React, {useState} from "react";
import "../../css/Main.css"
import cvt from "../../js/converter.js"
function AnmView(props) {
    const isAdmin = true;
    const [isVisible, setIsVisible] = useState({visible : false , ntcNo : 0})

    const getView = (postNo)=>{
        props.changeVisible({visible : true , postNo : postNo});
    }
    const view =(e)=>{
        const postNo = e.currentTarget.dataset.postNo;
        console.log("postNo",postNo);
        getView(postNo);
    }

    const update = () =>{

    }


    return (
        <>
            {
                //갤러리형
                props.viewSt === 0 &&
                props.datas?.length === 0 ?
                    <div className="table__content__no-data">
                        <span>게시글이 없습니다.</span>
                    </div> :
                    props.datas?.map((data,idx) => (
                        <div key={idx} className="gallery__item" onClick={view}
                             data-post-no={data.postNo} >
                            <article className="gallery__box">
                                {isAdmin &&
                                    <div className="adm__gallery__btns">
                                        <button className="btn__adm__icon btn__adm__modify" onClick={update}>
                                            <span className="material-symbols-outlined">edit_note</span>
                                        </button>
                                        <button className="btn__adm__icon btn__adm__delete">
                                            <span className="material-symbols-outlined">delete</span>
                                        </button>
                                    </div>
                                }
                                <div className="gallery__img__box">
                                    <img className="gallery__img" src={data.photoUrl} alt="사진오류"/>
                                </div>
                                <h1 className="gallery__title">{cvt.stSubCvt(data.stSub)}</h1>
                                <div className="gallery__info">
                                    <span
                                        className="gallery__info__text">{cvt.spcCvt(data.spc)} / {cvt.regionCvt(data.region)} </span><br/>
                                    <span
                                        className="gallery__info__text">{cvt.sexCvt(data.sex)} / {data.weight}kg / {data.age}살 추정</span>
                                </div>
                            </article>
                        </div>
                    ))
            }
            {
                //리스트형
                // props.viewSt === 1 &&
                // <div className="gallery__slider">
                //     <article className="gallery">
                //         <div className="gallery__box">
                //             <img className="gallery__img" src="" alt="asdf"/>
                //         </div>
                //         <h1 className="gallery__title">공고중</h1>
                //         <div className="gallery__info">
                //             <span className="gallery__info__text">강아지 / 광산구 신창동</span><br/>
                //             <span className="gallery__info__text">수컷 / 1.8kg / 1살(추정)</span>
                //         </div>
                //     </article>
                // </div>
            }
        </>
    )
}

export default AnmView;