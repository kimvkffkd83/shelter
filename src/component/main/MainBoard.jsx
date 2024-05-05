import React from "react";

class MainBoard extends React.Component{
    constructor(props) {
        super(props);
        this.title = props.title
        this.titleKR = "";
        
        if(this.title =="notice") this.titleKR = "공지사항"
        else this.titleKR = "입양/임보후기"
        
        this.dummy = [
            {title : "1번 게시글", board_date:"2024-05-25", board_vcnt:0},
            {title : "2번 게시글", board_date:"2024-05-25", board_vcnt:0},
            {title : "3번 게시글", board_date:"2024-05-25", board_vcnt:0},
            {title : "4번 게시글", board_date:"2024-05-25", board_vcnt:0},
            {title : "5번 게시글", board_date:"2024-05-25", board_vcnt:0},
        ];
    }

    render() {
        return (
            <div className="boardBox">
                <p className="boardTitle">{this.titleKR}</p>
                <hr />
                <div className="boardContents">
                    {
                        // this.dummy.map( (post, index) => {
                        //     return <p key={index}>{post.title} <span className="board_date">{post.board_date}</span> <span className="board_vcnt">{post.board_vcnt}</span> </p>
                        // })

                        this.dummy.map( (post, index) => <a className="boardPost" href="#" key={index}>{post.title} <span className="board_date">{post.board_date}</span></a>)
                    }
                </div>
            </div>
        )
    }
}

export default MainBoard;