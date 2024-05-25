import ReactQuill from "react-quill";
import {forwardRef, useMemo, useRef} from "react";

const TextEditor = forwardRef((props,ref)=> {
     console.log("props",props);
     console.log("ref",ref);

     const imageHandeler = ()=>{

     }
     const toolbarOption = [
         ['bold',
         'italic',
         'underline',
         'strike',
         'link'],
         [{ 'list': 'ordered'}, { 'list': 'bullet' },{ 'list': 'check' }],
         ['image'],
    ]

    const modules = useMemo(()=>{
        return{
            toolbar : {
                container : toolbarOption,
                handler : {
                    image : imageHandeler,
                },
            },
        };
    }, []);

    const formats = [
        'bold',
        'italic',
        'underline',
        'strike',
        'link',
        'bullet',
        'list',
        'image',
    ]

    const chkTextLength = ()=> {
        const length = 1000;
        if (ref && ref.current && ref.current.editor.getLength()> length) {
            console.log("text", ref.current.editor.getText())
            ref.current.editor.deleteText(length,length+1)
        }
    }

     return(
        <ReactQuill
            className="post__item__textarea"
            placeholder="내용을 입력하세요"
            thema="snow"
            modules = {modules}
            formats={formats}
            ref={ref}
            defaultValue={props.defaultValue}
            onKeyUp={chkTextLength}
            onKeyDown={chkTextLength}
            onBlur={chkTextLength}
        ></ReactQuill>
    )
});
export default TextEditor;

