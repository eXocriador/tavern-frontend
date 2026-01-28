import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import apiClient from '../api/axiosConfig';
import { useLanguage } from '../context/LanguageContext';
import './SetPassword.css';

const SetPassword = () => {
  const { t } = useLanguage();
  const [searchParams] = useSearchParams();
  const [telegramId, setTelegramId] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const telegramIdParam = searchParams.get('telegramId');
    if (telegramIdParam) {
      setTelegramId(telegramIdParam);
    }
  }, [searchParams]);

  const handleSetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!telegramId) {
      setError(t('setPassword.errors.telegramIdRequired'));
      return;
    }

    if (password !== confirmPassword) {
      setError(t('setPassword.errors.mismatch'));
      return;
    }

    if (password.length < 6) {
      setError(t('setPassword.errors.tooShort'));
      return;
    }

    setLoading(true);

    try {
      const response = await apiClient.post('/auth/set-password', {
        telegramId: Number(telegramId),
        password,
      });

      if (response.data?.success) {
        localStorage.setItem('user', JSON.stringify(response.data.user));

        if (response.data.accessToken) {
          localStorage.setItem('accessToken', response.data.accessToken);
        }

        window.location.href = '/';
      } else {
        setError(t('setPassword.errors.setFailed'));
      }
    } catch (error: any) {
      setError(error.response?.data?.error || t('setPassword.errors.setFailed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="set-password-container">
      <div className="set-password-panel">
        <div className="set-password-header">
          <h1>{t('setPassword.title')}</h1>
          <p className="set-password-subtitle">{t('setPassword.subtitle')}</p>
        </div>

        <form onSubmit={handleSetPassword} className="set-password-form">
          <div className="set-password-input-group">
            <label htmlFor="telegramId">{t('setPassword.telegramId')}</label>
            <input
              id="telegramId"
              type="text"
              value={telegramId}
              onChange={e => setTelegramId(e.target.value)}
              placeholder={t('setPassword.telegramIdPlaceholder')}
              required
              autoComplete="username"
            />
            <p className="set-password-hint">{t('setPassword.telegramIdHint')}</p>
          </div>

          <div className="set-password-input-group">
            <label htmlFor="password">{t('setPassword.password')}</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder={t('setPassword.passwordPlaceholder')}
              required
              minLength={6}
              autoComplete="new-password"
            />
          </div>

          <div className="set-password-input-group">
            <label htmlFor="confirmPassword">{t('setPassword.confirmPassword')}</label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              placeholder={t('setPassword.confirmPasswordPlaceholder')}
              required
              minLength={6}
              autoComplete="new-password"
            />
          </div>

          {error && <div className="set-password-error">{error}</div>}

          <button type="submit" className="set-password-button" disabled={loading}>
            {loading ? t('setPassword.setting') : t('setPassword.setButton')}
          </button>
        </form>

        <div className="set-password-links">
          <Link to="/login" className="set-password-link">
            {t('setPassword.backToLogin')}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SetPassword;
