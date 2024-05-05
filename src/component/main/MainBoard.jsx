import React, {Component} from "react";
import axios from "axios";

class MainBoard extends Component{
    constructor(props) {
        super(props);
        console.log("constructor, this.state",this.state)
        this.title = props.title
        this.titleKR = "";

        if(this.title =="notice") this.titleKR = "공지사항"
        else this.titleKR = "입양/임시보호후기"
    }
    render() {
        let notices = this.state == null ? [] : this.state.notices;
        let feedbacks = this.state == null ? [] : this.state.feedbacks
        console.log("render => notices, feedbacks",notices, feedbacks);
        return (
            <div className="boardBox">
                <a href="#" className="boardTitle">{this.titleKR}</a>
                <hr />
                <div className="boardContents">
                    { this.title == 'notice' ?
                        notices.map( (post, index) => (
                            <a className="boardPost" href="#" key={index}>
                                <span className="postTitle">{post.title}</span>
                                <span className="postDate">{post.date}</span>
                             </a>
                        ))
                        :
                        feedbacks.map( (post, index) => (
                            <a className="boardPost" href="#" key={index}>
                                <span className="postTitle">
                                    <span className="postSt"> {post.st==0?"[입양]":"[임시보호]"}</span>{post.title}
                                </span>
                                <span className="postDate">{post.date}</span>
                            </a>
                        ))
                    }
                </div>
            </div>
        )
    }

    componentDidMount() {
        this.renderNotices();
    }

    renderNotices = async ()=>{
        try {
            const res =
                await axios.all([
                    axios.get('http://localhost:4000/main/notice'),
                    axios.get('http://localhost:4000/main/feedback')
                    ]
                ).then(
                    axios.spread((res1, res2) =>{
                        const nocices = res1.data;
                        const feedbacks = res2.data;
                        console.log("renderNotices, notices", nocices);
                        console.log("renderNotices, feedbacks", feedbacks);
                        this.setState({
                            notices : nocices,
                            feedbacks : feedbacks
                        });
                    })
                )
        } catch (err){
            console.log(err);
        }
    }
}

export default MainBoard;