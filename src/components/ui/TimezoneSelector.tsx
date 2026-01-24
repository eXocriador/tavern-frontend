import { useState, useRef, useEffect, useMemo } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import './TimezoneSelector.css';

// Базовий список часових поясів з локалізованими назвами
const TIMEZONES_BASE = [
  // Europe
  { value: 'Europe/Kiev', labels: { ua: 'Київ (EET)', ru: 'Киев (EET)', en: 'Kyiv (EET)' }, region: 'Europe' },
  { value: 'Europe/Moscow', labels: { ua: 'Москва (MSK)', ru: 'Москва (MSK)', en: 'Moscow (MSK)' }, region: 'Europe' },
  { value: 'Europe/London', labels: { ua: 'Лондон (GMT)', ru: 'Лондон (GMT)', en: 'London (GMT)' }, region: 'Europe' },
  { value: 'Europe/Paris', labels: { ua: 'Париж (CET)', ru: 'Париж (CET)', en: 'Paris (CET)' }, region: 'Europe' },
  { value: 'Europe/Berlin', labels: { ua: 'Берлін (CET)', ru: 'Берлин (CET)', en: 'Berlin (CET)' }, region: 'Europe' },
  { value: 'Europe/Rome', labels: { ua: 'Рим (CET)', ru: 'Рим (CET)', en: 'Rome (CET)' }, region: 'Europe' },
  { value: 'Europe/Madrid', labels: { ua: 'Мадрид (CET)', ru: 'Мадрид (CET)', en: 'Madrid (CET)' }, region: 'Europe' },
  { value: 'Europe/Athens', labels: { ua: 'Афіни (EET)', ru: 'Афины (EET)', en: 'Athens (EET)' }, region: 'Europe' },
  { value: 'Europe/Warsaw', labels: { ua: 'Варшава (CET)', ru: 'Варшава (CET)', en: 'Warsaw (CET)' }, region: 'Europe' },
  { value: 'Europe/Prague', labels: { ua: 'Прага (CET)', ru: 'Прага (CET)', en: 'Prague (CET)' }, region: 'Europe' },
  { value: 'Europe/Budapest', labels: { ua: 'Будапешт (CET)', ru: 'Будапешт (CET)', en: 'Budapest (CET)' }, region: 'Europe' },
  { value: 'Europe/Bucharest', labels: { ua: 'Бухарест (EET)', ru: 'Бухарест (EET)', en: 'Bucharest (EET)' }, region: 'Europe' },
  { value: 'Europe/Helsinki', labels: { ua: 'Гельсінкі (EET)', ru: 'Хельсинки (EET)', en: 'Helsinki (EET)' }, region: 'Europe' },
  { value: 'Europe/Stockholm', labels: { ua: 'Стокгольм (CET)', ru: 'Стокгольм (CET)', en: 'Stockholm (CET)' }, region: 'Europe' },
  { value: 'Europe/Oslo', labels: { ua: 'Осло (CET)', ru: 'Осло (CET)', en: 'Oslo (CET)' }, region: 'Europe' },
  { value: 'Europe/Copenhagen', labels: { ua: 'Копенгаген (CET)', ru: 'Копенгаген (CET)', en: 'Copenhagen (CET)' }, region: 'Europe' },
  { value: 'Europe/Amsterdam', labels: { ua: 'Амстердам (CET)', ru: 'Амстердам (CET)', en: 'Amsterdam (CET)' }, region: 'Europe' },
  { value: 'Europe/Brussels', labels: { ua: 'Брюссель (CET)', ru: 'Брюссель (CET)', en: 'Brussels (CET)' }, region: 'Europe' },
  { value: 'Europe/Zurich', labels: { ua: 'Цюрих (CET)', ru: 'Цюрих (CET)', en: 'Zurich (CET)' }, region: 'Europe' },
  { value: 'Europe/Vienna', labels: { ua: 'Відень (CET)', ru: 'Вена (CET)', en: 'Vienna (CET)' }, region: 'Europe' },
  { value: 'Europe/Dublin', labels: { ua: 'Дублін (GMT)', ru: 'Дублин (GMT)', en: 'Dublin (GMT)' }, region: 'Europe' },
  { value: 'Europe/Lisbon', labels: { ua: 'Лісабон (WET)', ru: 'Лиссабон (WET)', en: 'Lisbon (WET)' }, region: 'Europe' },

  // Americas
  { value: 'America/New_York', labels: { ua: 'Нью-Йорк (EST)', ru: 'Нью-Йорк (EST)', en: 'New York (EST)' }, region: 'Americas' },
  { value: 'America/Chicago', labels: { ua: 'Чикаго (CST)', ru: 'Чикаго (CST)', en: 'Chicago (CST)' }, region: 'Americas' },
  { value: 'America/Denver', labels: { ua: 'Денвер (MST)', ru: 'Денвер (MST)', en: 'Denver (MST)' }, region: 'Americas' },
  { value: 'America/Los_Angeles', labels: { ua: 'Лос-Анджелес (PST)', ru: 'Лос-Анджелес (PST)', en: 'Los Angeles (PST)' }, region: 'Americas' },
  { value: 'America/Toronto', labels: { ua: 'Торонто (EST)', ru: 'Торонто (EST)', en: 'Toronto (EST)' }, region: 'Americas' },
  { value: 'America/Vancouver', labels: { ua: 'Ванкувер (PST)', ru: 'Ванкувер (PST)', en: 'Vancouver (PST)' }, region: 'Americas' },
  { value: 'America/Mexico_City', labels: { ua: 'Мехіко (CST)', ru: 'Мехико (CST)', en: 'Mexico City (CST)' }, region: 'Americas' },
  { value: 'America/Sao_Paulo', labels: { ua: 'Сан-Паулу (BRT)', ru: 'Сан-Паулу (BRT)', en: 'São Paulo (BRT)' }, region: 'Americas' },
  { value: 'America/Buenos_Aires', labels: { ua: 'Буенос-Айрес (ART)', ru: 'Буэнос-Айрес (ART)', en: 'Buenos Aires (ART)' }, region: 'Americas' },
  { value: 'America/Lima', labels: { ua: 'Ліма (PET)', ru: 'Лима (PET)', en: 'Lima (PET)' }, region: 'Americas' },
  { value: 'America/Bogota', labels: { ua: 'Богота (COT)', ru: 'Богота (COT)', en: 'Bogotá (COT)' }, region: 'Americas' },
  { value: 'America/Santiago', labels: { ua: 'Сантьяго (CLT)', ru: 'Сантьяго (CLT)', en: 'Santiago (CLT)' }, region: 'Americas' },

  // Asia
  { value: 'Asia/Tokyo', labels: { ua: 'Токіо (JST)', ru: 'Токио (JST)', en: 'Tokyo (JST)' }, region: 'Asia' },
  { value: 'Asia/Shanghai', labels: { ua: 'Шанхай (CST)', ru: 'Шанхай (CST)', en: 'Shanghai (CST)' }, region: 'Asia' },
  { value: 'Asia/Hong_Kong', labels: { ua: 'Гонконг (HKT)', ru: 'Гонконг (HKT)', en: 'Hong Kong (HKT)' }, region: 'Asia' },
  { value: 'Asia/Singapore', labels: { ua: 'Сінгапур (SGT)', ru: 'Сингапур (SGT)', en: 'Singapore (SGT)' }, region: 'Asia' },
  { value: 'Asia/Seoul', labels: { ua: 'Сеул (KST)', ru: 'Сеул (KST)', en: 'Seoul (KST)' }, region: 'Asia' },
  { value: 'Asia/Dubai', labels: { ua: 'Дубай (GST)', ru: 'Дубай (GST)', en: 'Dubai (GST)' }, region: 'Asia' },
  { value: 'Asia/Riyadh', labels: { ua: 'Ер-Ріяд (AST)', ru: 'Эр-Рияд (AST)', en: 'Riyadh (AST)' }, region: 'Asia' },
  { value: 'Asia/Kolkata', labels: { ua: 'Калькутта (IST)', ru: 'Калькутта (IST)', en: 'Kolkata (IST)' }, region: 'Asia' },
  { value: 'Asia/Bangkok', labels: { ua: 'Бангкок (ICT)', ru: 'Бангкок (ICT)', en: 'Bangkok (ICT)' }, region: 'Asia' },
  { value: 'Asia/Jakarta', labels: { ua: 'Джакарта (WIB)', ru: 'Джакарта (WIB)', en: 'Jakarta (WIB)' }, region: 'Asia' },
  { value: 'Asia/Manila', labels: { ua: 'Маніла (PHT)', ru: 'Манила (PHT)', en: 'Manila (PHT)' }, region: 'Asia' },
  { value: 'Asia/Kuala_Lumpur', labels: { ua: 'Куала-Лумпур (MYT)', ru: 'Куала-Лумпур (MYT)', en: 'Kuala Lumpur (MYT)' }, region: 'Asia' },
  { value: 'Asia/Taipei', labels: { ua: 'Тайбей (CST)', ru: 'Тайбэй (CST)', en: 'Taipei (CST)' }, region: 'Asia' },
  { value: 'Asia/Jerusalem', labels: { ua: 'Єрусалим (IST)', ru: 'Иерусалим (IST)', en: 'Jerusalem (IST)' }, region: 'Asia' },
  { value: 'Asia/Tehran', labels: { ua: 'Тегеран (IRST)', ru: 'Тегеран (IRST)', en: 'Tehran (IRST)' }, region: 'Asia' },

  // Pacific
  { value: 'Pacific/Auckland', labels: { ua: 'Окленд (NZST)', ru: 'Окленд (NZST)', en: 'Auckland (NZST)' }, region: 'Pacific' },
  { value: 'Pacific/Sydney', labels: { ua: 'Сідней (AEDT)', ru: 'Сидней (AEDT)', en: 'Sydney (AEDT)' }, region: 'Pacific' },
  { value: 'Pacific/Melbourne', labels: { ua: 'Мельбурн (AEDT)', ru: 'Мельбурн (AEDT)', en: 'Melbourne (AEDT)' }, region: 'Pacific' },
  { value: 'Pacific/Honolulu', labels: { ua: 'Гонолулу (HST)', ru: 'Гонолулу (HST)', en: 'Honolulu (HST)' }, region: 'Pacific' },

  // UTC
  { value: 'UTC', labels: { ua: 'UTC (Всесвітній координований час)', ru: 'UTC (Всемирное координированное время)', en: 'UTC (Coordinated Universal Time)' }, region: 'UTC' },
];

