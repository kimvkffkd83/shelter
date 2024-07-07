import board from "../../api/Board.jsx";
import dp from "dompurify"
import React from "react";

function View(props) {
    const imgs = Array.from(document.getElementsByTagName("img"));
    if(imgs.length >0) {
        imgs.forEach((img, index) =>{
            img.onclick=()=>{window.open(img.src)};
        })
    }

    const isAdmin = true;

    const update = () =>{
        props.changeEditable({"editable" : true, "type" : 2});
    }

    const remove = () =>{
        if(window.confirm('정말로 해당 공지사항을 삭제하시겠습니까?')){
            board.remove(props.data?.ntcNo).then((res)=>{
                console.log("delete res: ",res);
                if(res.status === 500 || res.status === 404 ){
                    alert(res.data);
                }else{
                    alert("삭제가 완료되었습니다.")
                    props.changeSingle({single : false , ntcNo : 0});
                }
            })
        }
    }

    const undo = ()=>{
        props.changeSingle({single : false , ntcNo : 0})
    }

    const display = (single)=>{
        if(window.confirm(`정말로 해당 공지사항을 ${single==='y'?'비공개':'공개'}하시겠습니까?`)){
            board.display(props.data?.ntcNo, single).then((res)=>{
                console.log("delete res: ",res);
                if(res.status === 500 || res.status === 404 ){
                    alert(res.data);
                }else{
                    alert("변경이 완료되었습니다.")
                    props.changeSingle({single : false , ntcNo : 0});
                }
            })
        }
    }

    return(
        <>
            <div className="box__post">
                <div className="post__header">
                    <span className="post__title w80">{props.data?.title}</span>
                    <span className="post__user-id w10 tc">{props.data?.userId}</span>
                    <span className="post__date w20 tc">{props.data?.date}</span>
                    {isAdmin &&
                        <div className="box__adm">
                            <div className="box__adm__btns">
                                <button className="btn__adm__icon btn__adm__modify" onClick={update}>
                                    <span className="material-symbols-outlined">edit_note</span>
                                </button>
                                <button
                                    className={`btn__adm__icon btn__adm__${props.data?.display === 'y' ? 'hide' : 'show'}`}
                                    onClick={() => {
                                        display(props.data?.display)
                                    }}
                                >
                                    <span className="material-symbols-outlined">
                                       {props.data?.display === 'y' ? 'visibility_off' : 'visibility'}
                                    </span>
                                </button>
                                <button className="btn__adm__icon btn__adm__delete" onClick={remove}>
                                    <span className="material-symbols-outlined">delete</span>
                                </button>
                            </div>
                        </div>
                    }
                </div>
                <div className="post__content clearfix"
                     dangerouslySetInnerHTML={{__html: dp.sanitize(props.data?.contents)}}/>
            </div>
            <div className="box__btns">
                <button className="btn__default" onClick={undo}>목록으로</button>
            </div>
        </>
    )
}

export default View;