import { Transforms, type BaseEditor } from "slate";

const insertImage = (editor, url) => {
    const text = { text: '' }
    const image: any = { type: 'image', url, children: [text] }
    Transforms.insertNodes(editor, image)
  }

export const withImages = (editor: BaseEditor) => {
    const { insertData, isVoid, deleteBackward } = editor;

    editor.isVoid = element => {
        return element.type === 'image' ? true : isVoid(element)
    }

    editor.insertData = data => { 
        const text = data.getData('text/plain')
        const { files } = data
        console.log('files', text, files, insertData);
        if (files && files.length > 0) {
            for (const file of files) {
                const reader = new FileReader()
                const [mime] = file.type.split('/')
                if (mime === 'image') {
                    reader.addEventListener('load', () => {
                        const url = reader.result
                        insertImage(editor, url)
                    })
                    reader.readAsDataURL(file)
                }
            }
        // } else if (isImageUrl(text)) {
        //     insertImage(editor, text)
        } else {
            insertData(data)
        }
        // insertData(data);
    }

    editor.deleteBackward = (...args) => { 
        console.log('deleteBackward', args, editor)
        deleteBackward(...args);
    }
    return editor;
}