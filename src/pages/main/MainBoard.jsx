import React, {Component, useEffect} from "react";
import Board from '../../api/Board.jsx';
import Main from "../../api/Main.jsx";
import {Link} from "react-router-dom";
import cvt from "../../js/converter.js";

class MainBoard extends Component{
    constructor(props) {
        super(props);

        let titleKR = "";
        if(props.title =="notice") titleKR = "공지사항"
        else titleKR = "입양/임시보호후기"

        this.state = {
            titleKR : titleKR,
            boardRows : [],
        }
    }
    render() {
        return (
            <div className="main__board__container">
                <Link to={'info/'+this.props.title} className="main__board__title" >{this.state.titleKR}</Link>
                <hr className="main__board__line"/>
                <div className="main__board__contents">
                    {
                        this.state.boardRows.length === 0 ?
                            <span className="main__post__no-data">게시글이 없습니다.</span> :
                            this.state.boardRows.map( (post, index) => (
                                <Link to={'info/'+this.props.title} state={{"boardNo":post.boardNo}} className="main__post" key={index}>
                                    <span className="main__post-title text-overflow">
                                        {
                                            this.props.title == 'notice' ?
                                                '' :
                                                <span className="main__post-status">[{cvt.adtType(post.st)}]</span>
                                        }{post.title}</span>
                                    <span className="main__post-date">{post.date}</span>
                                </Link>
                        ))
                    }
                </div>
            </div>
        )
    }

    componentDidMount() {
        //공지사항 데이터
        Main.boardList(this.props.title)
            .then((res) => {
                console.log(res);
                this.setState({boardRows: res[0]})
            });
    }
}

export default MainBoard;