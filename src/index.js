import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { v4 as uuidv4 } from 'uuid';
import Cookies from 'js-cookie';

const userId = Cookies.get('userId');
if (!userId) {
  const userId = uuidv4(); // 生成唯一ID
  const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24小时后过期
  Cookies.set('userId', userId, { expires });
}
// console.log('userId:',userId);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // <React.StrictMode>
    <App />
  // </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
