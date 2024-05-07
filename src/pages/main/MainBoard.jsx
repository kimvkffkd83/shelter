import React, {Component} from "react";
import axios from "axios";

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
        let boardRows = this.state.boardRows;
        return (
            <div className="boardBox">
                <a href="#" className="boardTitle">{this.state.titleKR}</a>
                <hr />
                <div className="boardContents">
                    {
                        boardRows.map( (post, index) => (
                            <a className="boardPost" href="#" key={index}>
                                <span className="postTitle">
                                    {this.props.title == 'notice' ?
                                        '' : <span className="postSt"> {post.st == 0 ? "[입양]" : "[임시보호]"}</span>
                                    }{post.title}</span>
                                <span className="postDate">{post.date}</span>
                            </a>
                        ))
                    }
                </div>
            </div>
        )
    }

    componentDidMount() {
        this.renderMainBoards();
    }

    renderMainBoards = async ()=>{
        try {
            const res =
                await axios.get('http://localhost:4000/main/'+this.props.title)
                    .then((res) => {
                        this.setState({
                            boardRows : res.data,
                        });
                    });
        } catch (err){
            console.log(err);
        }
    }
}

export default MainBoard;