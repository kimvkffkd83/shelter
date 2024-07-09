import React, {useEffect, useRef, useState} from "react";
import vdt from "../../js/validation.js";
import Editor from "../../component/Editor.jsx";
import cvt from "../../js/converter.js";
import adopt from "../../api/Adopt.jsx";

const Application = ()=> {
    const isAdmin = true;

    const radioRef = useRef();
    const titleRef = useRef();
    const contentsRef = useRef();
    const serialRef = useRef();
    const nameRef = useRef();
    const phoneRef = useRef();
    const mailRef = useRef();
    const date = new Date();
    const newDate = date.getFullYear()+(date.getMonth() + 1).toString().padStart(2, '0')+date.getDate().toString().padStart(2, '0');
    const newDateStr = date.getFullYear()+"-"+(date.getMonth() + 1).toString().padStart(2, '0')+"-"+date.getDate().toString().padStart(2, '0');


    const chkWhenBlur = (func, ref, id)=>{
        if(!func(ref.current.value)){
            document.querySelector(`div[id=${id}]`).style.display = 'flex';
            ref.current.focus();
        }else{
            document.querySelector(`div[id=${id}]`).style.display = 'none';
        }
    }

    const validatation = ()=>{
        let flag  = {pass : true, comment : ''};
        flag = vdt.chkInputIsEmpty(flag, nameRef,'성명을 작성해주세요.');
        flag = vdt.chkInputIsEmpty(flag, phoneRef,'연락처를 작성해주세요.');
        flag = vdt.chkInputIsEmpty(flag, mailRef,'이메일를 작성해주세요.');
        flag = vdt.chkInputIsEmpty(flag, titleRef,'제목을 작성해주세요.');
        flag = vdt.chkInputIsEmpty(flag, contentsRef,'내용을 작성해주세요.');
        return flag;
    }
    const action = ()=> {
        const chkEmpty = validatation();
        if (!chkEmpty.pass) {
            alert(chkEmpty.comment)
            return;
        }

        //첨부파일 등록 확인해야함

        let chkP = true;
        const errs = document.getElementsByClassName('post__item-error')
        for (let err of errs) {
            if(err.style.display === 'flex') chkP = false;
        }
        if(!chkP) {
            alert('부적절한 값이 입력된 항목이 있습니다.\n수정 후 등록해주세요.')
            return;
        }

        if(window.confirm('신청하시겠습니까?')){

        };

        const selectedValues = {};
        const inputs = radioRef.current.querySelectorAll('input[type="radio"]:checked');
        inputs.forEach(input => {
            selectedValues[input.name] = input.value;
        });

        const data = {
            "USER_NO" : 1,
            "USER_ID" : 'se6651',
            "USER_NM" : nameRef.current.value,
            "USER_CALL" : phoneRef.current.value.replaceAll('-',''),
            "USER_MAIL" : mailRef.current.value,
            "APP_TITLE" : titleRef.current.value,
            "APP_CONTENTS" : contentsRef.current.value,
            "APP_REG_YMD" : newDate,
            "APP_UDT_YMD" : newDate,
            "APP_ATTACH" : 'ASDF',
            "APP_TYPE" : selectedValues.type,
            "ANM_SPC" : selectedValues.spc,
            "ANM_SERIAL_NO" : serialRef.current.value,
        }

        console.log(data);
        adopt.write(data).then((res)=>{
            console.log(res);
        })
    }

    const [list, setList] = useState([]);

    useEffect(()=>{
        adopt.list(1).then((res) =>{
            console.log(res);
            setList(res);
        });
    },[])

    return (
        <>
            <div>
                <div className="box__post">
                    <div className="flex_container">
                        <div className="w50">
                            <h4> 희망자 인적사항</h4>
                            <div className="post__item">
                                <span className="post__item__title">성명</span>
                                <div className="post__item__contents">
                                    <input className="post__item__input" ref={nameRef}
                                           onBlur={() => chkWhenBlur(vdt.chkKoreanName, nameRef, 'nameErr')}
                                    />
                                </div>
                            </div>
                            <div id="nameErr" className="post__item post__item-error">
                                <span className="post__item__title"></span>
                                <div className="post__item__contents">
                                    <span>정확한 성명을 입력하세요.</span>
                                </div>
                            </div>
                            <div className="post__item">
                                <span className="post__item__title">연락처</span>
                                <div className="post__item__contents">
                                    <input className="post__item__input" ref={phoneRef}
                                           onKeyUp={() => phoneRef.current.value = cvt.phoneCvt(phoneRef.current.value)}
                                           onKeyDown={() => phoneRef.current.value = cvt.phoneCvt(phoneRef.current.value)}
                                           onBlur={() => chkWhenBlur(vdt.chkPhoneNumber, phoneRef, 'phoneErr')}
                                           placeholder="'-'를 제외한 숫자만 입력해주세요."
                                    />
                                </div>
                            </div>
                            <div id="phoneErr" className="post__item post__item-error">
                                <span className="post__item__title"></span>
                                <div className="post__item__contents">
                                    <span>정확한 연락처를 입력하세요.</span>
                                </div>
                            </div>
                            <div className="post__item">
                                <span className="post__item__title">이메일</span>
                                <div className="post__item__contents">
                                    <input className="post__item__input" ref={mailRef}
                                           onBlur={() => chkWhenBlur(vdt.chkMailAddress, mailRef, 'mailErr')}
                                           placeholder="example@email.com"
                                    />
                                </div>
                            </div>
                            <div id="mailErr" className="post__item post__item-error">
                                <span className="post__item__title"></span>
                                <div className="post__item__contents">
                                    <span>정확한 메일을 입력하세요.</span>
                                </div>
                            </div>
                        </div>
                        <div className="w50" ref={radioRef}>
                            <h4> 희망 동물 정보</h4>
                            <div className="post__item">
                                <span className="post__item__title">신청 유형</span>
                                <div className="post__item__contents">
                                    <div className="radio__box">
                                        <input id="type_adopt" className="input__radio" name="type" type="radio"
                                               value="a"
                                               defaultChecked/>
                                        <label className="post__item__label" htmlFor="type_adopt">입양</label>
                                    </div>
                                    <div className="radio__box">
                                        <input id="type_temp" className="input__radio" name="type" type="radio"
                                               value="b"/>
                                        <label className="post__item__label" htmlFor="type_temp">임시보호</label>
                                    </div>
                                </div>
                            </div>
                            <div className="post__item">
                                <span className="post__item__title">종</span>
                                <div className="post__item__contents">
                                    <div className="radio__box">
                                        <input id="spc_dog" className="input__radio" name="spc" type="radio" value="1"
                                               defaultChecked/>
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
                            <div className="post__item">
                                <span className="post__item__title">(선택)일련번호</span>
                                <div className="post__item__contents">
                                    <input className="post__item__input" ref={serialRef}
                                           onBlur={() => chkWhenBlur(vdt.chkSerialNoV2, serialRef, 'serialErr')}
                                           placeholder="ex)2024-0042 (하이픈(-)을 꼭 포함해주세요.)"
                                    />
                                </div>
                            </div>
                            <div id="serialErr" className="post__item post__item-error">
                                <span className="post__item__title"></span>
                                <div className="post__item__contents">
                                    <span>정확한 일련번호(하이픈(-) 포함)을 입력하세요.</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <br/>
                    <h4> 자유 기재 사항 </h4>
                    <div className="post__item">
                        <span className="post__item__title">제목</span>
                        <div className="post__item__contents">
                            <input className="post__item__input" ref={titleRef}
                                   onKeyUp={() => vdt.chkInputLength(titleRef, 50)}
                                   onKeyDown={() => vdt.chkInputLength(titleRef, 50)}
                                   onBlur={() => vdt.chkInputLength(titleRef, 50)}
                            />
                        </div>
                    </div>
                    <div className="post__item">
                        <span className="post__item__title">날짜</span>
                        <div className="post__item__contents">
                            <span className="post__item__text">{newDateStr}</span>
                        </div>
                    </div>
                    <div className="post__item">
                        <span className="post__item__title">신청서 첨부</span>
                        <div className="post__item__contents">
                            <input type="file"/>
                        </div>
                    </div>
                    <div className="post__item">
                        <span className="post__item__title">내용</span>
                        <div className="post__item__contents post__item__contents_editor">
                            <Editor ref={contentsRef} route={'notice'}/>
                        </div>
                    </div>
                    {/* 개인정보 처리 방침*/}
                    {/* 개인정보 처리 동의 체크박스*/}
                    <div className="box__btns">
                        <button className="btn__default" onClick={action}>등록</button>
                    </div>
                </div>
            </div>
            <h3>입양신청내역(0)</h3>
            <div>
                <ul className="table__board">
                    <li className="table__header">
                        {/*{select &&*/}
                        {/*    <div className="table__header__text w10"><span*/}
                        {/*        className="material-symbols-outlined">check</span></div>*/}
                        {/*}*/}
                        <div className="table__header__text w10">번호</div>
                        <div className="table__header__text w50">제목</div>
                        <div className="table__header__text w10">작성자</div>
                        <div className="table__header__text w20">등록일</div>
                        <div className="table__header__text w10">조회</div>
                    </li>
                    <>
                    {
                        list?.length === 0 ?
                            <div className="table__content__no-data">
                                <span>게시글이 없습니다.</span>
                            </div> :
                            list.map((post, index) => (
                                <li key={index}>
                                    {/*{select &&*/}
                                    {/*    <input className="table__content__text w10" type="checkbox"*/}
                                    {/*           onClick={event => event.stopPropagation()} name='select'/>*/}
                                    {/*}*/}
                                    {/*<div className="table__content__text w10">{index + ((pageNo - 1) * 10) + 1}</div>*/}
                                    {/*<div className="table__content__text w50 tl text-overflow">{post.title}</div>*/}
                                    {/*<div className="table__content__text w10">{post.userId}</div>*/}
                                    {/*<div className="table__content__text w20">{post.date}</div>*/}
                                    {/*<div className="table__content__text w10">{post.vcnt}</div>*/}
                                </li>
                            ))
                    }
                    </>
                </ul>
            </div>
        </>
)
}

export default Application;