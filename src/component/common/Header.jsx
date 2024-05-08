import React from "react";
import {Link} from "react-router-dom";

function Header (){
    return (
        <>
            <div className="toolbar"></div>
            <header>
                <div className={"logo"}>
                    {<Link to="/" />}
                </div>
                <nav>
                    <ul>
                        <li> {<Link to='/info'>센터소개</Link>}
                            <ul>
                                <li>센터소개</li>
                                <li>공지사항</li>
                                <li>찾아오시는 길</li>
                            </ul>
                        </li>
                        <li><a href="#"><>보호공고</></a></li>
                        <li><a href="#"><>실종신고</></a></li>
                        <li><a href="#"><>입양문의</></a>
                            <ul>
                                <li>입양신청</li>
                                <li>임시보호신청</li>
                                <li>입양/보호후기</li>
                            </ul>
                        </li>
                        <li><a href="#"><>자원봉사</></a>
                            <ul>
                                <li>봉사안내</li>
                                <li>봉사신청</li>
                                <li>연계신청</li>
                                <li>봉사문의</li>
                            </ul>
                        </li>
                    </ul>
                </nav>
            </header>
        </>
    )
}

export default Header;