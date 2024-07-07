import {useRef} from "react";
import adopt from "../../api/Adopt.jsx";
import Editor from "../../component/Editor.jsx";
import vdt from "../../js/validation.js";

function Write({post,isEditable,changeEditable}){

    const titleRef = useRef()
    const contentsRef = useRef()
    const date = new Date();
    const newDate = date.getFullYear()+(date.getMonth() + 1).toString().padStart(2, '0')+date.getDate().toString().padStart(2, '0');
    const newDateStr = date.getFullYear()+"-"+(date.getMonth() + 1).toString().padStart(2, '0')+"-"+date.getDate().toString().padStart(2, '0');

    const validatation = ()=>{
        let flag  = {pass : true, comment : ''};
        flag = vdt.chkInputIsEmpty(flag, titleRef,'제목을 작성해주세요.');
        flag = vdt.chkInputIsEmpty(flag, contentsRef,'내용을 작성해주세요.');
        return flag;
    }

    const action = ()=>{
        const check = validatation();
        if(!check.pass){
            alert(check.comment)
            return;
        }


        if(window.confirm(isEditable.type === 1 ? '공지사항을 게시하시겠습니까?' : '공지사항을 수정하시겠습니까?')){
            const data = {
                "USER_NO" : 1,
                "USER_ID" : 'se6651',
                "POST_TITLE" : titleRef.current.value,
                "POST_CONTENTS" : contentsRef.current.value,
                "POST_REG_DATE" : isEditable.type === 1 ? newDate : post?.date.replaceAll('-',''),
                "POST_UDT_DATE" : newDate,
            }

            if(isEditable.type === 1){
                adopt.reviewWrite(data).then((res)=>{
                    if(res.status === 500){
                        alert(res.data);
                    }else {
                        alert('공지사항이 등록되었습니다');
                        changeEditable({"editable": false, "type": 0});
                    }
                })
            }
            // else if(isEditable.type === 2){
            //     data.NTC_NO = post?.ntcNo;
            //     delete data.NTC_REG_DATE;
            //     board.update(post?.ntcNo, data).then((res)=>{
            //         console.log(res);
            //         if(res.status === 500 || res.status === 404 ){
            //             alert(res.data);
            //         }else{
            //             alert('공지사항이 수정되었습니다');
            //             post.ntcNo = data.NTC_NO;
            //             post.userId = data.USER_ID;
            //             post.title = data.NTC_TITLE;
            //             post.contents = data.NTC_CONTENTS;
            //             post.date = newDateStr;
            //             changeEditable({"editable" : false, "type" : 0});
            //         }
            //     })
            // }
        }
    }

    const undo = ()=>{
        if(window.confirm('지금까지 수정된 내용은 저장되지 않습니다.\n작성을 취소하시겠습니까?')){
            changeEditable({"editable" : false, "type" : 0})
        }
    }

    return(
        <div className="box__post">
            <div className="post__item">
                <span className="post__item__title">제목</span>
                <div className="post__item__contents">
                    <input className="post__item__input" ref={titleRef} defaultValue={post?.title}
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
                <span className="post__item__title">내용</span>
                <div className="post__item__contents">
                    <Editor ref={contentsRef} route={'adopt'} defaultValue={post?.contents}/>
                </div>
            </div>
            <div className="box__btns">
                <button className="btn__default" onClick={action}>{isEditable.type === 1 ? '등록' : '수정'}</button>
                <button className="btn__default" onClick={undo}>취소</button>
            </div>
        </div>
    )
}

export default Write;