interface TimezoneSelectorProps {
  value: string;
  onChange: (timezone: string) => void;
  disabled?: boolean;
}

const TimezoneSelector = ({ value, onChange, disabled }: TimezoneSelectorProps) => {
  const { t, language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Створюємо локалізований список часових поясів
  const TIMEZONES = useMemo(() => {
    return TIMEZONES_BASE.map(tz => ({
      value: tz.value,
      label: tz.labels[language] || tz.labels.en,
      region: tz.region,
    }));
  }, [language]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchQuery('');
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      // Блокуємо прокрутку у всього додатку
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      const html = document.documentElement;
      const body = document.body;
      const app = document.querySelector('.app') as HTMLElement;

      html.style.overflow = 'hidden';
      body.style.overflow = 'hidden';
      if (app) {
        app.style.overflow = 'hidden';
      }

      // Компенсуємо зсув від зникнення scrollbar
      if (scrollbarWidth > 0) {
        body.style.paddingRight = `${scrollbarWidth}px`;
        if (app) {
          app.style.paddingRight = `${scrollbarWidth}px`;
        }
      }
      inputRef.current?.focus();
    } else {
      // Відновлюємо прокрутку
      const html = document.documentElement;
      const body = document.body;
      const app = document.querySelector('.app') as HTMLElement;

      html.style.overflow = '';
      body.style.overflow = '';
      body.style.paddingRight = '';
      if (app) {
        app.style.overflow = '';
        app.style.paddingRight = '';
      }
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    };
  }, [isOpen]);

  const selectedTimezone = TIMEZONES.find(tz => tz.value === value) || TIMEZONES[0];

  const filteredTimezones = TIMEZONES.filter(tz => {
    const query = searchQuery.toLowerCase();
    return (
      tz.label.toLowerCase().includes(query) ||
      tz.value.toLowerCase().includes(query) ||
      tz.region.toLowerCase().includes(query)
    );
  });

  const groupedTimezones = filteredTimezones.reduce((acc, tz) => {
    if (!acc[tz.region]) {
      acc[tz.region] = [];
    }
    acc[tz.region].push(tz);
    return acc;
  }, {} as Record<string, typeof TIMEZONES>);

  const handleSelect = (timezone: string) => {
    onChange(timezone);
    setIsOpen(false);
    setSearchQuery('');
  };

  return (
    <div className="timezone-selector" ref={containerRef}>
      <button
        type="button"
        className={`timezone-selector-button ${isOpen ? 'open' : ''}`}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
      >
        <span className="timezone-selector-value">{selectedTimezone.label}</span>
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`timezone-selector-arrow ${isOpen ? 'open' : ''}`}
        >
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </button>

      {isOpen && (
        <div className="timezone-selector-dropdown">
          <div className={`timezone-selector-search ${searchQuery ? 'has-value' : ''}`}>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.35-4.35"></path>
            </svg>
            <input
              ref={inputRef}
              type="text"
              placeholder={t('settings.searchTimezone') || 'Search timezone...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={(e) => e.currentTarget.parentElement?.classList.add('focused')}
              onBlur={(e) => e.currentTarget.parentElement?.classList.remove('focused')}
              className="timezone-selector-input"
            />
          </div>

          <div className="timezone-selector-list">
            {Object.entries(groupedTimezones).map(([region, timezones]) => (
              <div key={region} className="timezone-selector-group">
                <div className="timezone-selector-group-label">{region}</div>
                {timezones.map((tz) => (
                  <button
                    key={tz.value}
                    type="button"
                    className={`timezone-selector-option ${value === tz.value ? 'active' : ''}`}
                    onClick={() => handleSelect(tz.value)}
                  >
                    {tz.label}
                    {value === tz.value && (
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    )}
                  </button>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TimezoneSelector;
