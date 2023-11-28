import { useState } from 'react'
import { Select } from 'antd';
import { TabPage, CanvasPage } from './pages'
import './App.css'

function App() {
  const [idx, setIdx] = useState(0);

  return (
    <>
      <Select
        value={idx}
        style={{ width: 200 }}
        options={[0, 1].map(v => ({ value: v, label: v }))}
        onChange={setIdx}
      />
      {idx === 0 && <TabPage />}
      {idx === 1 && <CanvasPage />}
    </>
  )
}

export default App
