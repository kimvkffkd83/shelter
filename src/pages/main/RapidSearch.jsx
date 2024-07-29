import React, {useEffect, useRef, useState} from "react";
import vdt from "../../js/validation.js";
import Modal from "../../component/Modal.jsx";
import {Link, useNavigate} from "react-router-dom";
import cvt from "../../js/converter.js";
import main from "../../api/Main.jsx";
import ath from "../../js/authority.js";

const RapidSearch = ()=>{
    const date = new Date();
    const newDate = cvt.dateYmdCvt(date);
    const newDateStr = cvt.dateYmdDashCvt(date);

    const radioRef = useRef();
    const reagionRef = useRef();
    const preDateRef = useRef();
    const aftDateRef = useRef();

    // const [query, setQuery] = useState({});

    // //날짜로 검색
    // const dataWhenAction = (e) =>{
    //     setQuery(prevQuery => ({
    //         ...prevQuery,
    //         [e.target.id]: e.target.value.replaceAll('-','')
    //     }));
    // }

    const [showModal, setShowModal] = useState(false)
    const search = ()=>{
        getList();
        setShowModal(true);
    }
    const closeAction = ()=>{
        setShowModal(false)
    }

    useEffect(() => {
        if(showModal){
            // window.scroll()
        }
    }, [showModal]);

    const [totalCnt, setTotalCnt] = useState(0)
    const [list, setList] = useState([])
    const getList = () =>{
        const selectedValues = {};

        const inputs = radioRef.current.querySelectorAll('input[type="radio"]:checked');
        inputs.forEach(input => {
            selectedValues[input.name] = input.value;
        });
        const data = {
            "spc" : selectedValues.spc,
            "region" : reagionRef.current.value,
            "sex": selectedValues.sex,
            "ntr": selectedValues.ntr,
            "preDate":preDateRef.current.value.replaceAll("-",''),
            "aftDate":aftDateRef.current.value.replaceAll("-",'')
        }

        main.rapidList(data).then((res)=> {
            setTotalCnt(res.totalCount)
            setList(res.lists.slice(0,6));
        })
    }

    const movePage = useNavigate();
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
                                <input id="spc_dog" className="input__radio" name="spc" type="radio" value="1" defaultChecked/>
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
                            <input id="preDate" type="date" className="rapid__item__date"
                                   defaultValue={newDateStr} ref={preDateRef}
                                   // onChange={dataWhenAction}
                            /> ~
                        </div>

                    </div>
                    <div className="rapid__item">
                        <span className="rapid__item__title"></span>
                        <div className="rapid__item__contents">
                            <input id="aftDate" type="date" className="rapid__item__date"
                                   defaultValue={newDateStr} ref={aftDateRef}
                                   // onChange={dataWhenAction}
                            />
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
                                <input id="sex_f" className="input__radio" name="sex" type="radio" value="f" defaultChecked/>
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
                                <input id="ntr_y" className="input__radio" name="ntr" type="radio" value="y" defaultChecked/>
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
                    <div className="rapid__item rapid__item-no-title">
                       <button className="btn__user btn__user__positive"
                               onClick={search}>검색</button>
                    </div>
                    {
                        showModal &&
                        <Modal size='small' title='조건 검색 결과' closeAction={closeAction} btnAction={()=>movePage('/protection')} btnText={'더 많은 결과 보기'}>
                            {
                                <div className="rapid__res__item">
                                    <div className="res__summary">
                                        <span>현재 <strong className="res__summary-emphasis">{totalCnt}건</strong>의 검색 결과가 있습니다.</span>
                                        <br/>
                                        <span>상위 <strong className="res__summary-emphasis">6개</strong>까지의 게시글만 표시됩니다.</span>
                                    </div>
                                    <div className="res__contents">
                                        {
                                            totalCnt === 0 ?
                                                <></> :
                                                <>
                                                {
                                                    list.map((item, idx) =>(
                                                        <Link key={idx} className="res__contents__item" to={'protection'} state={{"index":1,"postNo":item.postNo}}>
                                                            <img className="res__contents__img"
                                                                 src={item.photoUrl} alt={item.serialNo}/>
                                                            <strong className="res__contents__text">{item.serialNo}</strong>
                                                        </Link>
                                                    ))
                                                }
                                                </>
                                        }
                                    </div>
                                </div>
                            }
                        </Modal>
                    }
                </div>
            </div>
        </div>
    )
}

export default RapidSearch;