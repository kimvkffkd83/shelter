import '../css/Main.css';
import React from "react";
function Main(){
    return (
        <div className={"wrap"}>
            <header>
                <div className={"logo"}>
                    <a href="#">
                        <img src="" alt={"asdf"}/>
                    </a>
                </div>
                <nav>
                    <ul>
                        <li>센터소개
                            <ul>
                                <li>센터소개</li>
                                <li>공지사항</li>
                                <li>찾아오시는 길</li>
                            </ul>
                        </li>
                        <li>보호공고</li>
                        <li>실종신고</li>
                        <li>입양문의
                            <ul>
                                <li>입양신청</li>
                                <li>임시보호신청</li>
                                <li>입양/보호후기</li>
                            </ul>
                        </li>
                        <li>자원봉사
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
            <main>
                <div className={"slide"}>
                    <article>
                        <img src="" alt={"asdf"}/>
                        <h1>공고중</h1>
                    </article>
                    <article>
                        <img src="" alt={"asdf"}/>
                        <h1>입양가능</h1>
                    </article>
                    <article>
                        <img src="" alt={"asdf"}/>
                        <h1>임시보호</h1>
                    </article>
                    <article>
                        <img src="" alt={"asdf"}/>
                        <h1></h1>
                    </article>
                </div>
            </main>
            <div className={"contents"}>
                <div className={"search"}>
                    <h1> 빠른 조건 검색 </h1>
                </div>
                <div className={"boards"}>
                    <div className={"notice"}>
                        <h1> 공지사항 </h1>

                    </div>
                    <div className={"feedback"}>
                        <h1> 입양/보호후기 </h1>
                    </div>
                </div>
            </div>
            <div className={"statistics"}>
                <h1> 보호소 통계 </h1>

            </div>
            <footer>
                 <h1>푸터</h1>
            </footer>
        </div>
    );
}

export default Main;