import React, {useEffect, useState} from "react";
import {useLocation} from "react-router-dom";
import Main from "../../api/Main.jsx";
import Region from "../../jsons/Region.json";

function MainSlide(){
    const location = useLocation();
    const [list, setList] = useState();
    useEffect(() => {
        Main.slideList()
            .then((res) => {
                setList(res)
            });
    }, [location]);

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

    const sexConverter = (sex) =>{
        switch (sex) {
            case 'm':
            case 'M' : return "수컷"; break;
            case 'f':
            case 'F' : return "암컷"; break;
            case 'u':
            case 'U' : return "미상"; break;
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
                list?.map((item,index)=> (
                    <article className="slide" key={index}>
                        <div className="slide__box">
                            <img className="slide__img" src={item.photoUrl} alt="사진오류"/>
                        </div>
                        <h1 className="slide__title">{stSubConverter(item.stSub)}</h1>
                        <div className="slide__info">
                            <span className="slide__info__text">{spcConverter(item.spc)} / {regionConverter(item.region)} </span><br/>
                            <span className="slide__info__text">{sexConverter(item.sex)} / {item.weight}kg / {item.age}살 추정</span>
                        </div>
                    </article>
                ))
            }
            {/*<article className="slide">*/}
            {/*    <div className="slide__box">*/}
            {/*        <img className="slide__img" src="" alt="asdf"/>*/}
            {/*    </div>*/}
            {/*    <h1 className="slide__title">공고중</h1>*/}
            {/*    <div className="slide__info">*/}
            {/*        <span className="slide__info__text">강아지 / 광산구 신창동</span><br/>*/}
            {/*        <span className="slide__info__text">수컷 / 1.8kg / 1살(추정)</span>*/}
            {/*    </div>*/}
            {/*</article>*/}
            {/*<article className="slide">*/}
            {/*    <div className="slide__box">*/}
            {/*        <img className="slide__img" src="" alt="asdf"/>*/}
            {/*    </div>*/}
            {/*    <h1 className="slide__title">공고중</h1>*/}
            {/*    <div className="slide__info">*/}
            {/*        <span className="slide__info__text">강아지 / 광산구 신창동</span><br/>*/}
            {/*        <span className="slide__info__text">수컷 / 1.8kg / 1살(추정)</span>*/}
            {/*    </div>*/}
            {/*</article>*/}
            {/*<article className="slide">*/}
            {/*    <div className="slide__box">*/}
            {/*        <img className="slide__img" src="" alt="asdf"/>*/}
            {/*    </div>*/}
            {/*    <h1 className="slide__title">임시보호</h1>*/}
            {/*    <div className="slide__info">*/}
            {/*        <span className="slide__info__text">강아지 / 광산구 신창동</span><br/>*/}
            {/*        <span className="slide__info__text">수컷 / 1.8kg / 1살(추정)</span>*/}
            {/*    </div>*/}
            {/*</article>*/}
            {/*<article className="slide">*/}
            {/*    <div className="slide__box">*/}
            {/*        <img className="slide__img" src="" alt="asdf"/>*/}
            {/*    </div>*/}
            {/*    <h1 className="slide__title">공고중</h1>*/}
            {/*    <div className="slide__info">*/}
            {/*        <span className="slide__info__text">강아지 / 광산구 신창동</span><br/>*/}
            {/*        <span className="slide__info__text">수컷 / 1.8kg / 1살(추정)</span>*/}
            {/*    </div>*/}
            {/*</article>*/}
            {/*<article className="slide">*/}
            {/*    <div className="slide__box">*/}
            {/*        <img className="slide__img" src="" alt="asdf"/>*/}
            {/*    </div>*/}
            {/*    <h1 className="slide__title">공고중</h1>*/}
            {/*    <div className="slide__info">*/}
            {/*        <span className="slide__info__text">강아지 / 광산구 신창동</span><br/>*/}
            {/*        <span className="slide__info__text">수컷 / 1.8kg / 1살(추정)</span>*/}
            {/*    </div>*/}
            {/*</article>*/}
            {/*<article className="slide">*/}
            {/*    <div className="slide__box">*/}
            {/*        <img className="slide__img" src="" alt="asdf"/>*/}
            {/*    </div>*/}
            {/*    <h1 className="slide__title">공고중</h1>*/}
            {/*    <div className="slide__info">*/}
            {/*        <span className="slide__info__text">강아지 / 광산구 신창동</span><br/>*/}
            {/*        <span className="slide__info__text">수컷 / 1.8kg / 1살(추정)</span>*/}
            {/*    </div>*/}
            {/*</article>*/}
            {/*<article className="slide">*/}
            {/*    <div className="slide__box">*/}
            {/*        <img className="slide__img" src="" alt="asdf"/>*/}
            {/*    </div>*/}
            {/*    <h1 className="slide__title">공고중</h1>*/}
            {/*    <div className="slide__info">*/}
            {/*        <span className="slide__info__text">강아지 / 광산구 신창동</span><br/>*/}
            {/*        <span className="slide__info__text">수컷 / 1.8kg / 1살(추정)</span>*/}
            {/*    </div>*/}
            {/*</article>*/}
            {/*<article className="slide">*/}
            {/*    <div className="slide__box">*/}
            {/*        <img className="slide__img" src="" alt="asdf"/>*/}
            {/*    </div>*/}
            {/*    <h1 className="slide__title">임시보호</h1>*/}
            {/*    <div className="slide__info">*/}
            {/*        <span className="slide__info__text">강아지 / 광산구 신창동</span><br/>*/}
            {/*        <span className="slide__info__text">수컷 / 1.8kg / 1살(추정)</span>*/}
            {/*    </div>*/}
            {/*</article>*/}
            {/*<article className="slide">*/}
            {/*    <div className="slide__box">*/}
            {/*        <img className="slide__img" src="" alt="asdf"/>*/}
            {/*    </div>*/}
            {/*    <h1 className="slide__title">공고중</h1>*/}
            {/*    <div className="slide__info">*/}
            {/*        <span className="slide__info__text">강아지 / 광산구 신창동</span><br/>*/}
            {/*        <span className="slide__info__text">수컷 / 1.8kg / 1살(추정)</span>*/}
            {/*    </div>*/}
            {/*</article>*/}
            {/*<article className="slide">*/}
            {/*    <div className="slide__box">*/}
            {/*        <img className="slide__img" src="" alt="asdf"/>*/}
            {/*    </div>*/}
            {/*    <h1 className="slide__title">공고중</h1>*/}
            {/*    <div className="slide__info">*/}
            {/*        <span className="slide__info__text">강아지 / 광산구 신창동</span><br/>*/}
            {/*        <span className="slide__info__text">수컷 / 1.8kg / 1살(추정)</span>*/}
            {/*    </div>*/}
            {/*</article>*/}
        </>
    )
}


export default MainSlide;