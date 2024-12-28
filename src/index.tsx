import React from 'react';
import ReactDOM from 'react-dom/client';
import ImagePopup from './components/ImagePopup';
import './components/App/styles.css';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <div style={{ padding: '20px' }}>
      <h1>图片弹窗示例</h1>
      <ImagePopup 
        text="点击这里查看图片" 
        images={['/images/7.jpg']}
        maxWidth={300}
        maxHeight={300}
      />
    </div>
  </React.StrictMode>
);
