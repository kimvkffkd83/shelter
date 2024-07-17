import cvt from "../../js/converter.js";
import vdt from "../../js/validation.js";
import React, {useRef} from "react";
import User from "../../api/User.jsx";
import {useNavigate} from "react-router-dom";

const Login = () =>{
    const idRef = useRef();
    const pwRef = useRef();
    const movePage = useNavigate();

    const validatation = ()=>{
        let flag  = {pass : true, comment : ''};
        flag = vdt.chkInputIsEmpty(flag, idRef,'아이디를 입력해주세요.');
        flag = vdt.chkInputIsEmpty(flag, pwRef,'비밀번호를 입력해주세요.');
        return flag;
    }
    const action = () => {
        // 모든 값이 입력됐는지
        const check = validatation();
        if(!check.pass){
            alert(check.comment)
            return;
        }

        const data = {
            id : idRef.current.value,
            pw : pwRef.current.value,
        }
        console.log("data",data);

        localStorage.removeItem('token');
        User.nLogin(data).then((res)=>{
            console.log(res);
            //이거
            localStorage.setItem('token', res.token)
            movePage("/")
        }).catch ((error) =>{
            alert(error.message);
        })
    }

    return(
        <>
            <div className="post__item">
                <span className="post__item__title">아이디</span>
                <div className="post__item__contents">
                    <input
                        type="text" ref={idRef}
                        className="post__item__input"
                    />
                </div>
            </div>
            <div className="post__item">
                <span className="post__item__title">비밀번호</span>
                <div className="post__item__contents">
                    <input
                        type="password" ref={pwRef}
                        className="post__item__input"
                    />
                </div>
            </div>
            <div className="post__item">
                <button onClick={action}>로그인</button>
            </div>
        </>
    )
}
export default Login;