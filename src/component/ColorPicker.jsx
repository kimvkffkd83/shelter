import Color from '../jsons/Color.json'
import {useEffect, useState} from "react";
const ColorPicker = ({initialSelectedColors })=>{
    const [selectedColors, setSelectedColors] = useState([]);

    useEffect(() => {
        if (initialSelectedColors) {
            setSelectedColors(initialSelectedColors);
        }
    }, [initialSelectedColors]);
    const toggle = (e,name)=>{
        if(e.target.classList.contains(`__${name}-selected`)){
            e.target.classList.remove(`__${name}-selected`);
        }else{
            e.target.classList.add(`__${name}-selected`);
        }
    }
    return(
        <>
            {
                Color.map((color, idx) => {
                    const isSelected = selectedColors.includes((Number(idx)+1)+'');
                    return(
                        <span key={idx}
                              className={`color_chip __${color.name} ${isSelected ? `__${color.name}-selected` : ''}`}
                              onClick={ (e)=>toggle(e,color.name) }>
                        </span>
                    )
                })
            }
        </>
    )
}

export default ColorPicker;