import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import apiClient from '../api/axiosConfig';
import { useLanguage } from '../context/LanguageContext';
import './ForgotPassword.css';

type RecoveryMethod = 'telegram' | 'email' | null;

interface RecoveryOptions {
  telegram: boolean;
  email: boolean;
  emailMasked: string | null;
}

const ForgotPassword = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [telegramId, setTelegramId] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [codeSent, setCodeSent] = useState(false);
  const [useOldPassword, setUseOldPassword] = useState(false);

  // Recovery method selection
  const [recoveryOptions, setRecoveryOptions] = useState<RecoveryOptions | null>(null);
  const [selectedMethod, setSelectedMethod] = useState<RecoveryMethod>(null);
  const [optionsLoading, setOptionsLoading] = useState(false);

  const handleCheckOptions = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setOptionsLoading(true);

    try {
      const response = await apiClient.post('/auth/recovery-options', {
        telegramId: Number(telegramId),
      });
      setRecoveryOptions(response.data);
      
      // If only one option, select it automatically
      if (response.data.telegram && !response.data.email) {
        setSelectedMethod('telegram');
      } else if (!response.data.telegram && response.data.email) {
        setSelectedMethod('email');
      }
    } catch (error: any) {
      setError(error.response?.data?.error || t('forgotPassword.errors.resetFailed'));
    } finally {
      setOptionsLoading(false);
    }
  };

  const handleRequestCode = async () => {
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await apiClient.post('/auth/forgot-password', {
        telegramId: Number(telegramId),
        method: selectedMethod,
      });
      setCodeSent(true);
      setSuccess(
        selectedMethod === 'email'
          ? t('forgotPassword.codeSentEmail')
          : t('forgotPassword.codeSent')
      );
    } catch (error: any) {
      setError(error.response?.data?.error || t('forgotPassword.errors.resetFailed'));
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (newPassword !== confirmPassword) {
      setError(t('forgotPassword.errors.mismatch'));
      return;
    }

    if (newPassword.length < 6) {
      setError(t('forgotPassword.errors.tooShort'));
      return;
    }

    setLoading(true);

    try {
      if (useOldPassword) {
        await apiClient.post('/auth/reset-password-with-old', {
          telegramId: Number(telegramId),
          oldPassword,
          newPassword,
        });
      } else {
        await apiClient.post('/auth/reset-password', {
          telegramId: Number(telegramId),
          code,
          newPassword,
        });
      }
      setSuccess(t('forgotPassword.passwordReset'));
      setTimeout(() => navigate('/login'), 2000);
    } catch (error: any) {
      setError(error.response?.data?.error || t('forgotPassword.errors.resetFailed'));
    } finally {
      setLoading(false);
    }
  };

  const resetState = () => {
    setRecoveryOptions(null);
    setSelectedMethod(null);
    setCodeSent(false);
    setCode('');
    setError('');
    setSuccess('');
  };

  return (
    <div className="forgot-password-container">
      <div className="forgot-password-panel">
        <div className="forgot-password-header">
          <h1>{t('forgotPassword.title')}</h1>
          <p className="forgot-password-subtitle">{t('forgotPassword.subtitle')}</p>
        </div>

        {/* Step 1: Enter Telegram ID */}
        {!recoveryOptions && !useOldPassword ? (
          <form onSubmit={handleCheckOptions} className="forgot-password-form">
            <div className="forgot-password-input-group">
              <label htmlFor="telegramId">{t('forgotPassword.telegramId')}</label>
              <input
                id="telegramId"
                type="text"
                value={telegramId}
                onChange={e => setTelegramId(e.target.value)}
                placeholder={t('forgotPassword.telegramIdPlaceholder')}
                required
                autoComplete="username"
              />
            </div>

            {error && <div className="forgot-password-error">{error}</div>}

            <button type="submit" className="forgot-password-button" disabled={optionsLoading}>
              {optionsLoading ? t('common.loading') : t('forgotPassword.continue')}
            </button>

            <button
              type="button"
              className="forgot-password-toggle"
              onClick={() => setUseOldPassword(true)}
            >
              {t('forgotPassword.useOldPassword')}
            </button>
          </form>
        ) : recoveryOptions && !selectedMethod ? (
          /* Step 2: Choose recovery method */
          <div className="forgot-password-form">
            <p className="forgot-password-method-label">{t('forgotPassword.chooseMethod')}</p>
            
            <div className="recovery-methods">
              <button
                type="button"
                className="recovery-method-btn"
                onClick={() => setSelectedMethod('telegram')}
              >
                <span className="method-icon">📱</span>
                <span className="method-name">Telegram</span>
              </button>

              {recoveryOptions.email && (
                <button
                  type="button"
                  className="recovery-method-btn"
                  onClick={() => setSelectedMethod('email')}
                >
                  <span className="method-icon">📧</span>
                  <span className="method-name">Email</span>
                  <span className="method-hint">{recoveryOptions.emailMasked || ''}</span>
                </button>
              )}
            </div>

            <button
              type="button"
              className="forgot-password-toggle"
              onClick={resetState}
            >
              {t('common.cancel')}
            </button>
          </div>
        ) : recoveryOptions && selectedMethod && !codeSent ? (
          /* Step 3: Send code */
          <div className="forgot-password-form">
            <p className="forgot-password-method-info">
              {selectedMethod === 'email'
                ? t('forgotPassword.sendToEmail', { email: recoveryOptions.emailMasked || '' })
                : t('forgotPassword.sendToTelegram')}
            </p>

            {error && <div className="forgot-password-error">{error}</div>}

            <button
              type="button"
              className="forgot-password-button"
              onClick={handleRequestCode}
              disabled={loading}
            >
              {loading ? t('forgotPassword.sending') : t('forgotPassword.requestCode')}
            </button>

            <button
              type="button"
              className="forgot-password-toggle"
              onClick={() => setSelectedMethod(null)}
            >
              {t('forgotPassword.changeMethod')}
            </button>
          </div>
        ) : (
          /* Step 4: Enter code and new password */
          <form onSubmit={handleResetPassword} className="forgot-password-form">
            {!useOldPassword && (
              <div className="forgot-password-input-group">
                <label htmlFor="code">{t('forgotPassword.resetCode')}</label>
                <input
                  id="code"
                  type="text"
                  value={code}
                  onChange={e => setCode(e.target.value)}
                  placeholder={t('forgotPassword.resetCodePlaceholder')}
                  required
                  autoComplete="one-time-code"
                />
                <p className="forgot-password-hint">
                  {selectedMethod === 'email'
                    ? t('forgotPassword.resetCodeHintEmail')
                    : t('forgotPassword.resetCodeHint')}
                </p>
              </div>
            )}

            {useOldPassword && (
              <>
                <div className="forgot-password-input-group">
                  <label htmlFor="telegramId">{t('forgotPassword.telegramId')}</label>
                  <input
                    id="telegramId"
                    type="text"
                    value={telegramId}
                    onChange={e => setTelegramId(e.target.value)}
                    placeholder={t('forgotPassword.telegramIdPlaceholder')}
                    required
                    autoComplete="username"
                  />
                </div>
                <div className="forgot-password-input-group">
                  <label htmlFor="oldPassword">{t('forgotPassword.oldPassword')}</label>
                  <input
                    id="oldPassword"
                    type="password"
                    value={oldPassword}
                    onChange={e => setOldPassword(e.target.value)}
                    placeholder={t('forgotPassword.oldPasswordPlaceholder')}
                    required
                    autoComplete="current-password"
                  />
                </div>
              </>
            )}

            <div className="forgot-password-input-group">
              <label htmlFor="newPassword">{t('forgotPassword.newPassword')}</label>
              <input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                placeholder={t('forgotPassword.newPasswordPlaceholder')}
                required
                minLength={6}
                autoComplete="new-password"
              />
            </div>

            <div className="forgot-password-input-group">
              <label htmlFor="confirmPassword">{t('forgotPassword.confirmPassword')}</label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                placeholder={t('forgotPassword.confirmPasswordPlaceholder')}
                required
                minLength={6}
                autoComplete="new-password"
              />
            </div>

            {error && <div className="forgot-password-error">{error}</div>}
            {success && <div className="forgot-password-success">{success}</div>}

            <button type="submit" className="forgot-password-button" disabled={loading}>
              {loading ? t('forgotPassword.resetting') : t('forgotPassword.resetButton')}
            </button>

            <button
              type="button"
              className="forgot-password-toggle"
              onClick={() => {
                if (useOldPassword) {
                  setUseOldPassword(false);
                  setOldPassword('');
                } else {
                  setCodeSent(false);
                  setCode('');
                }
                setError('');
                setSuccess('');
              }}
            >
              {useOldPassword ? t('forgotPassword.requestCode') : t('forgotPassword.requestNewCode')}
            </button>
          </form>
        )}

        <div className="forgot-password-links">
          <Link to="/login" className="forgot-password-link">
            {t('forgotPassword.backToLogin')}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
