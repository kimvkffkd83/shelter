import axios from "axios";
import {useEffect, useRef} from "react";
import board from "../../api/Board.jsx";

function Write(props){
    console.log("props:",props);
    // console.log("props:",props.post.at(0).title);

    const titleRef = useRef()
    const contentsRef = useRef()
    const date = new Date();
    const newDate = date.getFullYear()+(date.getMonth() + 1).toString().padStart(2, '0')+date.getDate().toString().padStart(2, '0');
    const newDateStr = date.getFullYear()+"-"+(date.getMonth() + 1).toString().padStart(2, '0')+"-"+date.getDate().toString().padStart(2, '0');


    const action = ()=>{
        const data = {
            "USER_NO" : 1,
            "USER_ID" : 'se6651',
            "NTC_TITLE" : titleRef.current.value,
            "NTC_CONTENTS" : contentsRef.current.value,
            "NTC_REG_DATE" : props.data.type === 1 ? newDate : props.post.at(0).date.replaceAll('-',''),
            "NTC_UDT_DATE" : newDate,
        }

        console.log("data:",data);

        if(props.data.type === 1){
            board.write(data).then((res)=>{
                console.log(res);
                if(res.status === 500){
                    alert(res.data);
                }else {
                    alert('공지사항이 등록되었습니다');
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
                    alert('공지사항이 수정되었습니다');
                    props.post.at(0).ntcNo = data.NTC_NO;
                    props.post.at(0).userId = data.USER_ID;
                    props.post.at(0).title = data.NTC_TITLE;
                    props.post.at(0).contents = data.NTC_CONTENTS;
                    props.post.at(0).date = newDateStr;
                    props.changeEditable({"editable" : false, "type" : 0});
                }
            })
        }
    }

    const undo = ()=>{
        props.changeEditable({"editable" : false, "type" : 0})
    }

    return(
        <div className="box__post">
            <div className="post__item">
                <span className="post__item-title">제목</span>
                <input className="post__item__input" ref={titleRef} defaultValue={props.post.at(0)?.title}/>
            </div>
            <div className="post__item">
                <span className="post__item-title">날짜</span>
                <span className="post__item__text">{newDateStr}</span>
            </div>
            {props.data.type === 1 &&
                <div className="post__item">
                    <div className="post__item-title"></div>
                    <div className="post__item__text">
                        <label name="date" className="post__item__label" htmlFor="date">현재</label>
                        <input name="date" className="post__item__radio" type="radio" defaultChecked></input>
                        <label name="date" className="post__item__label" htmlFor="date">예약</label>
                        <input name="date" className="post__item__radio" type="radio"></input>
                    </div>
                </div>
            }
            <div className="post__item">
                <span className="post__item-title">내용</span>
                <textarea className="post__item__textarea"
                          ref={contentsRef} defaultValue={props.post.at(0)?.contents}/>
            </div>
            <div className="box__btns">
                <button className="btn__default" onClick={action}>{props.data.type === 1 ? '등록' : '수정'}</button>
                <button className="btn__default"  onClick={undo}>취소</button>
            </div>
        </div>
    )
}

export default Write;