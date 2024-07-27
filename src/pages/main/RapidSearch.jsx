import React, {useRef} from "react";
import vdt from "../../js/validation.js";

const RapidSearch = ()=>{
    const radioRef = useRef();
    const reagionRef = useRef();

    return(
        <div className="main__rapid__container">
            <div className="main__rapid__title">빠른 조건 검색</div>
            <hr className="main__rapid__line"/>
            <div className="main__rapid__contents">
                <div className="rapid__form__contents" ref={radioRef}>
                    <div className="rapid__item">
                        <span className="rapid__item__title">종</span>
                        <div className="rapid__item__contents">
                            <div className="radio__box">
                                <input id="spc_dog" className="input__radio" name="spc" type="radio" value="1" checked/>
                                <label className="post__item__label" htmlFor="spc_dog">개</label>
                            </div>
                            <div className="radio__box">
                                <input id="spc_cat" className="input__radio" name="spc" type="radio" value="2"/>
                                <label className="post__item__label" htmlFor="spc_cat">고양이</label>
                            </div>
                            <div className="radio__box">
                                <input id="spc_etc" className="input__radio" name="spc" type="radio" value="3"/>
                                <label className="post__item__label" htmlFor="spc_etc">기타</label>
                            </div>
                        </div>
                    </div>
                    <div className="rapid__item">
                        <span className="rapid__item__title">기간</span>
                        <div className="rapid__item__contents">
                            <input type="date" className="rapid__item__date"/> ~
                        </div>
                    </div>
                    <div className="rapid__item">
                        <span className="rapid__item__title"></span>
                        <div className="rapid__item__contents">
                            <input type="date" className="rapid__item__date"/>
                        </div>
                    </div>
                    <div className="rapid__item">
                        <span className="rapid__item__title">지역</span>
                        <div className="rapid__item__contents">
                            <select id="region" className="post__item__select" ref={reagionRef}>
                                <option value="">전체</option>
                                <option value="1">광산구</option>
                                <option value="2">남구</option>
                                <option value="3">동구</option>
                                <option value="4">북구</option>
                                <option value="5">서구</option>
                            </select>
                        </div>
                    </div>
                    <div className="rapid__item">
                        <span className="rapid__item__title">성별</span>
                        <div className="rapid__item__contents">
                            <div className="radio__box">
                                <input id="sex_f" className="input__radio" name="sex" type="radio" value="f" checked/>
                                <label className="post__item__label" htmlFor="sex_f">암</label>
                            </div>
                            <div className="radio__box">
                                <input id="sex_m" className="input__radio" name="sex" type="radio" value="m"/>
                                <label className="post__item__label" htmlFor="sex_m">수</label>
                            </div>
                            <div className="radio__box">
                                <input id="sex_u" className="input__radio" name="sex" type="radio" value="u"/>
                                <label className="post__item__label" htmlFor="sex_u">모름</label>
                            </div>
                        </div>
                    </div>
                    <div className="rapid__item">
                        <span className="rapid__item__title">중성화</span>
                        <div className="rapid__item__contents">
                            <div className="radio__box">
                                <input id="ntr_y" className="input__radio" name="ntr" type="radio" value="y" checked/>
                                <label className="post__item__label" htmlFor="ntr_y">유</label>
                            </div>
                            <div className="radio__box">
                                <input id="ntr_n" className="input__radio" name="ntr" type="radio" value="n"/>
                                <label className="post__item__label" htmlFor="ntr_n">무</label>
                            </div>
                            <div className="radio__box">
                                <input id="ntr_u" className="input__radio" name="ntr" type="radio" value="u"/>
                                <label className="post__item__label" htmlFor="ntr_u">모름</label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default RapidSearch;