import Select from "../jsons/Select.json"
const Filter = ({id, selected, onChange})=>{

    let item;
    Select.map((s,idx) =>{
        if(id === s.id) {
            item = s;
        }
    })

    return (
        <div className="filter__item">
            <label htmlFor={id} className="filter__label">{item?.label}:</label>
            <select id={id} className="filter__select" onChange={onChange}>
                {item?.options.map((option, idx) => (
                    <option key={idx} value={option.value}>{option.text}</option>
                ))}
            </select>
        </div>
    )
}
export default Filter;