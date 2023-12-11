import { FC, ReactNode } from 'react'
import { useSlate } from 'slate-react'
import CustomCommand from '../CustomCommand'
import c from '../index.module.css'

const MarkButton: FC<{ format: string; icon?: ReactNode}> = ({ format, icon }) => { 
    const editor = useSlate();
    const active = CustomCommand.isMarkActive(editor, format);

    return (
        <button
            className={[
                c.button,
                active ? c.active : ''
            ].join(' ')}
            onMouseDown={evt => {
                evt.preventDefault()
                CustomCommand.toggleMark(editor, format)
            }}
        >
            {icon}
        </button>
    )
}

const BlockButton: FC<{ format: string; icon?: ReactNode}> = ({ format, icon }) => { 
    const editor = useSlate();
    const active = CustomCommand.isBlockActive(editor, format);
    return (
        <button
            className={[
                c.button,
                active ? c.active : ''
            ].join(' ')}
            onMouseDown={evt => {
                evt.preventDefault()
                CustomCommand.toggleBlock(editor, format)
            }}
        >
            {icon}
        </button>
    )
}

const Toolbar = () => { 
    
    return (
        <div className={c.toolbar}>
            <MarkButton format="bold" icon="B" />
            <MarkButton format="italic" icon="I" />
            <MarkButton format="underline" icon="U" />
            <BlockButton format="code" icon="<>" />
        </div>
    );
}

export default Toolbar;