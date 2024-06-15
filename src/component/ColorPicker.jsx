import Color from '../jsons/Color.json'
const ColorPicker = ({picked,setPickedColor})=>{
    const handleToggle = (e) => {
        const target = e.target
        const no = target.dataset.no;
        const code = target.dataset.code;
        console.log("picked",picked);
        console.log("picked",no);
        console.log("picked",code);
        if(picked.includes(no)){
            setPickedColor((prev => prev.filter((c) => c !== no)))
            target.style=`border-color:${code}; background-color:#ffffff`;
        }else{
            setPickedColor((prev => [...prev, no]))
            target.style=`border-color:${code}; background-color:${code}`;
        }
    };

    return(
        <>
            {
                Color.map((c, idx) => (
                    <span key={idx} className="color_chip" style={{borderColor:c.code}}
                          data-no={c.no} data-code={c.code} onClick={handleToggle}></span>
                ))
            }
        </>
    )
}

export default ColorPicker;