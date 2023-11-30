import { useContext, useEffect } from 'react'
import { Modal, Select, message } from 'antd'
import TabWithContent, {type TabWithContentProps, TabStateContext} from './Tab';
import Children from './Children';

const Slot = () => {
  const {tabItems, setItems} = useContext(TabStateContext);
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
  useEffect(add, []);

  return <></>
}

const onAdd: TabWithContentProps['onAdd'] = async () => {
  const key = Math.random().toString(36).substring(2);
  let type: string | undefined = undefined;
    const data = await new Promise(res => {
      Modal.confirm({
        title: 'Confirm',
        onOk: (close) => {
          if (type) {
            close();
            res(true);
          } else {
            message.error('请选择类型')
          }
        },
        onCancel: () => {
          res(false);
        },
        content: (
          <div>
            <div>类型选择: </div>
            <Select
              style={{ width: 200 }}
              options={[1, 2, 3].map(v => ({ value: v, label: v }))}
              onChange={v => type = v}
            />
        </div>)
      });
      return;
    });
  
    return !!data && {
      key: key,
      label: 'Tab ' + key, 
      type,
    }
}

function TabPage() {
  
  return (
    <>
      <TabWithContent
        Children={Children}
        onAdd={onAdd}
        // Slot={Slot}
      />
    </>
  )
}

export default TabPage
