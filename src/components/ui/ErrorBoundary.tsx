import { Component, ErrorInfo, ReactNode } from 'react';
import enTranslations from '../../locales/en.json';
import uaTranslations from '../../locales/ua.json';
import ruTranslations from '../../locales/ru.json';
import './ErrorBoundary.css';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

const translations = {
  en: enTranslations,
  ua: uaTranslations,
  ru: ruTranslations,
};

const getNestedValue = (obj: any, path: string): string => {
  return path.split('.').reduce((current, key) => current?.[key], obj) || path;
};

const getLanguage = (): 'en' | 'ua' | 'ru' => {
  const saved = localStorage.getItem('language') as 'en' | 'ua' | 'ru';
  return saved && ['en', 'ua', 'ru'].includes(saved) ? saved : 'ua';
};

const ErrorDisplay = () => {
  const language = getLanguage();
  const t = (key: string): string => {
    return getNestedValue(translations[language], key);
  };

  const handleReload = () => {
    window.location.reload();
  };

  return (
    <div className="error-boundary-container">
      <div className="error-boundary-card">
        <div className="error-boundary-icon">
          <svg
            width="64"
            height="64"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
        </div>
        <h2 className="error-boundary-title">{t('error.title')}</h2>
        <p className="error-boundary-message">{t('error.message')}</p>
        <p className="error-boundary-hint">{t('error.hint')}</p>
        <button className="error-boundary-button" onClick={handleReload}>
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="23 4 23 10 17 10"></polyline>
            <polyline points="1 20 1 14 7 14"></polyline>
            <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
          </svg>
          <span>{t('error.reload')}</span>
        </button>
      </div>
    </div>
  );
};

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || <ErrorDisplay />;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
