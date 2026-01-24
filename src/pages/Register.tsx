import { useState } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../api/axiosConfig';
import { useLanguage } from '../context/LanguageContext';
import './Register.css';

const Register = () => {
  const { t } = useLanguage();
  const [telegramId, setTelegramId] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError(t('register.errors.mismatch'));
      return;
    }

    if (password.length < 6) {
      setError(t('register.errors.tooShort'));
      return;
    }

    setLoading(true);

    try {
      const response = await apiClient.post('/auth/register', {
        telegramId: Number(telegramId),
        password,
      });

      if (response.data?.success) {
        localStorage.setItem('user', JSON.stringify(response.data.user));
        window.location.href = '/';
      } else {
        setError(t('register.errors.registrationFailed'));
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || t('register.errors.registrationFailed');
      if (errorMessage.includes('already exists') && errorMessage.includes('login')) {
        setError(t('register.errors.userExists'));
      } else {
        setError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-panel">
        <div className="register-header">
          <h1>{t('register.title')}</h1>
          <p className="register-subtitle">{t('register.subtitle')}</p>
        </div>

        <form onSubmit={handleRegister} className="register-form">
          <div className="register-input-group">
            <label htmlFor="telegramId">{t('register.telegramId')}</label>
            <input
              id="telegramId"
              type="text"
              value={telegramId}
              onChange={(e) => setTelegramId(e.target.value)}
              placeholder={t('register.telegramIdPlaceholder')}
              required
              autoComplete="username"
            />
            <p className="register-hint">
              {t('register.telegramIdHint')}
            </p>
          </div>

          <div className="register-input-group">
            <label htmlFor="password">{t('register.password')}</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t('register.passwordPlaceholder')}
              required
              minLength={6}
              autoComplete="new-password"
            />
          </div>

          <div className="register-input-group">
            <label htmlFor="confirmPassword">{t('register.confirmPassword')}</label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder={t('register.confirmPasswordPlaceholder')}
              required
              minLength={6}
              autoComplete="new-password"
            />
          </div>

          {error && <div className="register-error">{error}</div>}

          <button type="submit" className="register-button" disabled={loading}>
            {loading ? t('register.registering') : t('register.registerButton')}
          </button>
        </form>

        <div className="register-links">
          <Link to="/login" className="register-link">
            {t('register.loginLink')}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
