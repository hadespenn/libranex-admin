import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ConfigProvider, App as AntdApp } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import zhTW from 'antd/locale/zh_TW';
import enUS from 'antd/locale/en_US';
import { I18nProvider, useI18n } from './i18n';
import type { Lang } from './i18n';
// 引入顺序有讲究：Tailwind（全部位于 @layer 内）→ antd reset（未分层，可覆盖
// Tailwind preflight 对 button/table/svg 等基础标签的重置）→ 项目自有样式。
import './styles/tailwind.css';
import 'antd/dist/reset.css';
import './styles/global.css';
import App from './App';

const ANTD_LOCALE: Record<Lang, typeof zhCN> = {
  'zh-CN': zhCN,
  'zh-TW': zhTW,
  en: enUS,
};

function Root() {
  const { lang } = useI18n();
  return (
    <ConfigProvider
      locale={ANTD_LOCALE[lang]}
      theme={{
        token: {
          colorPrimary: '#b8932e',
          colorInfo: '#378add',
          colorSuccess: '#16825d',
          colorWarning: '#b7791f',
          colorError: '#b42318',
          borderRadius: 10,
          fontFamily:
            'Inter, "DM Sans", Arial, "PingFang SC", "Microsoft YaHei", sans-serif',
        },
        components: {
          Select: {
            // 专门针对 Select 组件的属性
            optionSelectedBg: '#e6f4ff',
            activeBorderColor: '#1677ff',
            borderRadius: 16,
            padding: 12, // 修改横向 padding
            colorBorder: '#d9d9d9', // 替换掉那个烦人的灰色细框颜色
            controlOutlineWidth: 0, // 消除选中后的默认发光边框
          },
          Dropdown: {
            // 顶部栏通常用的是 Dropdown
            colorBgElevated: '#ffffff',
            borderRadiusLG: 8,
          },
          Drawer: {
            colorBgElevated: '#ffffff',
          },
        },
      }}
    >
      <AntdApp>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </AntdApp>
    </ConfigProvider>
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <I18nProvider>
      <Root />
    </I18nProvider>
  </React.StrictMode>,
);
