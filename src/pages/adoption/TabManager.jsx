import React, {useEffect, useState} from "react";
import {ReactSortable} from "react-sortablejs";
import Adopt from "../../api/Adopt.jsx";
const TabManager = ()=>{
    const [list, setList] = useState([]);
    const [tempList, setTempList] = useState([]);
    const [reset, setReset] = useState(false);
    const [isEditable, setIsEditable] = useState(false);

    useEffect(() => {
        Adopt.list().then((res)=> {
            setList(res);
            setTempList(res);
        });
    }, [reset]);

    const showStaticList = ()=>{
        return(
            <>
                {
                    list.map((item) => (
                        <div key={item.tabOrder}>{item.title}</div>
                    ))
                }
            </>
        )
    }

    const showDynamicList = () => {
        return(
            <ReactSortable list={list} setList={setList}>
                {
                    list.map((item) => (
                        <div key={item.tabOrder}>
                            <button className="btn__adm__icon btn__adm__write">
                                <span className="material-symbols-outlined">drag_pan</span>
                            </button>
                            {item.title}</div>
                    ))
                }
            </ReactSortable>
        )
    };

    const changeEditable = () => {
        if(JSON.stringify(list)!==JSON.stringify(tempList)){
            if(window.confirm('현재 상태가 저장되지 않습니다. 정말 취소하시겠습니까?')){
                setReset((prevState) => !prevState);
            }
        }
        setIsEditable((prevState) => !prevState);
    }

    const orderSave = ()=>{
        const filtered = [];
        list.filter((item) =>{
            filtered.push({title:item.title, tabOrder:item.tabOrder});
        })
        Adopt.list().then((res)=> {
            console.log(JSON.stringify(res));
            console.log(JSON.stringify(filtered));
            //같으면 저장할 필요 없음
            if(JSON.stringify(res)===JSON.stringify(filtered)){
                console.log("? 저장 노노")
                setIsEditable((prevState) => !prevState);
            }else{
                console.log("! 저장 해야함")
            }
        });
    }

    return (
        <div className="tab__manage__box">
            <div className="tab__manage__list">
                <div className="box__adm__btns">
                    <button className="btn__adm__icon btn__adm__write">
                        <span className="material-symbols-outlined">variable_add</span>
                    </button>
                    <button className="btn__adm__icon btn__adm__write" onClick={changeEditable}>
                        <span className="material-symbols-outlined">swap_vert</span>
                    </button>
                </div>
                <div id="target" className="tab__manage__content">
                    {
                        isEditable?
                            showDynamicList():
                            showStaticList()
                    }
                </div>
                <div>
                    {
                        isEditable &&
                            <button className="btn__adm__icon btn__adm__write" onClick={orderSave}>
                                <span className="material-symbols-outlined">save</span>
                            </button>
                    }

                </div>
            </div>
            <div className="tab__manage__view"></div>
        </div>
    )

}
export default TabManager;