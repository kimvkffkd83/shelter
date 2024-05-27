import ReactQuill from "react-quill";
import {forwardRef, useMemo, useRef} from "react";
import axios from "axios";
import photoUpload from "../api/photoUpload.jsx";

const TextEditor = forwardRef((props,ref)=> {
     console.log("props",props);
     console.log("ref",ref);

     const imageHandler = ()=>{
         const input = document.createElement("input");
         input.setAttribute("type","file");
         input.setAttribute("accept", "image/*");
         input.click();
         input.addEventListener("change", async (e)=>{
             e.preventDefault();
             const file = input.files?.[0];
             const formData = new FormData();
             formData.append('img', file);
             if(file){
                 photoUpload.upload(formData).then((res) => {
                     try {
                         const editor = ref.current.getEditor();
                         const range = editor.getSelection();
                         editor.insertEmbed(range.index, "image", res.data.url)
                     } catch (error) {
                         alert("에러!")
                     }
                 })
             }
         })
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
                handlers : {
                    image : imageHandler,
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

