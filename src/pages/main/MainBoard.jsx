import React, {Component, useEffect} from "react";
import Board from '../../js/board.jsx';

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
            <div className="boardBox">
                <a href="#" className="boardTitle">{this.state.titleKR}</a>
                <hr />
                <div className="boardContents">
                    {
                        this.state.boardRows?.map( (post, index) => {
                            if(index < 6){
                                return (
                                    <a className="boardPost" href="#" key={index}>
                                    <span className="postTitle">
                                        {this.props.title == 'notice' ?
                                            '' : <span className="postSt"> {post.st == 0 ? "[입양]" : "[임시보호]"}</span>
                                        }{post.title}</span>
                                            <span className="postDate">{post.date}</span>
                                        </a>
                                    );
                                }
                            }
                        )
                    }
                </div>
            </div>
        )
    }

    componentDidMount() {
        //공지사항 데이터
        Board.getData(this.props.title)
            .then((res) => {
                this.setState({boardRows: res.data})
            });
    }
}

export default MainBoard;