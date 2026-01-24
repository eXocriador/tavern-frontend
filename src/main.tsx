import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Update HTML lang attribute based on saved language
const savedLanguage = localStorage.getItem('language') || 'en';
const htmlLang = savedLanguage === 'ua' ? 'uk' : savedLanguage === 'ru' ? 'ru' : 'en';
document.documentElement.lang = htmlLang;

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

