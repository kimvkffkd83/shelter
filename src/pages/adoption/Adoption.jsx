import React, {useRef, useState} from "react";
import TabManager from "./TabManager.jsx";
function Adoption() {
    const isAdmin = true;

    const [activeTab, setActiveTab] = useState('Tab1');
    const contentsRef = useRef()

    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };

    //type 0 : view, type 1 : write, type 2 : update
    const [isEditable, setIsEditable] = useState({editable : false, type : 0});
    const [post, setPost] = useState([]);

    const write = ()=>{
        setIsEditable({"editable" : true, "type" : 1});
    }
    const setEditState = (childState) =>{
        setIsEditable(childState);
    }

    return (
        <>
            {(isEditable.editable) ?
                <TabManager data={[]}/>
                // <Write  post={post} data={[]} isEditable={isEditable} changeEditable={setEditState} />
                :
                <>
                    {
                        isAdmin &&
                        <div>
                            <button className="btn__adm__icon btn__adm__write" onClick={write}>
                                <span className="material-symbols-outlined">bookmark_manager</span>
                            </button>
                        </div>
                    }
                    <div className="tab__header">
                        <button onClick={() => handleTabClick('Tab1')}>입양과정(인터넷)</button>
                        <button onClick={() => handleTabClick('Tab2')}>입양과정(전화)</button>
                        <button onClick={() => handleTabClick('Tab3')}>Tab 3</button>
                    </div>
                    <div className="tab__content">
                        {activeTab === 'Tab1' &&
                            <div>
                                <div className=""></div>
                                <div className=""></div>
                            </div>
                        }
                        {activeTab === 'Tab2' && <div>Content of Tab 2</div>}
                        {activeTab === 'Tab3' && <div>Content of Tab 3</div>}
                    </div>
                    <>
                        <span><strong>양식 다운로드</strong></span>
                        <ul>
                            <li>
                                <span className="file__title"></span>
                                <button className="btn__download"></button>
                            </li>
                        </ul>
                    </>
                </>
            }
        </>
    )

}

export default Adoption;