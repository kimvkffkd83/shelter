import React, {useEffect, useRef, useState} from "react";
import TabManager from "./TabManager.jsx";
import Adopt from "../../api/Adopt.jsx";
import dp from "dompurify";
function Adoption() {
    const isAdmin = true;

    const [activeTab, setActiveTab] = useState(1);
    const contentsRef = useRef()

    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };

    //type 0 : view, type 1 : write, type 2 : update
    const [isEditable, setIsEditable] = useState({editable : false, type : 0});
    const [list, setList] = useState([]);

    useEffect(() => {
        Adopt.list().then((res)=> {
            setList(res);
        });
    } ,[]);

    const write = ()=>{
        setIsEditable({"editable" : true, "type" : 1});
    }
    const setEditState = (childState) =>{
        setIsEditable(childState);
    }

    return (
        <>
            {(isEditable.editable) ?
                <TabManager setEditState={setEditState}/>
                // <Write  post={post} data={[]} isEditable={isEditable} changeEditable={setEditState} />
                :
                <>
                    <>
                        <span><strong>양식 다운로드</strong></span>
                        <ul>
                            <li>
                                <span className="file__title"></span>
                                <button className="btn__download"></button>
                            </li>
                        </ul>
                    </>
                    {
                        isAdmin &&
                        <div>
                            <button className="btn__adm__icon btn__adm__write" onClick={write}>
                                <span className="material-symbols-outlined">bookmark_manager</span>
                            </button>
                        </div>
                    }
                    <div className="tab__header">
                        {
                            list.map((tab, idx) => (
                                <button key={idx}
                                        className={`tab__title${tab.no === activeTab ? ' tab__title__selected' : ''}`}
                                        onClick={() => handleTabClick(tab.no)}>{tab.title}</button>
                            ))
                        }
                        <div className="tab__content">
                            {
                                list.filter(tab => tab.no === activeTab).map(tab => (
                                    <div key={tab.no} className="clearfix"
                                    dangerouslySetInnerHTML={{__html: dp.sanitize(tab.contents)}}/>
                                ))
                            }
                        </div>
                    </div>
                </>
            }
        </>
    )

}

export default Adoption;