import React, {useEffect, useState} from "react";
import {useLocation} from "react-router-dom";
import Main from "../../api/Main.jsx";
import cvt from "../../js/converter.js"

function MainSlide(){
    const location = useLocation();
    const [list, setList] = useState();
    useEffect(() => {
        Main.slideList()
            .then((res) => {
                setList(res)
            });
    }, [location]);

    return (
        <>
            {
                list?.map((item,index)=> {
                    const urlArray = item.photoUrl?.split(',');
                    return (
                        <article className="slide" key={index}>
                            <div className="slide__box">
                                <img className="slide__img" src={urlArray[item.photoThumb??0]} alt="사진오류"/>
                            </div>
                            <h1 className="slide__title">{cvt.stSubCvt(item.stSub)}</h1>
                            <div className="slide__info">
                                <span
                                    className="slide__info__text">{cvt.spcCvt(item.spc)} / {cvt.regionCvt(item.region)} </span><br/>
                                <span
                                    className="slide__info__text">{cvt.sexCvt(item.sex)} / {item.weight}kg / {item.bYear}년생(추정)</span>
                            </div>
                        </article>
                    )
                })
            }
            {/* 필요한 케이스*/}
            {/* 리스트가 0개일 경우 */}
            {/* 리스트가 10개 이하일 경우*/}

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