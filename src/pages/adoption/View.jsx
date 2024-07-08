import React from "react";
import dp from "dompurify";

const View = ({isAdmin,post,remove,undo,setEditState})=>{
    console.log("post",post);

    return(
        <>
            <div className="box__post">
                <div className="post__header">
                    <span className="post__title w80">{post.title}</span>
                    <span className="post__user-id w10 tc">{post.userId}</span>
                    <span className="post__date w20 tc">{post.regDate}</span>
                    {isAdmin &&
                        <div className="box__adm">
                            <div className="box__adm__btns">
                                <button className="btn__adm__icon btn__adm__delete" onClick={remove}>
                                    <span className="material-symbols-outlined">delete</span>
                                </button>
                            </div>
                        </div>
                    }
                </div>
                <div className="post__content clearfix"
                     dangerouslySetInnerHTML={{__html: dp.sanitize(post.contents)}}/>
            </div>
            <div className="box__btns">
                <button className="btn__default" onClick={undo}>목록으로</button>
            </div>
        </>
    )

}
export default View;
