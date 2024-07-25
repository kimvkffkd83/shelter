import cvt from "../../js/converter.js";
import vdt from "../../js/validation.js";
import React, {useRef, useState} from "react";
import User from "../../api/User.jsx"

const SignUp = () =>{
    const nameRef = useRef();
    const idRef = useRef();
    const pwRef = useRef();
    const pwConfirmRef = useRef();
    const phoneRef = useRef();
    const mailRef = useRef();

    const chkWhenBlur = (func, ref, id)=>{
        if(!func(ref.current.value)){
            document.querySelector(`div[id=${id}]`).style.display = 'flex';
            ref.current.focus();
        }else{
            document.querySelector(`div[id=${id}]`).style.display = 'none';
        }
    }

    const chkSamePw = ()=>{
        if(pwRef.current.value !== pwConfirmRef.current.value){
            document.querySelector(`div[id=pwConfirmErr]`).style.display = 'flex';
        }else{
            document.querySelector(`div[id=pwConfirmErr]`).style.display = 'none';
        }
    }

    const validatation = ()=>{
        let flag  = {pass : true, comment : ''};
        flag = vdt.chkInputIsEmpty(flag, nameRef,'성명을 입력해주세요.');
        flag = vdt.chkInputIsEmpty(flag, idRef,'아이디를 입력해주세요.');
        flag = vdt.chkInputIsEmpty(flag, pwRef,'비밀번호를 입력해주세요.');
        flag = vdt.chkInputIsEmpty(flag, pwConfirmRef,'비밀번호 확인을 입력해주세요.');
        flag = vdt.chkInputIsEmpty(flag, phoneRef,'연락처를 입력해주세요.');
        flag = vdt.chkInputIsEmpty(flag, mailRef,'이메일을 입력해주세요.');
        return flag;
    }

    const [hasChkId, setHasChkId] = useState({id:'',pass:false});

    const chkId = () =>{
        // id 규칙: 영문 소문자+숫자 혼합으로 6~12자, 영문 소문자로 시작할 것.
        if(vdt.chkId(idRef.current.value)){
            User.chkIdDuplication(idRef.current.value).then((res)=>{
                if(res){
                    // 중복알림
                    alert("id 중복입니다. 다른 id를 사용해주세요.")
                    idRef.current.focus();
                    setHasChkId({id:idRef.current.value,pass:false});
                }else{
                    // 진행알림
                    alert("사용 가능한 id 입니다.")
                    setHasChkId({id:idRef.current.value,pass:true});
                }
            })
        }
    }
    const action = () => {
        // 모든 값이 입력됐는지
        const check = validatation();
        if(!check.pass){
            alert(check.comment)
            return;
        }

        // id 중복체크 됐는지
        if(hasChkId.id === '' || hasChkId.pass === false || idRef.current.value !== hasChkId.id){
            alert('id 중복 확인을 해주세요.')
            return;
        }

        // 비번 일치하는지
        if(pwRef.current.value !== pwConfirmRef.current.value){
            alert('비밀번호가 일치하지 않습니다.')
            pwRef.current.focus();
            return;
        }

        const data = {
            name : nameRef.current.value,
            id : idRef.current.value,
            pw : pwRef.current.value,
            phone : phoneRef.current.value.replaceAll("-",''),
            mail : mailRef.current.value
        }
        console.log("data",data);
        User.nSignUp(data).then((res)=>{
            console.log(res);
            //회원가입 이후 자동로그인(화면 전환)
        }).catch ((error) =>{
            alert(error.message);
        })
    }

    return(
        <>
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
                <span className="post__item__title">아이디</span>
                <div className="post__item__contents">
                    <input className="post__item__input" ref={idRef}
                           placeholder="영문 소문자+숫자 포함, 6~12자"
                           onBlur={() => chkWhenBlur(vdt.chkId, idRef, 'idErr')}
                    />
                    <button className=""
                            onClick={chkId}> 중복확인
                    </button>
                </div>
            </div>
            <div id="idErr" className="post__item post__item-error">
                <span className="post__item__title"></span>
                <div className="post__item__contents">
                    <span> 영문 소문자+숫자 포함,<br/>6자~12자 아이디를 입력하세요.</span>
                </div>
            </div>
            <div className="post__item">
                <span className="post__item__title">비밀번호</span>
                <div className="post__item__contents">
                    <input
                        type="password"
                        className="post__item__input"
                        placeholder="영문 대,소문자+숫자+특수 문자(!,@,#,$,%,^,&,*) 포함 8~16자"
                        ref={pwRef}
                        onKeyUp={chkSamePw}
                        onKeyDown={chkSamePw}
                        onBlur={() => chkWhenBlur(vdt.chkPassword, pwRef, 'pwErr')}
                    />
                </div>
            </div>
            <div id="pwErr" className="post__item post__item-error">
                <span className="post__item__title"></span>
                <div className="post__item__contents">
                    <span>영문 대,소문자,숫자,특수문자 포함,8~16자<br/>사용가능 특수문자 !,@,#,$,%,^,&,*</span>
                </div>
            </div>
            <div className="post__item">
                <span className="post__item__title">비밀번호확인</span>
                <div className="post__item__contents">
                    <input
                        type="password"
                        className="post__item__input"
                        placeholder="위와 동일한 비밀번호를 입력해주세요."
                        ref={pwConfirmRef}
                        onKeyUp={chkSamePw}
                        onKeyDown={chkSamePw}
                        onBlur={chkSamePw}
                    />
                </div>
            </div>
            <div id="pwConfirmErr" className="post__item post__item-error">
                <span className="post__item__title"></span>
                <div className="post__item__contents">
                    <span>비밀번호가 일치하지 않습니다.</span>
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
                <span className="post__item__title">e-mail</span>
                <div className="post__item__contents">
                    <input className="post__item__input" ref={mailRef}
                           type="email"
                           autoComplete="new-email"

                           onBlur={() => chkWhenBlur(vdt.chkMailAddress, mailRef, 'mailErr')}
                           placeholder="인증에 활용될 이메일을 입력해주세요."
                    />
                </div>
            </div>
            <div id="mailErr" className="post__item post__item-error">
                <span className="post__item__title"></span>
                <div className="post__item__contents">
                    <span>정확한 이메일을 입력하세요.</span>
                </div>
            </div>
            <div className="post__item">
                <button onClick={action}>회원가입</button>
            </div>
        </>
    )
}
export default SignUp;