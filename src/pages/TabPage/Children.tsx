import { FC, useContext } from 'react'
import {FormChild, Name} from './components'
import { type ChildrenProps, TabStateContext } from './Tab'
import {Select, Button} from 'antd'

const ChangeType: FC<{
    onChange: (type: string) => void,
    defaultValue?: string
}> = ({ onChange, defaultValue }) => {
    const options = [1, 2, 3].map(v => ({ value: v.toString(), label: v }));
    return (
        <div>
            修改类型: 
            <Select
                style={{ width: 200 }}
                options={options}
                defaultValue={defaultValue || options?.[0]?.value}
                onChange={onChange}
            />
        </div>
    )
}


const Children: FC<ChildrenProps> = ({ type, onChange, tabKey, ...props }) => {
    const { tabItems, setItems } = useContext(TabStateContext);

    const changeType = (type: string) => {
        setItems(tabItems.map(v => ({
            ...v,
            type: v.key === tabKey? type : v.type,
        })))    
    }

    const add = () => {
        const newItems = tabItems.map(v => ({ ...v, isActive: false }));
        newItems.push({
            label: '子组件加的tab',
            key: Math.random().toString(36).substring(2),
            type: [1, 2, 3][Math.floor(Math.random() * 3)]?.toString(),
            isActive: true,
        })
        setItems(newItems);
    }

    if (type == '1') {
        console.log('Children render')
        return (
            <div>
                <Button onClick={add} >增加tab</Button>
                <ChangeType onChange={changeType} defaultValue={type} />
                <Name {...props} tabKey={tabKey} />
            </div>
        )
    }

    if(type == '2') {
        return (
            <div>
                <ChangeType onChange={changeType} defaultValue={type} />
                <FormChild {...props} tabKey={tabKey} />
            </div>
        )
    }

    return (
        <div>
            <ChangeType onChange={changeType} defaultValue={type} />
            `Content of Tab Pane ${tabKey}`;
        </div>
    )
}

export default Children;