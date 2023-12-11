import { useState, useCallback } from 'react'
import { createEditor, Transforms, Node, BaseEditor, Descendant } from 'slate'
import {
    Slate, Editable, withReact, ReactEditor, useSlateStatic,
    type RenderElementProps, type RenderLeafProps, 
} from 'slate-react'
import { withHistory } from 'slate-history'
import Toolbar from './Toolbar'
import { withImages } from './images'
import CustomCommand from './CustomCommand'
import c from './index.module.css'

const initialValue = [
    {
        type: 'paragraph',
        children: [
            { text: '我是一行文字, ' },
            { text: 'hello world', bold: true },
        ]
    },
    // 第二，数据中包含代码块
    {
        type: 'code',
        children: [{ text: 'hello world' }]
    },
    {
        type: 'a',
        url: 'https://www.baidu.com',
        children: [{ text: '百度' }]
    }
];

const getInitialValue:() => Descendant[] = () => { 
    try {
        const content = localStorage.getItem('content')
        if (content) {
            return JSON.parse(content)
        }
    } catch (err) { 
        console.error(err);
    }
    return initialValue;
}

// 第一，定义两个基础组件，分别用来渲染文本和代码块
// 默认文本段落
function DefaultElement(props: RenderElementProps) {
    return <p {...props.attributes}>{props.children}</p>
}

// 渲染代码块
function CodeElement(props: RenderElementProps) {
    return <pre {...props.attributes}>
        <code>{props.children}</code>
    </pre>
}

const renderLeaf = (props: RenderLeafProps) => {
    const { attributes, children, leaf } = props
    const { text, ...rest } = leaf
  
    return (
      <span {...attributes} className={Object.keys(rest).map(k=> c[k]).join(' ')}>
        {children}
      </span>
    )
}

const ImageElement = (props: RenderElementProps) => {
    const { element } = props
    const editor = useSlateStatic()
    
    const deleteImage = () => {
        const path = ReactEditor.findPath(editor, element);
        Transforms.removeNodes(editor, { at: path });
    }
  
    return (
        <div>
            <img src={element.url} />
            <button onClick={deleteImage}>删除</button>
     </div>
    )
}

// Define a serializing function that takes a value and returns a string.
export const serialize = (value: any) => {
  return (
    value
      // Return the string content of each paragraph in the value's children.
      .map(n => Node.string(n))
      // Join them all with line breaks denoting paragraphs.
      .join('\n')
  )
}

// Define a deserializing function that takes a string and returns a value.
export const deserialize = (string: string) => {
  // Return a value array of children derived by splitting the string.
  return string.split('\n').map(line => {
    return {
      children: [{ text: line }],
    }
  })
}
  

export type EmptyText = {
    text: string;
}

const SlatePage = () => {
    const [editor] = useState(() => withHistory(withImages(withReact(createEditor()))));

    const renderElement = useCallback((
        props: RenderElementProps
    ) => {
        if (!('type' in props.element)) {
            return <DefaultElement {...props} />;
        }
        switch(props.element.type) {
            case 'code':
                return <CodeElement {...props} />
            case 'image':
                return <ImageElement {...props} />;
            case 'a':
                return <a {...props} href={props.element.url}>{props.children}</a>;
            default:
                return <DefaultElement {...props}/>
        }
    }, [])

    const insertImage = (editor: BaseEditor, url: string) => {
        const text = { text: '' }
        const image: {
            type: 'image'
            url: string
            children: EmptyText[]
          }= { type: 'image', url, children: [text] }
        Transforms.insertNodes(editor, image)
    }

    const handleKeyDown: React.KeyboardEventHandler<HTMLDivElement> = evt => {
        if(!evt.ctrlKey) {
            return;
        }
        console.log('handleKeyDown', evt);
        switch (evt.key) { 
            case '`': { 
                evt.preventDefault();
                CustomCommand.toggleBlock(editor, 'code');
                break
            }
            case 'b': { 
                evt.preventDefault();
                CustomCommand.toggleMark(editor, 'bold');
                break;
            }
            case '7': {
                if (evt.shiftKey) {
                    evt.preventDefault();
                    editor.insertText('and');
                }
                break;
            }
        }
    }

    return (
        <div className={c.container}>
            <Slate
                editor={editor}
                initialValue={getInitialValue()}
                onChange={(v) => {
                    // console.log('onChange', v);
                    console.log('editor', editor.history);
                }}
                onValueChange={(v) => {
                    localStorage.setItem('content', JSON.stringify(v));
                }}
            >
                <Toolbar />
                <Editable
                    renderElement={renderElement}
                    renderLeaf={renderLeaf}
                    onKeyDown={handleKeyDown}
                />
                <div>123</div>
            </Slate>
            {/* <div
                // role="textbox"
                // aria-multiline="true"
                contentEditable
                onInput={(v)=>console.log('onInput', v)}
            >
                456
            </div> */}
            <button onClick={() => insertImage(editor,'/canvas.png')}>添加</button>
        </div>
    )
  }

export default SlatePage;