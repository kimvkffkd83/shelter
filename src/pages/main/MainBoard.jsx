import React, {Component, useEffect} from "react";
import Board from '../../api/Board.jsx';
import Main from "../../api/Main.jsx";

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
                <a href="#" className="main__board__title">{this.state.titleKR}</a>
                <hr className="main__board__line"/>
                <div className="main__board__contents">
                    {
                        this.state.boardRows.length === 0 ?
                            <span className="main__post__none">게시글이 없습니다</span> :
                            this.state.boardRows.map( (post, index) => (
                                <a className="main__post" href="#" key={index}>
                                    <span className="main__post-title text-overflow">
                                        {this.props.title == 'notice' ?
                                            '' :
                                            <span className="main__post-status"> {post.st == 0 ? "[입양]" : "[임시보호]"}</span>
                                        }{post.title}</span>
                                    <span className="main__post-date">{post.date}</span>
                                </a>

                            ))
                    }
                </div>
            </div>
        )
    }

    componentDidMount() {
        //공지사항 데이터
        Main.list(this.props.title)
            .then((res) => {
                this.setState({boardRows: res})
            });
    }
}

export default MainBoard;