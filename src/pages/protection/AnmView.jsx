import React, {useState} from "react";
import "../../css/Main.css"
import Protection from "../../api/Protection.jsx";
import Paging from "../../component/common/Paging.jsx";

function AnmView(props) {
    console.log("props", props);
    const [post, setPost] = useState([])

    const getView = (postNo)=>{
        Protection.vcnt(postNo).then((res) =>{
                console.log(res);
            }
        )
        Protection.view(postNo).then((res)=> {
            if(res.length === 0){
                alert("존재하지 않는 게시글입니다")
            }else{
                setPost(res);
            }
        })
    }
    const view =(e)=>{
        const ntcNo = e.currentTarget.dataset.ntcNo;
        getView(ntcNo);
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

    const sexConverter = (stSub)=>{
        switch (stSub){
            case '1': return '개';
            case '2': return '고양이';
            case '3': return '기타';
            default : return '';
        }
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
                        <div className="gallery__item" key={idx}>
                            <article className="gallery__box">
                                <div className="gallery__img__box">
                                    <img className="gallery__img" src="" alt="asdf"/>
                                </div>
                                <h1 className="gallery__title">{stSubConverter(data.stSub)}</h1>
                                <div className="gallery__info">
                                    <span className="gallery__info__text">{sexConverter(data.spc)} / {data.region} </span><br/>
                                    <span className="gallery__info__text">{data.sex === 'm'? '수컷' : '암컷'} / {data.weight}kg / {data.age}살 추정</span>
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