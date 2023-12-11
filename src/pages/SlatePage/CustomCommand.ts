import { Editor, Transforms, Element, type BaseEditor } from 'slate'

const CustomCommand = {
    isMarkActive(editor: BaseEditor, format: string) {
        const marks = Editor.marks(editor)
        return marks ? marks[format] === true : false
    },
    toggleMark(editor: BaseEditor, format: string) {
        const isActive = CustomCommand.isMarkActive(editor, format);
        if (isActive) {
            Editor.removeMark(editor, format)
        } else {
            Editor.addMark(editor, format, true);
        }
    },
    isBlockActive(editor: BaseEditor, format: string) {
        const [match] = Editor.nodes(editor, {
            match: n => n.type === format,
        })
        return !!match
    },
    toggleBlock(editor: BaseEditor, format: string) {
        const isActive = CustomCommand.isBlockActive(editor, format);
        Transforms.setNodes(
            editor,
            { type: isActive ? null : format },
            { match: n => Element.isElement(n) && Editor.isBlock(editor, n) }
        )
    }
};

export default CustomCommand;