import { FC } from 'react'
import { Input } from 'antd'
import useLocalStorage from '../../../useLocalStorage'

const Name: FC<{tabKey: string}> = ({tabKey}) => {
    const [name, setName] = useLocalStorage<string>(tabKey, '');

    return <Input
        placeholder="Basic usage" value={name}
        onChange={e => setName(e.target.value)}
    />
}

export default Name;