import { theme, type ThemeConfig } from 'antd'

const themeMap: Record<string, ThemeConfig> = {
    dark: {
        algorithm: theme.darkAlgorithm,
        token: {
            colorPrimary: 'pink',
            colorText: 'yellow',
        },
    },
    light: {
        algorithm: theme.defaultAlgorithm,
        token: {
            colorPrimary: 'red',
        },
    }
};

export default themeMap;