import { useLanguage } from '../../context/LanguageContext';
import './LanguageSwitcher.css';

interface LanguageSwitcherProps {
  onLanguageChange?: (lang: 'en' | 'ua' | 'ru') => void;
}

const LanguageSwitcher = ({ onLanguageChange }: LanguageSwitcherProps = {}) => {
  const { language, setLanguage } = useLanguage();

  const handleLanguageChange = (lang: 'en' | 'ua' | 'ru') => {
    setLanguage(lang);
    if (onLanguageChange) {
      onLanguageChange(lang);
    }
  };

  return (
    <div className="language-switcher">
      <button
        className={language === 'en' ? 'active' : ''}
        onClick={() => handleLanguageChange('en')}
        title="English"
      >
        EN
      </button>
      <button
        className={language === 'ua' ? 'active' : ''}
        onClick={() => handleLanguageChange('ua')}
        title="Українська"
      >
        UA
      </button>
      <button
        className={language === 'ru' ? 'active' : ''}
        onClick={() => handleLanguageChange('ru')}
        title="Русский"
      >
        RU
      </button>
    </div>
  );
};

export default LanguageSwitcher;
