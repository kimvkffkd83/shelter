import React, {useRef, useState} from "react";
import board from "../../api/Board.jsx";
import protection from "../../api/Protection.jsx";
import photoUpload from "../../api/photoUpload.jsx";

const Write = (props)=>{
    console.log("props:",props);
    // console.log("props:",props.post.at(0).title);

    const radioRef = useRef();
    const spcSubRef = useRef();
    const ageRef = useRef();
    const weightRef = useRef();
    const reagionRef = useRef();
    const reagionSubRef = useRef();
    const stSubSubRef = useRef();
    const cDateRef = useRef();
    const sDateRef = useRef();
    const memoRef = useRef();

    const titleRef = useRef()
    const contentsRef = useRef()
    const date = new Date();
    const newDate = date.getFullYear()+(date.getMonth() + 1).toString().padStart(2, '0')+date.getDate().toString().padStart(2, '0');
    const newDateStr = date.getFullYear()+"-"+(date.getMonth() + 1).toString().padStart(2, '0')+"-"+date.getDate().toString().padStart(2, '0');


    const chkTextLength = (ref,length)=> {
        if (ref && ref.current && ref.current.value.length > 50) {
            ref.current.value = ref.current.value.slice(0,length-1)
        }
    }
    const validatation = ()=>{
        let pass = false
        let reason = '';

        if(titleRef.current.value ===''){
            reason = '제목을 작성해주세요.'
            titleRef.current.focus();
        }else if(contentsRef.current.value ===''){
            reason = '내용을 작성해주세요.'
            contentsRef.current.focus();
        }else{
            pass = true;
        }
        return {pass : pass, reason : reason};
    }


    const [imgFile, setImageFile] = useState();
    const [imgUrl, setImageUrl] = useState("");

    const selectImage = (e)=>{
        const file = e.target.files[0];
        if(file){
            setImageFile(file);
            const url = URL.createObjectURL(file)
            setImageUrl(url);
        }
    }

    const action = ()=>{
        console.log("?")
        // const check = validatation();
        // if(!check.pass){
        //     alert(check.reason)
        //     return;
        // }


        // if(window.confirm(props.data.type === 1 ? '등록하시겠습니까?' : '수정하시겠습니까?')){
            const selectedValues = {};
            const inputs = radioRef.current.querySelectorAll('input[type="radio"]:checked');
            inputs.forEach(input => {
                selectedValues[input.name] = input.value;
            });

            console.log("imgFile",imgFile);
            //이미지 등록
            const formData = new FormData();
            formData.append('img', imgFile);
            photoUpload.upload('protection',formData).then((res) => {
                try {
                    return res.data.url
                } catch (error) {
                    alert("이미지 업로드 중 에러가 발생했습니다. 관리자에게 문의하세요.")
                }
            }).then((res)=>{
                console.log("res",res);
                const data = {
                    "USER_NO" : 1,
                    "USER_ID" : 'se6651',
                    "POST_ST" : 2,
                    "POST_ST_SUB" : stSubSubRef.current.value,
                    "POST_MEMO" : memoRef.current.value,
                    "POST_PHOTO_URL" : res,
                    "POST_REG_YMD" : props.data.type === 1 ? newDate : props.post.at(0).date.replaceAll('-',''),
                    "POST_UDT_YMD" : newDate,
                    "ANM_RSC_YMD" : '20240608',
                    "ANM_STAY_YMD" : '20240618',
                    "ANM_SPC" : selectedValues.spc,
                    "ANM_SPC_SUB" : spcSubRef.current.value,
                    "ANM_REGION" : reagionRef.current.value,
                    "ANM_REGION_SUB" : reagionSubRef.current.value,
                    "ANM_SEX": selectedValues.sex,
                    "ANM_NEUTERING_ST": selectedValues.neu,
                    'ANM_CHIP_ST':selectedValues.chip,
                    "ANM_WEIGHT":weightRef.current.value,
                    "ANM_AGE":ageRef.current.value,
                    "ANM_AGE_SUPPOSE":1,

                    // "NTC_CONTENTS" : contentsRef.current.value,
                    // "NTC_REG_DATE" : props.data.type === 1 ? newDate : props.post.at(0).date.replaceAll('-',''),
                    // "NTC_UDT_DATE" : newDate,
                }
                console.log('data:', data);
                console.log('radioRef:', radioRef.current);

                console.log('selectedValues:', selectedValues);
                if(props.data.type === 1){
                    protection.write(data).then((res)=>{
                        console.log(res);
                        if(res.status === 500){
                            alert(res.data);
                        }else {
                            alert('게시글이 등록되었습니다');
                            props.changeEditable({"editable": false, "type": 0});
                        }
                    })
                }else if(props.data.type === 2){
                    data.NTC_NO = props.post.at(0)?.ntcNo;
                    delete data.NTC_REG_DATE;
                    board.update(props.post.at(0)?.ntcNo, data).then((res)=>{
                        console.log(res);
                        if(res.status === 500 || res.status === 404 ){
                            alert(res.data);
                        }else{
                            alert('게시글이 수정되었습니다');
                            props.post.at(0).ntcNo = data.NTC_NO;
                            props.post.at(0).userId = data.USER_ID;
                            props.post.at(0).title = data.NTC_TITLE;
                            props.post.at(0).contents = data.NTC_CONTENTS;
                            props.post.at(0).date = newDateStr;
                            props.changeEditable({"editable" : false, "type" : 0});
                        }
                    })
                }
            })
        // }
    }

    const undo = ()=>{
        if(window.confirm('지금까지 수정된 내용은 저장되지 않습니다. 작성을 취소하시겠습니까?')){
            props.changeEditable({"editable" : false, "type" : 0})
        }
    }

    return (
        <>
            <div className="box__content__gallery">
                <div className="gallery__form-editable w40" ref={radioRef}>
                    <div className="gallery__form__title">필수 입력 정보</div>
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
                        <span className="post__item__title">세부종류</span>
                        <div className="post__item__contents">
                            <input id="spc_sub" className="post__item__input" type="text" ref={spcSubRef}/>
                        </div>
                    </div>
                    <div className="post__item">
                        <span className="post__item__title">성별</span>
                        <div className="post__item__contents">
                            <div className="radio__box">
                                <input id="sex_f" className="input__radio" name="sex" type="radio" value="f"
                                       defaultChecked/>
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
                    <div className="post__item">
                        <span className="post__item__title">중성화</span>
                        <div className="post__item__contents">
                            <div className="radio__box">
                                <input id="neu_y" className="input__radio" name="neu" type="radio" value="y"/>
                                <label className="post__item__label" htmlFor="neu_y">유</label>
                            </div>
                            <div className="radio__box">
                                <input id="neu_n" className="input__radio" name="neu" type="radio" value="n"/>
                                <label className="post__item__label" htmlFor="neu_n">무</label>
                            </div>
                            <div className="radio__box">
                                <input id="neu_u" className="input__radio" name="neu" type="radio" value="u"
                                       defaultChecked/>
                                <label className="post__item__label" htmlFor="neu_u">모름</label>
                            </div>
                        </div>
                    </div>
                    <div className="post__item">
                        <span className="post__item__title">내장칩</span>
                        <div className="post__item__contents">
                            <div className="radio__box">
                                <input id="chip_y" className="input__radio" name="chip" type="radio" value="y"/>
                                <label className="post__item__label" htmlFor="chip_y">유</label>
                            </div>
                            <div className="radio__box">
                                <input id="chip_n" className="input__radio" name="chip" type="radio" value="n"/>
                                <label className="post__item__label" htmlFor="chip_n">무</label>
                            </div>
                            <div className="radio__box">
                                <input id="chip_u" className="input__radio" name="chip" type="radio" value="u"
                                       defaultChecked/>
                                <label className="post__item__label" htmlFor="chip_u">모름</label>
                            </div>
                        </div>
                    </div>
                    <div className="post__item">
                        <span className="post__item__title">나이</span>
                        <div className="post__item__contents">
                            <input id="age" className="post__item__input w70" type="number" placeholder="추정 나이" step="1"
                                   min="1" max="50" ref={ageRef}/>
                            <div className="select__box">
                                <input id="age_suppose" className="post__item__checkbox" type="checkbox"/>
                                <label className="post__item__label" htmlFor="age_suppose">미상</label>
                            </div>
                        </div>
                    </div>
                    <div className="post__item">
                        <span className="post__item__title">체중(Kg)</span>
                        <div className="post__item__contents">
                            <input id="weight" className="post__item__input" type="number" placeholder="소수점 아래 2자리까지 입력 가능"
                                   step="0.1" min="0.1" max="50" ref={weightRef}/>
                        </div>
                    </div>
                    <div className="post__item">
                        <span className="post__item__title">구조 지역</span>
                        <div className="post__item__contents">
                            <select id="region" className="post__item__select" ref={reagionRef}>
                                <option value="0">전체</option>
                                <option value="1">광산구</option>
                                <option value="2">남구</option>
                                <option value="3">동구</option>
                                <option value="4">북구</option>
                                <option value="5">서구</option>
                            </select>
                        </div>
                    </div>
                    <div className="post__item">
                        <span className="post__item__title">지역상세</span>
                        <div className="post__item__contents">
                            <input id="region_sub" className="post__item__input" type="text"
                                   placeholder="OO동/발견된 상세 위치" ref={reagionSubRef}/>
                        </div>
                    </div>
                    <div className="post__item">
                        <span className="post__item__title">공고상태</span>
                        <div className="post__item__contents">
                            <select id="st_sub" className="post__item__select" ref={stSubSubRef}>
                                <option value="">전체</option>
                                <option value="a">공고중</option>
                                <option value="b">입양가능</option>
                                <option value="c">입양예정</option>
                                <option value="d">귀가예정</option>
                                <option value="e">임시보호</option>
                                <option value="f">입양완료</option>
                                <option value="g">귀가</option>
                                <option value="h">기증</option>
                                <option value="i">안락사</option>
                                <option value="j">자연사</option>
                            </select>
                        </div>
                    </div>
                    <div className="post__item">
                        <span className="post__item__title">구조일</span>
                        <div className="post__item__contents">
                            <input id="cDate" className="post__item__date" type="date" ref={cDateRef}/>
                        </div>
                    </div>
                    <div className="post__item">
                        <span className="post__item__title">유지일</span>
                        <div className="post__item__contents">
                            <input id="sDate" className="post__item__date w70" type="date" ref={sDateRef} readOnly/>
                            <div>
                                <span>[+10일]</span>
                            </div>
                        </div>
                    </div>
                    <div className="post__item">
                        <span className="post__item__title">비고(기관용)</span>
                        <div className="post__item__contents">
                            <input id="memo" className="post__item__input" type="text" ref={memoRef}/>
                        </div>
                    </div>
                </div>
                <div className="gallery__form-editable w60">
                    <div className="form__photo">
                        <div className="gallery__form__title">대표사진 업로드(필수)</div>
                        <div className="post__item">
                            <div className="post__item__image__box">
                                <input id="memo" className="post__item__file" type="file" accept="image/*" onChange={selectImage}/>
                                {
                                    imgUrl &&
                                    <div className="post__item__preview">
                                        <img className="post__item__preview_img" src={imgUrl} alt="선택된 파일"/>
                                    </div>
                                }
                            </div>
                        </div>
                    </div>
                    <div className="nReqInfo">
                    <div className="gallery__form__title">선택 입력 정보</div>
                    </div>
                </div>
            </div>
            <div className="box__btns">
                <button className="btn__default" onClick={action}>{props.data.type === 1 ? '등록' : '수정'}</button>
                <button className="btn__default" onClick={undo}>취소</button>
            </div>
        </>
    )
}
export default Write;