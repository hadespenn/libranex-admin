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
