import React, {useState} from "react";
import "../../css/Main.css"
import Region from "../../jsons/Region.json"
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
                                        <button className="btn__adm__icon btn__adm__modify"><span className="material-symbols-outlined">edit_note</span></button>
                                        <button className="btn__adm__icon btn__adm__delete"><span className="material-symbols-outlined">delete</span></button>
                                    </div>
                                }
                                <div className="gallery__img__box">
                                    <img className="gallery__img" src="" alt="asdf"/>
                                </div>
                                <h1 className="gallery__title">{stSubConverter(data.stSub)}</h1>
                                <div className="gallery__info">
                                    <span
                                        className="gallery__info__text">{spcConverter(data.spc)} / {regionConverter(data.region)} </span><br/>
                                    <span
                                        className="gallery__info__text">{data.sex === 'M' || data.sex === 'm' ? '수컷' : '암컷'} / {data.weight}kg / {data.age}살 추정</span>
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