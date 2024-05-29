import ReactQuill, {Quill} from "react-quill";
import {forwardRef, useMemo} from "react";
import photoUpload from "../api/photoUpload.jsx";
import { ImageActions } from '@xeger/quill-image-actions';
import { ImageFormats } from '@xeger/quill-image-formats';
Quill.register('modules/imageActions', ImageActions);
Quill.register('modules/imageFormats', ImageFormats);

const TextEditor = forwardRef((props,ref)=> {
     const imageHandler = ()=>{
         const input = document.createElement("input");
         input.setAttribute("type","file");
         input.setAttribute("accept", "image/*");
         input.click();
         input.addEventListener("change", async (e)=>{
             e.preventDefault();
             const route = 'notice'
             const file = input.files?.[0];
             const formData = new FormData();
             formData.append('img', file);
             if(file){
                 if(file.size >= 10000000){
                     alert("10mb 이하의 이미지만 업로드 할 수 있습니다.");
                     return;
                 }
                 const editor = ref.current.getEditor();
                 const contents = editor.getContents();
                 const imageCount = contents.ops.filter(op => op.insert && op.insert.image).length;
                 if (imageCount >= 5) {
                     alert("이미지는 최대 5개까지 추가할 수 있습니다.");
                     return;
                 }

                 photoUpload.upload(route,formData).then((res) => {
                     try {
                         const range = editor.getSelection();
                         editor.insertEmbed(range.index, "image", res.data.url)
                     } catch (error) {
                         alert("이미지 업로드 중 에러가 발생했습니다. 관리자에게 문의하세요.")
                     }
                 })
             }
         })
     }
     const toolbarOption = [
         [{'align':[]}, {'color':[]}, {'background':[]}],
         ['bold',
         'italic',
         'underline',
         'strike',
         'link'],
         [{ 'list': 'ordered'}, { 'list': 'bullet' },{ 'list': 'check' }],
         [{'indent':'-1'},{'indent':'+1'},],
         ['image'],
    ]

    const modules = useMemo(()=>{
        return{
            imageActions: {},
            imageFormats: {},
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
        'list',
        'bullet',
        'indent',
        'image',
        'align',
        'color',
        'background',
        'float',
        'height',
        'width'
    ]

    const chkTextLength = ()=> {
        const length = 1000;
        if (ref && ref.current && ref.current.editor.getLength()> length) {
            console.log("text", ref.current.editor.getText())
            ref.current.editor.deleteText(length,length+1)
        }
    }

     return(
         <>
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
         </>

    )
});
export default TextEditor;

