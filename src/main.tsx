import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ConfigProvider, App as AntdApp } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import 'antd/dist/reset.css';
import './styles/global.css';
import App from './App';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ConfigProvider
      locale={zhCN}
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
            
        // 消除某些不需要的边框或内阴影
        controlOutlineWidth: 0, // 关键是这个！消除选中后的默认发光边框
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
  </React.StrictMode>,
);
