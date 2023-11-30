import { useState } from 'react'
import { ConfigProvider, Select, App, Layout, Space } from 'antd'
import Content from './Content'
import themeMap from './themeMap'
import './index.css'

const AntdThemePage = () => {
    const [themeName, setTheme] = useState<keyof typeof themeMap>('light');
    
    return (
        <ConfigProvider theme={themeMap[themeName]}>
            <App>
                <Layout className="theme-page" style={{ padding: 20 }}>
                    <Space>
                        主题切换: 
                        <Select
                            value={themeName}
                            style={{ width: 200 }}
                            onChange={setTheme}
                            options={[
                                { label: '普通主题', value: 'light' },
                                { label: '黑暗主题', value: 'dark' },
                            ]}
                        />
                    </Space>
                    <Content />
                </Layout>
            </App>
        </ConfigProvider>
    );
}

export default AntdThemePage