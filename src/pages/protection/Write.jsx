import React, {useRef, useState} from "react";
import protection from "../../api/Protection.jsx";
import photoUpload from "../../api/photoUpload.jsx";
import vdt from "../../js/validation.js";
import cvt from "../../js/converter.js";
import ColorPicker from "../../component/ColorPicker.jsx";

const Write = ({isEditable,post,changeEditable})=>{
    console.log("post:",post);
    const maxFileCnt = 3;
    const maxFileSize = 10000000;

    const radioRef = useRef();
    const spcSubRef = useRef();
    const bYearRef = useRef();
    const bMonthRef = useRef();
    const ageSupposeRef = useRef();
    const weightRef = useRef();
    const reagionRef = useRef();
    const reagionSubRef = useRef();
    const stSubSubRef = useRef();
    const cDateRef = useRef();
    const sDateRef = useRef();
    const imgRef = useRef();
    const memoRef = useRef();
    const nameRef = useRef();
    const featureRef = useRef();

    const date = new Date();
    //[yyyymmdd]
    const newDate = date.getFullYear()+(date.getMonth() + 1).toString().padStart(2, '0')+date.getDate().toString().padStart(2, '0');
    //[yyyy-mm-dd]
    const newDateStr = date.getFullYear()+"-"+(date.getMonth() + 1).toString().padStart(2, '0')+"-"+date.getDate().toString().padStart(2, '0');


    const validatation = ()=>{
        let flag  = {pass : true, comment : ''};
        flag = vdt.chkInputIsEmpty(flag, spcSubRef,'세부 종을 작성해주세요.');
        if(document.querySelectorAll("input[id=age_suppose]:checked").length <= 0) {
            flag = vdt.chkInputIsEmpty(flag, bYearRef,'생년을 작성해주세요.');
        }
        flag = vdt.chkInputIsEmpty(flag, weightRef,'체중을 작성해주세요.');
        flag = vdt.chkSelectIsEmpty(flag, reagionRef,'구조 지역을 선택해주세요.');
        flag = vdt.chkInputIsEmpty(flag, reagionSubRef,'지역상세를 작성해주세요.');
        flag = vdt.chkSelectIsEmpty(flag, stSubSubRef,'공고상태를 선택해주세요.');
        flag = vdt.chkInputIsEmpty(flag, cDateRef,'구조일을 선택해주세요.');
        flag = vdt.chkInputIsEmpty(flag, imgRef,'대표사진을 등록해주세요.');
        return flag;
    }


    const [imgFile, setImageFile] = useState([]);
    const [imgUrl, setImageUrl] = useState([]);
    const [thumbnail, setThumbnail] = useState(0);

    const selectImage = (e)=>{
        setImageFile([]);
        setImageUrl([]);
        setThumbnail(0);

        const files = e.target.files;
        if(e.target.files.length > maxFileCnt){
            alert(`파일은 최대 ${maxFileCnt}개까지 선택할 수 있습니다.`);
            e.target.value = '';
        }

        if(files){
            console.log("files",files);
            Array.from(files).forEach((file,idx) =>{
                if(file.size >= maxFileSize){
                    alert("10MB 이하의 이미지만 업로드 할 수 있습니다.");
                    e.target.value = '';
                    setImageFile([]);
                    setImageUrl([]);
                    setThumbnail(0);
                    return;
                }
                const url = URL.createObjectURL(file)
                setImageUrl((preUrl)=>[...preUrl,url]);
                setImageFile((preFile)=>[...preFile,file]);
            })
        }
    }

    const changeThumbnail = (e) =>{
        setThumbnail(Number(e.target.dataset.num))
    }

    const action = ()=>{
        // const check = validatation();
        // if(!check.pass){
        //     alert(check.comment)
        //     return;
        // }

        const selectedIndexes = [];
        const colorChips = document.querySelectorAll('.color_chip');
        colorChips.forEach((chip, index) => {
            // "어쩌고-selected" 클래스가 있는지 확인
            if (chip.classList.contains('__white-selected') || chip.classList.contains('__grey-selected') ||
                chip.classList.contains('__black-selected') || chip.classList.contains('__ivory-selected') ||
                chip.classList.contains('__orange-selected') || chip.classList.contains('__brown-selected') ||
                chip.classList.contains('__grass-selected') || chip.classList.contains('__green-selected') ||
                chip.classList.contains('__red-selected') || chip.classList.contains('__blue-selected')) {
                    selectedIndexes.push(Number(index)+1);
            }
        });

        if(window.confirm(isEditable.type === 1 ? '등록하시겠습니까?' : '수정하시겠습니까?')){
            const selectedValues = {};
            const inputs = radioRef.current.querySelectorAll('input[type="radio"]:checked');
            inputs.forEach(input => {
                selectedValues[input.name] = input.value;
            });

            console.log("imgFile",imgFile);
            //이미지 등록
            const formData = new FormData();
            // formData.append('img', imgFile);
            imgFile.forEach(file => {
                formData.append('img', file);
            });
            photoUpload.upload('protection',formData).then((res)=>{
                const data = {
                    "USER_NO" : 1,
                    "USER_ID" : 'se6651',
                    "POST_ST_SUB" : stSubSubRef.current.value,
                    "POST_MEMO" : memoRef.current.value,
                    "POST_PHOTO_URL" : res.urls,
                    "POST_PHOTO_THUMB" : thumbnail,
                    "POST_REG_YMD" : isEditable.type === 1 ? newDate : post.rDate.replaceAll('-',''),
                    "POST_UDT_YMD" : newDate,
                    "ANM_RSC_YMD" : cDateRef.current.value.replaceAll('-',''),
                    "ANM_STAY_YMD" : sDateRef.current.value.replaceAll('-',''),
                    "ANM_SPC" : selectedValues.spc,
                    "ANM_SPC_SUB" : spcSubRef.current.value,
                    "ANM_REGION" : reagionRef.current.value,
                    "ANM_REGION_SUB" : reagionSubRef.current.value,
                    "ANM_SEX": selectedValues.sex,
                    "ANM_NEUTERING_ST": selectedValues.ntr,
                    'ANM_CHIP_ST':selectedValues.chip,
                    "ANM_WEIGHT":weightRef.current.value,
                    "ANM_BIRTH_YEAR":bYearRef.current.value,
                    "ANM_BIRTH_MONTH":bMonthRef.current.value??0,
                    "ANM_AGE_SUPPOSE":1,
                    "ANM_NM":nameRef.current.value,
                    "ANM_COLOR": selectedIndexes.join(','),
                    "ANM_FEATURE":featureRef.current.value,
                }
                console.log('data:', data);
                console.log('radioRef:', radioRef.current);
                console.log('selectedValues:', selectedValues);
                if(isEditable.type === 1){
                    protection.write(data).then((res)=>{
                        console.log(res);
                        if(res.status === 500){
                            alert(res.data);
                        }else {
                            alert('게시글이 등록되었습니다');
                            changeEditable({"editable": false, "type": 0});
                        }
                    })
                }else if(isEditable.type === 2){
                    delete data.POST_REG_YMD;
                    protection.update(post?.postNo, data).then((res)=>{
                        console.log(res);
                        if(res.status === 500 || res.status === 404 ){
                            alert(res.data);
                        }else{
                            alert('게시글이 수정되었습니다');
                            //post.ntcNo = isEditable.NTC_NO;
                            //post.userId = isEditable.USER_ID;
                            //post.title = isEditable.NTC_TITLE;
                            //post.contents = isEditable.NTC_CONTENTS;
                            //post.date = newDateStr;
                            changeEditable({"editable" : false, "type" : 0});
                        }
                    })
                }
            }).catch((error) => {
                alert(error.message);
            });
        }
    }

    const undo = ()=>{
        if(window.confirm('지금까지 수정된 내용은 저장되지 않습니다.\n작성을 취소하시겠습니까?')){
            changeEditable({"editable" : false, "type" : 0})
        }
    }

    const unknownAge = () =>{
        let toggle = ageSupposeRef.current.checked;
        bYearRef.current.disabled = toggle;
        bYearRef.current.readonly = toggle;
        bYearRef.current.value = '';
        bMonthRef.current.disabled = toggle;
        bMonthRef.current.readonly = toggle;
        bMonthRef.current.value = '';
    }

    const calStayDate = (stSub) =>{
        return cvt.stSubDateCvt(stSub);
    }

    const setStayDate = ()=>{
        let flag  = {pass : true, comment : ''};
        flag = vdt.chkSelectIsEmpty(flag, stSubSubRef,'공고상태를 선택해주세요.');
        flag = vdt.chkInputIsEmpty(flag, cDateRef,'구조일을 선택해주세요.');

        if(flag.pass){
            const cDate = new Date(cDateRef.current.value);
            const plusDate = calStayDate(stSubSubRef.current.value);
            const addDate = new Date(cDate.setDate(cDate.getDate() + plusDate));
            console.log("?")
            sDateRef.current.value = addDate.getFullYear()+"-"+(addDate.getMonth() + 1).toString().padStart(2, '0')+"-"+addDate.getDate().toString().padStart(2, '0');
        }
    }

    const initialSelectedTags = ()=>{
        const init = {};

        if(isEditable.type === 2){
            if(post.name?.length > 0) init[1] = true;
            if(post.color?.length > 0) init[2] = true;
            if(post.feature?.length > 0) init[3] = true;
        }
        return init;
    }
    const [selectedTags, setSelectedTags] = useState(initialSelectedTags);


    const TagItem = ({ label, isSelected, onToggle }) => {
        return (
            <div className={`tag__item ${isSelected ? 'tag__item-selected' : ''}`} onClick={onToggle}>
                <span className="material-symbols-outlined">{isSelected ? 'add' : 'remove'}</span>{label}
            </div>
        );
    };

    const TagContent = ({ id, title, children, isVisible }) => {
        return (
            <div id={id} className={`post__item tag__target`} style={{ display: isVisible ? 'block' : 'none' }}>
                <span className="post__item__title">{title}</span>
                <div className="post__item__contents">
                    {children}
                </div>
            </div>
        );
    };

    const handleSelectToggle = (no) => {
        setSelectedTags((prev) => ({
            ...prev,
            [no]: !prev[no]
        }));
    };

    return (
        <>
            <div className="box__content__gallery">
                <div className="gallery__form-editable w40" ref={radioRef}>
                    <div className="gallery__form__title">필수 입력 정보</div>
                    <div className="gallerty__form__contents">
                        <div className="post__item">
                            <span className="post__item__title">종</span>
                            <div className="post__item__contents">
                                <div className="radio__box">
                                    <input id="spc_dog" className="input__radio" name="spc" type="radio" value="1"
                                           defaultChecked={post?.spc ? post?.spc === "1" : true}/>
                                    <label className="post__item__label" htmlFor="spc_dog">개</label>
                                </div>
                                <div className="radio__box">
                                    <input id="spc_cat" className="input__radio" name="spc" type="radio" value="2"
                                           defaultChecked={post?.spc === "2"}/>
                                    <label className="post__item__label" htmlFor="spc_cat">고양이</label>
                                </div>
                                <div className="radio__box">
                                    <input id="spc_etc" className="input__radio" name="spc" type="radio" value="3"
                                           defaultChecked={post?.spc === "3"}/>
                                    <label className="post__item__label" htmlFor="spc_etc">기타</label>
                                </div>
                            </div>
                        </div>
                        <div className="post__item">
                            <span className="post__item__title">세부종</span>
                            <div className="post__item__contents">
                                <input id="spc_sub" className="post__item__input" type="text" ref={spcSubRef}
                                       defaultValue={post?.spcSub}/>
                            </div>
                        </div>
                        <div className="post__item">
                            <span className="post__item__title">성별</span>
                            <div className="post__item__contents">
                                <div className="radio__box">
                                    <input id="sex_f" className="input__radio" name="sex" type="radio" value="f"
                                           defaultChecked={post?.sex ? post?.sex === "f" : true}/>
                                    <label className="post__item__label" htmlFor="sex_f">암</label>
                                </div>
                                <div className="radio__box">
                                    <input id="sex_m" className="input__radio" name="sex" type="radio" value="m"
                                           defaultChecked={post?.sex === "m"}/>
                                    <label className="post__item__label" htmlFor="sex_m">수</label>
                                </div>
                                <div className="radio__box">
                                    <input id="sex_u" className="input__radio" name="sex" type="radio" value="u"
                                           defaultChecked={post?.sex === "u"}/>
                                    <label className="post__item__label" htmlFor="sex_u">모름</label>
                                </div>
                            </div>
                        </div>
                        <div className="post__item">
                            <span className="post__item__title">중성화</span>
                            <div className="post__item__contents">
                                <div className="radio__box">
                                    <input id="ntr_y" className="input__radio" name="ntr" type="radio" value="y"
                                           defaultChecked={post?.ntr ? post?.ntr === "y" : true}/>
                                    <label className="post__item__label" htmlFor="ntr_y">유</label>
                                </div>
                                <div className="radio__box">
                                    <input id="ntr_n" className="input__radio" name="ntr" type="radio" value="n"
                                            defaultChecked={post?.ntr === "n"}/>
                                    <label className="post__item__label" htmlFor="ntr_n">무</label>
                                </div>
                                <div className="radio__box">
                                    <input id="ntr_u" className="input__radio" name="ntr" type="radio" value="u"
                                           defaultChecked={post?.ntr === "u"}/>
                                    <label className="post__item__label" htmlFor="ntr_u">모름</label>
                                </div>
                            </div>
                        </div>
                        <div className="post__item">
                            <span className="post__item__title">내장칩</span>
                            <div className="post__item__contents">
                                <div className="radio__box">
                                    <input id="chip_y" className="input__radio" name="chip" type="radio" value="y"
                                           defaultChecked={post?.chip ? post?.chip === "y" : true}/>
                                    <label className="post__item__label" htmlFor="chip_y">유</label>
                                </div>
                                <div className="radio__box">
                                    <input id="chip_n" className="input__radio" name="chip" type="radio" value="n"
                                           defaultChecked={post?.chip === "n"}/>
                                    <label className="post__item__label" htmlFor="chip_n">무</label>
                                </div>
                                <div className="radio__box">
                                    <input id="chip_u" className="input__radio" name="chip" type="radio" value="u"
                                           defaultChecked={post?.chip === "u"}/>
                                    <label className="post__item__label" htmlFor="chip_u">모름</label>
                                </div>
                            </div>
                        </div>
                        <div className="post__item">
                            <span className="post__item__title">생년(추정)</span>
                            <div className="post__item__contents">
                                <input id="bYear" className="post__item__input" type="number" placeholder="생년"
                                       ref={bYearRef} defaultValue={post?.bYear}/>
                            </div>
                            /
                            <div className="post__item__contents">
                                <input id="bMonth" className="post__item__input" type="number" placeholder="월(선택)"
                                       ref={bMonthRef} defaultValue={post?.bMonth}/>
                            </div>
                            <div className="select__box">
                                <input id="age_suppose" className="post__item__checkbox" type="checkbox"
                                       ref={ageSupposeRef} onChange={unknownAge}/>
                                <label className="post__item__label" htmlFor="age_suppose">미상</label>
                            </div>
                        </div>
                        <div className="post__item">
                            <span className="post__item__title">체중(Kg)</span>
                            <div className="post__item__contents">
                                <input id="weight" className="post__item__input" type="number"
                                       placeholder="소수점 아래 2자리까지 입력 가능"
                                       step="0.1" min="0.1" max="50" ref={weightRef} defaultValue={post?.weight}/>
                            </div>
                        </div>
                        <div className="post__item">
                            <span className="post__item__title">구조 지역</span>
                            <div className="post__item__contents">
                                <select id="region" className="post__item__select" ref={reagionRef}>
                                    <option value="0" selected={post?.region === ""}>전체</option>
                                    <option value="1" selected={post?.region === "1"}>광산구</option>
                                    <option value="2" selected={post?.region === "2"}>남구</option>
                                    <option value="3" selected={post?.region === "3"}>동구</option>
                                    <option value="4" selected={post?.region === "4"}>북구</option>
                                    <option value="5" selected={post?.region === "5"}>서구</option>
                                </select>
                            </div>
                        </div>
                        <div className="post__item">
                            <span className="post__item__title">지역상세</span>
                            <div className="post__item__contents">
                                <input id="region_sub" className="post__item__input" type="text"
                                       placeholder="OO동/발견된 상세 위치" ref={reagionSubRef}
                                       defaultValue={post?.regionSub}/>
                            </div>
                        </div>
                        <div className="post__item">
                            <span className="post__item__title">공고상태</span>
                            <div className="post__item__contents">
                                <select id="st_sub" className="post__item__select" ref={stSubSubRef}
                                        onChange={setStayDate}>
                                    <option value=""  selected={post?.stSub === ""}>전체</option>
                                    <option value="a" selected={post?.stSub === "a"}>공고중</option>
                                    <option value="b" selected={post?.stSub === "b"}>입양가능</option>
                                    <option value="c" selected={post?.stSub === "c"}>입양예정</option>
                                    <option value="d" selected={post?.stSub === "d"}>귀가예정</option>
                                    <option value="e" selected={post?.stSub === "e"}>임시보호</option>
                                    <option value="f" selected={post?.stSub === "f"}>입양완료</option>
                                    <option value="g" selected={post?.stSub === "g"}>귀가</option>
                                    <option value="h" selected={post?.stSub === "h"}>기증</option>
                                    <option value="i" selected={post?.stSub === "i"}>안락사</option>
                                    <option value="j" selected={post?.stSub === "j"}>자연사</option>
                                    <option value="k" selected={post?.stSub === "k"}>방생</option>
                                    <option value="l" selected={post?.stSub === "l"}>탈주</option>
                                </select>
                            </div>
                        </div>
                        <div className="post__item">
                            <span className="post__item__title">구조일</span>
                            <div className="post__item__contents">
                                <input id="cDate" className="post__item__date" type="date" ref={cDateRef}
                                       onChange={setStayDate} defaultValue={post?.cDate}/>
                            </div>
                        </div>
                        <div className="post__item">
                            <span className="post__item__title">공고기간</span>
                            <div className="post__item__contents">
                                <input id="sDate" className="post__item__date w70" type="date" ref={sDateRef}
                                       defaultValue={post?.sDate} readOnly
                                       disabled/>
                                <div>
                                    <span>[+10일]</span>
                                </div>
                            </div>
                        </div>
                        <div className="post__item">
                            <span className="post__item__title">비고(기관용)</span>
                            <div className="post__item__contents">
                                <input id="memo" className="post__item__input" type="text" ref={memoRef}
                                       defaultValue={post?.postMemo}/>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="gallery__form-editable w60">
                    <div className="form__photo">
                        <div className="gallery__form__title">대표사진 업로드(필수)</div>
                        <div className="gallerty__form__contents">
                            <div className="post__item">
                                <div className="post__item__image__box">
                                    <input id="img" className="post__item__file" type="file" accept="image/*" multiple
                                           ref={imgRef} onChange={selectImage}/>
                                    {
                                        imgUrl?.length > 0 &&
                                        <div className="post__item__preview">
                                            {imgUrl.map((url, idx) => (
                                                <div key={idx} className="post__item__preview_box">
                                                    <img className="post__item__preview_img" src={url} alt="선택한 이미지 파일"
                                                         onClick={changeThumbnail} data-num={idx}/>
                                                    {
                                                        idx === thumbnail &&
                                                        <div className="post__item__preview_img_thumbnail">대표</div>
                                                    }
                                                </div>
                                            ))}
                                        </div>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="nReqInfo">
                        <div className="gallery__form__title">선택 입력 정보</div>
                        <div className="gallerty__form__contents">
                            <div className="tag__box">
                                <TagItem label="이름" isSelected={isEditable.type==="2" && post?.name !=='' ? true : selectedTags[1]} onToggle={() => handleSelectToggle(1)} />
                                <TagItem label="색상" isSelected={selectedTags[2]} onToggle={() => handleSelectToggle(2)} />
                                <TagItem label="비고(회원용)" isSelected={selectedTags[3]} onToggle={() => handleSelectToggle(3)} />
                            </div>
                            <div className="tag__contents">
                                <TagContent id="tag1" title="이름" isVisible={selectedTags[1]}>
                                    <input id="name" className="post__item__input" type="text" ref={nameRef} defaultValue={post?.name} />
                                </TagContent>
                                <TagContent id="tag2" title="색상" isVisible={selectedTags[2]}>
                                    <ColorPicker initialSelectedColors={post?.color?.split(",")} />
                                </TagContent>
                                <TagContent id="tag3" title="비고(회원용)" isVisible={selectedTags[3]}>
                                    <input id="feature" className="post__item__input" type="text" ref={featureRef} defaultValue={post?.feature} />
                                </TagContent>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="box__btns">
                <button className="btn__default" onClick={action}>{isEditable.type === 1 ? '등록' : '수정'}</button>
                <button className="btn__default" onClick={undo}>취소</button>
            </div>
        </>
    )
}
export default Write;