import { useState } from 'react'
import { Select } from 'antd';
import { TabPage, CanvasPage, AntdThemePage, ThreeJSPage, WebGLPage } from './pages'
import './App.css'

const Components = [
  TabPage, CanvasPage, AntdThemePage, ThreeJSPage, WebGLPage
];

const options = Array(Components.length).fill(0)
  .map((_, idx) => idx)
  .map(v => ({ value: v, label: Components[v].name }));

function App() {
  const [idx, setIdx] = useState<number>(4);
  const Com = Components[idx];

  return (
    <>
      <Select
        value={idx}
        style={{ width: 200 }}
        options={options}
        onChange={setIdx}
      />
      {Components[idx] && <Com />}
    </>
  )
}

export default App
