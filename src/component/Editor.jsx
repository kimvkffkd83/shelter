import ReactQuill, {Quill} from "react-quill";
import {forwardRef, useMemo} from "react";
import photoUpload from "../api/photoUpload.jsx";
import { ImageActions } from '@xeger/quill-image-actions';
import { ImageFormats } from '@xeger/quill-image-formats';
Quill.register('modules/imageActions', ImageActions);
Quill.register('modules/imageFormats', ImageFormats);

const TextEditor = forwardRef((props,ref)=> {
     const maxFileSize = 10000000;

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
                 if(file.size >= maxFileSize){
                     alert("10MB 이하의 이미지만 업로드 할 수 있습니다.");
                     return;
                 }
                 const editor = ref.current.getEditor();
                 const contents = editor.getContents();
                 const imageCount = contents.ops.filter(op => op.insert && op.insert.image).length;
                 if (imageCount >= 5) {
                     alert("이미지는 최대 5개까지 추가할 수 있습니다.");
                     return;
                 }

                 photoUpload.upload(props.route,formData).then((res) => {
                     const range = editor.getSelection();
                     editor.insertEmbed(range.index, "image", res.urls)
                 }).catch ((error) =>{
                     alert(error.message);
                 })
             }
         })
     }
     const toolbarOption = [
         [{'align':[]}, {'color':[]}, {'background':[]}],
         [{ 'size': ['small','large', 'huge'] }],
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
        'width',
        'size'
    ]

    //모듈화 하기 까다로워서 chk 로직 그대로 둠
    const lengthLimit = 1000;
    const chkTextLength = ()=> {
        if (ref && ref.current && ref.current.editor.getLength()> lengthLimit) {
            ref.current.editor.deleteText(lengthLimit,lengthLimit+1)
        }
    }

     return(
         <>
             <ReactQuill
                 className="post__item__editor"
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

