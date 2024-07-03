import React, {useEffect, useState} from "react";
import TabManager from "./TabManager.jsx";
import Adopt from "../../api/Adopt.jsx";
import dp from "dompurify";
import fileDownload from "../../api/fileDownload.jsx";
function Adoption() {
    const isAdmin = true;

    const [activeTab, setActiveTab] = useState(1);

    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };

    //type 0 : view, type 1 : write, type 2 : update
    const [isEditable, setIsEditable] = useState({editable : false, type : 0});
    const [list, setList] = useState([]);

    useEffect(() => {
        Adopt.tabList().then((res)=> {
            setList(res);
        });
    } ,[isEditable]);

    useEffect(() => {
        const box = document.getElementById("tabContent")
        const text = document.getElementById("editedText")
        if(box && text) box.style.height = text.clientHeight + 'px';
    }, [activeTab, isEditable]);

    const write = ()=>{
        setIsEditable({"editable" : true, "type" : 1});
    }
    const setEditState = (childState) =>{
        setIsEditable(childState);
    }

    const downloadFile = (fileName)=> {
        fileDownload.download(fileName).then((res) => {
            fetch(res.url, {method: 'GET'})
                .then((res) => {
                    return res.blob();
                })
                .then((blob) => {
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = fileName+'.hwp';
                    document.body.appendChild(a);
                    a.click();
                    setTimeout((_) => {
                        window.URL.revokeObjectURL(url);
                    }, 60000);
                    a.remove();
                })
                .catch((err) => {
                    console.error('err: ', err);
                });
        })
    }

    return (
        <>
            {(isEditable.editable) ?
                <TabManager setEditState={setEditState}/>
                // <Write  post={post} data={[]} isEditable={isEditable} changeEditable={setEditState} />
                :
                <>
                    <>
                        <h3>양식 다운로드</h3>
                        <ul>
                            <li>
                                <label className="file__title" htmlFor="download1">입양 설문지(개) : </label>
                                <button className="btn__download" id="download1" onClick={()=>downloadFile('adoptFormDog')}>다운로드</button>
                            </li>
                            <li>
                                <label className="file__title" htmlFor="download2">입양 설문지(고양이) : </label>
                                <button className="btn__download" id="download2" onClick={()=>downloadFile('adoptFormCat')}>다운로드</button>
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
                    </div>
                    <div id="tabContent" className="tab__content">
                        <div id="editedText" className="edited_text">
                            {
                                list.filter(tab => tab.no === activeTab).map(tab => (
                                    <div key={tab.no} className="custom_editor clearfix w80"
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