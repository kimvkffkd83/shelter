import React, {useRef, useState} from "react";
import missing from "../../api/Missing.jsx";
import photoUpload from "../../api/photoUpload.jsx";
import vdt from "../../js/validation.js";
import ColorPicker from "../../component/ColorPicker.jsx";
import Species from "../../jsons/Species.json"

const Write = ({post,isEditable,changeEditable,getView,getList})=>{
    console.log("post:",post);
    const maxFileCnt = 3;
    const maxFileSize = 10000000;

    const radioRef = useRef();
    const spcSubRef = useRef();
    const bYearRef = useRef();
    const bMonthRef = useRef();
    const ageUnknownRef = useRef();
    const weightUnknownRef = useRef();
    const weightRef = useRef();
    const reagionRef = useRef();
    const reagionSubRef = useRef();
    const cDateRef = useRef();
    const imgRef = useRef();
    const nameRef = useRef();
    const featureRef = useRef();

    const date = new Date();
    //[yyyymmdd]
    const newDate = date.getFullYear()+(date.getMonth() + 1).toString().padStart(2, '0')+date.getDate().toString().padStart(2, '0');
    //[yyyy-mm-dd]
    const newDateStr = date.getFullYear()+"-"+(date.getMonth() + 1).toString().padStart(2, '0')+"-"+date.getDate().toString().padStart(2, '0');


    const [spanName, setSpanName] = useState('실종')
    const changeSpanName = (e) =>{
        setSpanName(e.target.value === 'a'? '실종' : '목격')
    }

    const isEmpty = ()=>{
        let flag  = {pass : true, comment : ''};
        flag = vdt.chkInputIsEmpty(flag, spcSubRef,'세부 종을 작성해주세요.');
        if(!ageUnknownRef.current.checked) {
            flag = vdt.chkInputIsEmpty(flag, bYearRef,'생년을 작성해주세요.');
        }
        if(!weightUnknownRef.current.checked) {
            flag = vdt.chkInputIsEmpty(flag, weightRef,'체중을 작성해주세요.');
        }
        flag = vdt.chkSelectIsEmpty(flag, reagionRef,`${spanName} 지역을 선택해주세요.`);
        flag = vdt.chkInputIsEmpty(flag, reagionSubRef,'지역상세를 작성해주세요.');
        flag = vdt.chkInputIsEmpty(flag, cDateRef,`${spanName}일을 선택해주세요.`);
        return flag;
    }

    const initialImgUrl = ()=>{
        let init = [];
        if(post?.photoUrl) init = post?.photoUrl.split(",");
        return init;
    }

    const [imgFile, setImageFile] = useState([]);
    const [imgUrl, setImageUrl] = useState(initialImgUrl);
    const [thumbnail, setThumbnail] = useState(post?.photoThumb?? 0);

    const selectImage = (e)=>{
        const files = e.target.files;
        if(e.target.files.length > maxFileCnt){
            alert(`파일은 최대 ${maxFileCnt}개까지 선택할 수 있습니다.`);
            e.target.value = '';
            return;
        }

        if(files){
            const arr = Array.from(files);
            for(let i = 0 ; i < arr.length ; i++){
                if(arr[i].size >= maxFileSize){
                    alert("10Mb 이하의 이미지만 업로드 할 수 있습니다.");
                    e.target.value = '';
                    break;
                }

                if(imgFile.length+i >= maxFileCnt){
                    alert(`파일은 최대 ${maxFileCnt}개까지 선택할 수 있습니다.`);
                    e.target.value = '';
                    break;
                }

                const url = URL.createObjectURL(arr[i])
                setImageUrl((preUrl)=>[...preUrl,url]);
                setImageFile((preFile)=>[...preFile,arr[i]]);
            }
        }
    }

    const deleteImage =(num)=>{
        if( isEditable.type === 2 && imgUrl.length === 1){
            alert("사진을 한 장 이상 첨부해야합니다.")
            return;
        }
        const imgFileArray = Array.from(imgFile);
        imgFileArray.splice(num,1);
        setImageFile(imgFileArray);

        const imgUrlArray = Array.from(imgUrl);
        imgUrlArray.splice(num,1)
        setImageUrl(imgUrlArray)

        if(thumbnail === num) {
            setThumbnail(0);
        }else if(num < thumbnail){
            setThumbnail(thumbnail-1);
        }
    }

    const changeThumbnail = (num) =>{
        setThumbnail(num);
    }

    const action = ()=>{
        const check = isEmpty();
        if(!check.pass){
            alert(check.comment)
            return;
        }

        if(window.confirm(isEditable.type === 1 ? '등록하시겠습니까?' : '수정하시겠습니까?')){
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

            const selectedValues = {};
            const inputs = radioRef.current.querySelectorAll('input[type="radio"]:checked');
            inputs.forEach(input => {
                selectedValues[input.name] = input.value;
            });

            const data = {
                "USER_NO" : 1,
                "USER_ID" : 'se6651',
                "POST_ST_SUB" : selectedValues.stSub,
                "POST_PHOTO_THUMB" : thumbnail,
                "POST_REG_YMD" : newDate,
                "POST_UDT_YMD" : newDate,
                "ANM_RSC_YMD" : cDateRef.current.value.replaceAll('-',''),
                "ANM_SPC" : selectedValues.spc,
                "ANM_SPC_SUB" : spcSubRef.current.value,
                "ANM_REGION" : reagionRef.current.value,
                "ANM_REGION_SUB" : reagionSubRef.current.value,
                "ANM_SEX": selectedValues.sex,
                "ANM_NEUTERING_ST": selectedValues.ntr,
                'ANM_CHIP_ST':selectedValues.chip,
                "ANM_WEIGHT":Number(weightRef.current.value).toFixed(2),
                "ANM_BIRTH_YEAR": ageUnknownRef.current.checked? 0 : bYearRef.current.value,
                "ANM_BIRTH_MONTH":ageUnknownRef.current.checked? 0 : bMonthRef.current.value===''? 0 :bMonthRef.current.value,
                "ANM_AGE_UNKNOWN":ageUnknownRef.current.checked? 1 : 0,
                "ANM_WEIGHT_UNKNOWN":weightUnknownRef.current.checked? 1 : 0,
                //선택입력
                "ANM_NM":selectedTags[1]? nameRef.current.value : '',
                "ANM_FEATURE":selectedTags[2]? featureRef.current.value:'',
                "ANM_COLOR": selectedTags[3]? selectedIndexes.join(',') : '',
            }

            console.log("data",data);

            //등록
            if(isEditable.type === 1){
                //이미지 등록
                const formData = new FormData();
                imgFile.forEach(file => {
                    formData.append('img', file);
                });

                photoUpload.upload('missing',formData).then((res)=>{
                    data["POST_PHOTO_URL"] = res.urls;
                    if(isEditable.type === 1){
                        missing.write(data).then((res)=>{
                            if(res.status === 500){
                                alert(res.data);
                            }else {
                                getList().then(()=>{
                                    alert('게시글이 등록되었습니다');
                                    changeEditable({"editable": false, "type": 0});
                                });
                            }
                        }).catch((error) => {
                            alert(error.message);
                        });
                    }
                }).catch((error) => {
                    alert(error.message);
                });
            }else if(isEditable.type === 2){ //수정
                const imgs = document.querySelectorAll('img[class=post__item__preview_img]');
                const arr = [];
                imgs.forEach((img,idx) =>{
                    arr.push(img.src);
                })
                data["POST_PHOTO_URL"]=arr.join(',');
                //등록일은 수정할 필요 없음
                delete data.POST_REG_YMD;
                missing.update(post?.postNo, data).then((res)=>{
                    if(res.status === 500 || res.status === 404 ){
                        alert(res.data);
                    }else{
                        getList().then(()=>{
                            alert('게시글이 수정되었습니다');
                            getView(post?.postNo).then(changeEditable({"editable" : false, "type" : 0}));
                        });
                    }
                })
            }
        }
    }

    const undo = ()=>{
        if(window.confirm('지금까지 수정된 내용은 저장되지 않습니다.\n작성을 취소하시겠습니까?')){
            changeEditable({"editable" : false, "type" : 0})
        }
    }

    const chkWhenBlur = (func, ref, id)=>{
        if(func(ref.current.value)){
            document.querySelector(`div[id=${id}]`).style.display = 'flex';
            ref.current.focus();
        }else{
            document.querySelector(`div[id=${id}]`).style.display = 'none';
        }
    }

    const ageToggle = () =>{
        let toggle = ageUnknownRef.current.checked;
        bYearRef.current.disabled = toggle;
        bYearRef.current.readonly = toggle;
        bYearRef.current.value = '';
        bMonthRef.current.disabled = toggle;
        bMonthRef.current.readonly = toggle;
        bMonthRef.current.value = '';
        document.querySelector(`div[id=bYearErr]`).style.display = 'none';
    }
    const weightToggle = () =>{
        let toggle = weightUnknownRef.current.checked;
        weightRef.current.disabled = toggle;
        weightRef.current.readonly = toggle;
        weightRef.current.value = '';
        document.querySelector(`div[id=bWeightErr]`).style.display = 'none';
    }

    const initialSelectedTags = ()=>{
        const init = {};

        if(isEditable.type === 2){
            if(post.name?.length > 0) init[1] = true;
            if(post.feature?.length > 0) init[2] = true;
            if(post.color?.length > 0) init[3] = true;
        }
        return init;
    }

    const [selectedTags, setSelectedTags] = useState(initialSelectedTags);

    const TagItem = ({ label, isSelected, onToggle }) => {
        return (
            <div className={`tag__item ${isSelected ? 'tag__item-selected' : ''}`} onClick={onToggle}>
                <span className="material-symbols-outlined">{isSelected ? 'remove' : 'add'}</span>{label}
            </div>
        );
    };

    const handleSelectToggle = (no) => {
        console.log("selectedTags",selectedTags);
        setSelectedTags((prev) => ({
            ...prev,
            [no]: !prev[no]
        }));
    };

    const [proposal, setProposal] = useState([]);
    const subSpcProposal =(e)=>{
        const input = radioRef.current.querySelectorAll('input[name=spc]:checked')[0];
        const text = e.target.value;
        const filteredSuggestions = Species[input.value].filter(
            anm => anm.nameKR.toLowerCase().includes(text.toLowerCase())
        );
        setProposal(filteredSuggestions.slice(0,3));
    }

    const setName = (e) =>{
        spcSubRef.current.value = e.target.innerHTML;
        setProposal([]);
    }

    const setSub = ()=>{
        spcSubRef.current.value = '';
        setProposal([]);
    }

    return (
        <>
            <div className="box__content__gallery">
                <div className="gallery__form-editable w40" ref={radioRef}>
                    <div className="gallery__form__title">필수 입력 정보</div>
                    <div className="gallerty__form__contents">
                        <div className="post__item">
                            <span className="post__item__title">상태</span>
                            <div className="post__item__contents">
                                <div className="radio__box">
                                    <input id="st_sub_miss" className="input__radio" name="stSub" type="radio" value="a"
                                           defaultChecked={post?.st ? post?.st === "1" : true}
                                           onChange={changeSpanName}
                                    />
                                    <label className="post__item__label" htmlFor="st_sub_miss">실종</label>
                                </div>
                                <div className="radio__box">
                                    <input id="st_sub_see" className="input__radio" name="stSub" type="radio" value="b"
                                           defaultChecked={post?.st === "2"}
                                           onChange={changeSpanName}
                                    />
                                    <label className="post__item__label" htmlFor="st_sub_see">목격</label>
                                </div>
                            </div>
                        </div>
                        <div className="post__item">
                            <span className="post__item__title">종</span>
                            <div className="post__item__contents">
                                <div className="radio__box">
                                    <input id="spc_dog" className="input__radio" name="spc" type="radio" value="1"
                                           defaultChecked={post?.spc ? post?.spc === "1" : true}
                                           onChange={setSub}
                                    />
                                    <label className="post__item__label" htmlFor="spc_dog">개</label>
                                </div>
                                <div className="radio__box">
                                    <input id="spc_cat" className="input__radio" name="spc" type="radio" value="2"
                                           defaultChecked={post?.spc === "2"}
                                           onChange={setSub}
                                    />
                                    <label className="post__item__label" htmlFor="spc_cat">고양이</label>
                                </div>
                                <div className="radio__box">
                                    <input id="spc_etc" className="input__radio" name="spc" type="radio" value="3"
                                           defaultChecked={post?.spc === "3"}
                                           onChange={setSub}
                                    />
                                    <label className="post__item__label" htmlFor="spc_etc">기타</label>
                                </div>
                            </div>
                        </div>
                        <div className="post__item">
                            <span className="post__item__title">세부종</span>
                            <div className="post__item__contents">
                                <input id="spc_sub" className="post__item__input" type="text"
                                       ref={spcSubRef} autoComplete="off"
                                       defaultValue={post?.spcSub} onChange={subSpcProposal}
                                       onKeyUp={() => vdt.chkInputLength(spcSubRef, 20)}
                                       onKeyDown={() => vdt.chkInputLength(spcSubRef, 20)}
                                       onBlur={() => vdt.chkInputLength(spcSubRef, 20)}
                                />
                            </div>
                        </div>
                        {(proposal && proposal.length > 0) &&
                            <div className="post__item">
                                <span className="post__item__title"></span>
                                <div className="post__item__contents">
                                    <div className="proposal__box">
                                        {
                                            proposal.map((p, idx) => (
                                                <div key={idx} className="proposal__item"
                                                     onClick={setName}>{p.nameKR}</div>
                                            ))
                                        }
                                    </div>
                                </div>
                            </div>
                        }
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
                                       ref={bYearRef} defaultValue={post?.bYear}
                                       disabled={post?.ageUnknown === '1'} readOnly={post?.ageUnknown === '1'}
                                       onBlur={() => chkWhenBlur(vdt.chkBirthYear, bYearRef, "bYearErr")}/>
                            </div>
                            /
                            <div className="post__item__contents">
                                <input id="bMonth" className="post__item__input" type="number" placeholder="월(선택)"
                                       ref={bMonthRef} defaultValue={post?.bMonth}
                                       disabled={post?.ageUnknown === '1'} readOnly={post?.ageUnknown === '1'}
                                       onBlur={() => chkWhenBlur(vdt.chkBirthMonth, bMonthRef, "bYearErr")}/>
                            </div>
                            <div className="select__box">
                                <input id="ageUnknown" className="post__item__checkbox" type="checkbox"
                                       ref={ageUnknownRef} onChange={ageToggle}
                                       defaultChecked={post?.ageUnknown === '1'}/>
                                <label className="post__item__label" htmlFor="ageUnknown">모름</label>
                            </div>
                        </div>
                        <div id="bYearErr" className="post__item post__item-error">
                            <span className="post__item__title"></span>
                            <div className="post__item__contents">
                                <span>정확한 생년을 입력하세요.</span>
                            </div>
                        </div>
                        <div className="post__item">
                            <span className="post__item__title">체중(Kg)</span>
                            <div className="post__item__contents">
                                <input id="weight" className="post__item__input" type="number"
                                       placeholder="소수점 아래 2자리까지 입력 가능"
                                       ref={weightRef} defaultValue={post?.weight}
                                       onBlur={() => chkWhenBlur(vdt.chkWeight, weightRef, "bWeightErr")}/>
                            </div>
                            <div className="select__box">
                                <input id="weightUnknown" className="post__item__checkbox" type="checkbox"
                                       ref={weightUnknownRef} onChange={weightToggle}
                                       defaultChecked={post?.weightUnknown === '1'}/>
                                <label className="post__item__label" htmlFor="weightUnknown">모름</label>
                            </div>
                        </div>
                        <div id="bWeightErr" className="post__item post__item-error">
                            <span className="post__item__title"></span>
                            <div className="post__item__contents">
                                <span>정확한 체중을 입력하세요.</span>
                            </div>
                        </div>
                        <div className="post__item">
                            <span className="post__item__title">{spanName} 지역</span>
                            <div className="post__item__contents">
                                <select id="region" className="post__item__select" ref={reagionRef}
                                        defaultValue={post?.region}>
                                    <option value="">전체</option>
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
                                       placeholder="OO동/발견된 상세 위치" ref={reagionSubRef}
                                       onKeyUp={() => vdt.chkInputLength(reagionSubRef, 20)}
                                       onKeyDown={() => vdt.chkInputLength(reagionSubRef, 20)}
                                       onBlur={() => vdt.chkInputLength(reagionSubRef, 20)}
                                       defaultValue={post?.regionSub}/>
                            </div>
                        </div>
                        <div className="post__item">
                            <span className="post__item__title">{spanName}일</span>
                            <div className="post__item__contents">
                                <input id="cDate" className="post__item__date"
                                       type="date" ref={cDateRef}
                                       defaultValue={post?.cDate ?? newDateStr}
                                       readOnly={isEditable.type === 2}
                                       disabled={isEditable.type === 2}
                                />
                            </div>
                        </div>
                        <div id="sDateErr" className="post__item post__item-error">
                            <span className="post__item__title"></span>
                            <div className="post__item__contents">
                                <span>구조일은 등록일 이전이어야 합니다.</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="gallery__form-editable w60">
                    <div className="form__photo">
                        <div className="gallery__form__title">대표사진 업로드(필수)</div>
                        <div className="gallerty__form__contents">
                            <div className="warning__box">
                                <span className="warning__text">※ 등록 이후에는 사진 삭제, 대표사진 변경만 가능합니다.</span>
                            </div>
                            <div className="post__item">
                                <div className="post__item__image__box">
                                    {
                                        isEditable.type === 1 &&
                                        <input id="img" className="post__item__file" type="file" accept="image/*"
                                               multiple
                                               ref={imgRef} onChange={selectImage}/>
                                    }
                                    {
                                        imgUrl?.length > 0 &&
                                        <div className="post__item__preview">
                                            {
                                                imgUrl.map((url, idx) => (
                                                    <div key={idx} className="post__item__preview_box">
                                                        <img className="post__item__preview_img" src={url} alt="선택한 이미지 파일"
                                                             onClick={()=>changeThumbnail(idx)}/>
                                                        {
                                                            idx === thumbnail &&
                                                            <div className="post__item__preview_img_thumbnail">대표</div>
                                                        }
                                                        <div className="post__item__preview_img_delete" onClick={()=>deleteImage(idx)}>
                                                            <span className="material-symbols-outlined">delete</span>
                                                        </div>
                                                    </div>
                                                ))
                                            }
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
                                <TagItem label="이름" isSelected={selectedTags[1]} onToggle={() => handleSelectToggle(1)} />
                                <TagItem label="특징" isSelected={selectedTags[2]} onToggle={() => handleSelectToggle(2)} />
                                <TagItem label="색상" isSelected={selectedTags[3]} onToggle={() => handleSelectToggle(3)} />
                            </div>
                            <div className="tag__contents">
                                <div id="tag1" className='post__item tag__target'
                                     style={{display: selectedTags[1] ? 'flex' : 'none'}}>
                                    <span className="post__item__title">이름</span>
                                    <div className="post__item__contents">
                                        <input id="name" className="post__item__input" type="text" ref={nameRef}
                                               defaultValue={post?.name} placeholder="10자 이내"
                                               onKeyUp={() => vdt.chkInputLength(nameRef, 10)}
                                               onKeyDown={() => vdt.chkInputLength(nameRef, 0)}
                                               onBlur={() => vdt.chkInputLength(nameRef, 10)}/>
                                    </div>
                                </div>
                                <div id="tag2" className='post__item tag__target'
                                     style={{display: selectedTags[2] ? 'flex' : 'none'}}>
                                    <span className="post__item__title">특징</span>
                                    <div className="post__item__contents">
                                        <textarea id="feature" className="post__item__textarea" ref={featureRef}
                                                  defaultValue={post?.feature} placeholder="100자 이내"
                                                  onKeyUp={() => vdt.chkInputLength(featureRef, 100)}
                                                  onKeyDown={() => vdt.chkInputLength(featureRef, 100)}
                                                  onBlur={() => vdt.chkInputLength(featureRef, 100)}/>
                                    </div>
                                </div>
                                <div id="tag3" className='post__item tag__target'
                                     style={{display: selectedTags[3] ? 'flex' : 'none'}}>
                                    <div className="post__item__title">색상</div>
                                    <div className="post__item__contents">
                                        <ColorPicker initialSelectedColors={post?.color?.split(",")}/>
                                    </div>
                                </div>
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