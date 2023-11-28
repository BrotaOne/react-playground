import { FC, useRef, useMemo } from 'react'
import { Tabs, Button, message } from 'antd'
import useLocalStorage from '../../../useLocalStorage'
import { TabStateContext } from './state'

export interface ChildrenProps { 
  type?: string;
  onChange?: (value: unknown) => void;
  tabKey: string;
}

type TabItem = {
  label: string;
  key: string;
  type?: string;
  isActive?: boolean;
}

type onAddType = TabItem | false;

export interface TabWithContentProps { 
  // tab content
  Children: FC<ChildrenProps>;
  // 增加 tab 时可返回 tab 配置，配置 tab信息
  onAdd?: () => Promise<onAddType> | onAddType;
  // 删除 tab 时清理数据
  onRemove?: (key: TargetKey) => void;
  defaultTabItems?: TabItem[];
  Slot?: FC;
}

type PositionType = 'left' | 'right';

type TargetKey = React.MouseEvent | React.KeyboardEvent | string;

const OperationsSlot: Record<PositionType, React.ReactNode> = {
  left: <Button className="tabs-extra-demo-button">Left Extra Action</Button>,
  right: <Button>Right Extra Action</Button>,
};

function TabWithContent({ Children, onAdd, onRemove, defaultTabItems, Slot }: TabWithContentProps) {

  const newTabIndex = useRef(0);

  const [tabItems, setItems] = useLocalStorage<TabItem[]>('tab-items', defaultTabItems || []);
  
  const items = useMemo(() => tabItems.map(item => ({
    ...item,
    children: item.isActive ? <Children {...item} tabKey={item.key} /> : <></>,
  })), [tabItems]);
  
  const activeKey = useMemo(() => {
    const key = tabItems?.find(v => v.isActive)?.key;
    if (key) {
      return key;
    }
    if (tabItems?.[0]) {
      const newItems = tabItems.map(v => ({ ...v }));
      newItems[0].isActive = true;
      setItems(newItems);
      return newItems[0].key;
    }
    return undefined;
  }, [tabItems]);

  const setItemsAndSetActiveKey = (items: TabItem[], key: string) => {
    setItems(items.map(v => ({
      ...v,
      isActive: v.key === key,
    })))
  }

  const onChange = (key: string) => {
    setItemsAndSetActiveKey(tabItems, key);
  };
   
  const add = async () => {
    let newActiveKey = `newTab${newTabIndex.current++}`;
    const newPanes = [...tabItems];
    if (onAdd) {
      try {
        const res = await onAdd();
        if (res) { 
          newPanes.push(res);
          newActiveKey = res.key
        } else {
          return;
        }
      } catch (err: any) {
        console.error('add error: ', err);
        message.error(err?.message || err)
        return;
      }
    } else {
      newPanes.push({
        label: 'New Tab',
        key: newActiveKey,
      });
    }
    setItemsAndSetActiveKey(newPanes, newActiveKey);
  };
    
  const remove = (targetKey: TargetKey) => {
    let newActiveKey = activeKey;
    let lastIndex = -1;
    tabItems.forEach((item, i) => {
      if (item.key === targetKey) {
        lastIndex = i - 1;
      }
    });
    const newPanes = tabItems.filter((item) => item.key !== targetKey);
    if (newPanes.length && newActiveKey === targetKey) {
      if (lastIndex >= 0) {
        newActiveKey = newPanes[lastIndex].key;
      } else {
        newActiveKey = newPanes[0].key;
      }
    }
    newActiveKey && setItemsAndSetActiveKey(newPanes, newActiveKey);

    // todo remove 的回调，用于关闭tab时删除数据  
    // 需要调用 children 上的方法，可能只有用 ref useImperativeHandle
    onRemove && onRemove(targetKey);
  };
    
  const handleEdit = (
    targetKey: TargetKey,
    action: 'add' | 'remove'
  ) => { 
    if (action === 'add') {
      add();
    }
    if (action === 'remove') {
      targetKey && remove(targetKey);
    }
  }
  
  const handleTabClick = (activeKey: string) => {
    setItems(tabItems.map(v => ({
      ...v,
      isActive: v.key === activeKey,
    })))
  }

  // useEffect(() => {
  //   if (tabItems?.length === 0) {
  //     add();
  //   }
  // }, [])
      
  return (
    <TabStateContext.Provider value={{ tabItems, setItems }}>
      <Tabs
        type="editable-card"
        activeKey={activeKey}
        items={items}
        onChange={onChange}
        onEdit={handleEdit}
        onTabClick={handleTabClick}
        tabBarExtraContent={OperationsSlot.right}
      />
      {Slot && <Slot />}
    </TabStateContext.Provider>
  );
}

export default TabWithContent
export { TabStateContext };