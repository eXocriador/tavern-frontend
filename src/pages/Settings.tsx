import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { getProfile, updateProfile } from '../api/profile';
import LanguageSwitcher from '../components/ui/LanguageSwitcher';
import TimezoneSelector from '../components/ui/TimezoneSelector';
import LogoutConfirmModal from '../components/modals/LogoutConfirmModal';
import apiClient from '../api/axiosConfig';
import './Settings.css';

const Settings = () => {
  const { logout, user } = useAuth();
  const { setLanguage, t } = useLanguage();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [timezone, setTimezone] = useState('UTC');
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  // Password change state
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);

  // Password reset state
  const [showPasswordReset, setShowPasswordReset] = useState(false);
  const [resetCode, setResetCode] = useState('');
  const [resetNewPassword, setResetNewPassword] = useState('');
  const [resetConfirmPassword, setResetConfirmPassword] = useState('');
  const [resetError, setResetError] = useState('');
  const [resetSuccess, setResetSuccess] = useState('');
  const [resetLoading, setResetLoading] = useState(false);
  const [codeSent, setCodeSent] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const profile = await getProfile();
      if (profile.timezone) {
        setTimezone(profile.timezone);
      }
      if (profile.language) {
        setLanguage(profile.language as 'en' | 'ua' | 'ru');
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLanguageChange = async (lang: 'en' | 'ua' | 'ru') => {
    setLanguage(lang);
    try {
      await updateProfile({ language: lang });
    } catch (error) {
      console.error('Error saving language:', error);
    }
  };

  const handleTimezoneChange = async (tz: string) => {
    setTimezone(tz);
    try {
      setSaving(true);
      await updateProfile({ timezone: tz });
    } catch (error) {
      console.error('Error saving timezone:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    logout();
    setIsLogoutModalOpen(false);
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    if (!oldPassword) {
      setPasswordError(t('settings.passwordErrors.oldRequired'));
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError(t('settings.passwordErrors.mismatch'));
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError(t('settings.passwordErrors.tooShort'));
      return;
    }

    setPasswordLoading(true);

    try {
      await apiClient.post('/auth/change-password', {
        oldPassword,
        newPassword,
      });

      setPasswordSuccess(t('settings.passwordChanged'));
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => {
        setShowPasswordChange(false);
        setPasswordSuccess('');
      }, 2000);
    } catch (error: any) {
      setPasswordError(error.response?.data?.error || t('settings.passwordErrors.changeFailed'));
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleRequestResetCode = async () => {
    if (!user?.telegramId) {
      setResetError('Telegram ID not found');
      return;
    }

    setResetError('');
    setResetSuccess('');
    setResetLoading(true);

    try {
      await apiClient.post('/auth/forgot-password', {
        telegramId: user.telegramId,
      });

      setResetSuccess(t('settings.codeSent'));
      setCodeSent(true);
    } catch (error: any) {
      setResetError(error.response?.data?.error || t('settings.passwordErrors.resetFailed'));
    } finally {
      setResetLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetError('');
    setResetSuccess('');

    if (!resetCode) {
      setResetError(t('settings.passwordErrors.codeRequired'));
      return;
    }

    if (resetNewPassword !== resetConfirmPassword) {
      setResetError(t('settings.passwordErrors.mismatch'));
      return;
    }

    if (resetNewPassword.length < 6) {
      setResetError(t('settings.passwordErrors.tooShort'));
      return;
    }

    setResetLoading(true);

    try {
      await apiClient.post('/auth/reset-password', {
        telegramId: user?.telegramId,
        resetCode,
        newPassword: resetNewPassword,
      });

      setResetSuccess(t('settings.passwordReset'));
      setResetCode('');
      setResetNewPassword('');
      setResetConfirmPassword('');
      setTimeout(() => {
        setShowPasswordReset(false);
        setResetSuccess('');
        setCodeSent(false);
      }, 2000);
    } catch (error: any) {
      setResetError(error.response?.data?.error || t('settings.passwordErrors.invalidCode'));
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <div className="settings">
      <main className="settings-main">
        <div className="settings-card">
          <div className="settings-header">
            <h2>{t('settings.title')}</h2>
            <button onClick={() => setIsLogoutModalOpen(true)} className="btn-logout-icon" title={t('settings.logout')}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                <polyline points="16 17 21 12 16 7"></polyline>
                <line x1="21" y1="12" x2="9" y2="12"></line>
              </svg>
            </button>
          </div>

          {loading ? (
            <div className="loading">{t('common.loading')}</div>
          ) : (
            <>
              <div className="settings-section">
                <h3>{t('settings.language')}</h3>
                <div className="language-switcher-container">
                  <LanguageSwitcher onLanguageChange={handleLanguageChange} />
                </div>
              </div>

              <div className="settings-section">
                <h3>{t('settings.timezone')}</h3>
                <TimezoneSelector
                  value={timezone}
                  onChange={handleTimezoneChange}
                  disabled={saving}
                />
              </div>

              <div className="settings-section">
                <h3>{t('settings.security')}</h3>

                {!showPasswordChange ? (
                  <button
                    onClick={() => setShowPasswordChange(true)}
                    className="btn-change-password"
                  >
                    {t('settings.changePassword')}
                  </button>
                ) : (
                  <form onSubmit={handleChangePassword} className="password-change-form">
                    <div className="password-input-group">
                      <label htmlFor="oldPassword">{t('settings.oldPassword')}</label>
                      <input
                        id="oldPassword"
                        type="password"
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                        placeholder={t('settings.oldPasswordPlaceholder')}
                        required
                        autoComplete="current-password"
                      />
                    </div>
                    <div className="password-input-group">
                      <label htmlFor="newPassword">{t('settings.newPassword')}</label>
                      <input
                        id="newPassword"
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder={t('settings.newPasswordPlaceholder')}
                        required
                        minLength={6}
                        autoComplete="new-password"
                      />
                    </div>
                    <div className="password-input-group">
                      <label htmlFor="confirmPassword">{t('settings.confirmPassword')}</label>
                      <input
                        id="confirmPassword"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder={t('settings.confirmPasswordPlaceholder')}
                        required
                        minLength={6}
                        autoComplete="new-password"
                      />
                    </div>
                    {passwordError && <div className="password-error">{passwordError}</div>}
                    {passwordSuccess && <div className="password-success">{passwordSuccess}</div>}
                    <div className="password-actions">
                      <button type="submit" className="btn-save-password" disabled={passwordLoading}>
                        {passwordLoading ? t('common.saving') : t('common.save')}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowPasswordChange(false);
                          setOldPassword('');
                          setNewPassword('');
                          setConfirmPassword('');
                          setPasswordError('');
                          setPasswordSuccess('');
                        }}
                        className="btn-cancel-password"
                      >
                        {t('common.cancel')}
                      </button>
                    </div>
                  </form>
                )}

                <div className="password-reset-section">
                  {!showPasswordReset ? (
                    <>
                      <p className="password-reset-description">{t('settings.resetPasswordDescription')}</p>
                      <button
                        onClick={() => setShowPasswordReset(true)}
                        className="btn-reset-password"
                      >
                        {t('settings.resetPassword')}
                      </button>
                    </>
                  ) : (
                    <form onSubmit={handleResetPassword} className="password-reset-form">
                      {!codeSent ? (
                        <div className="reset-code-request">
                          <button
                            type="button"
                            onClick={handleRequestResetCode}
                            className="btn-request-code"
                            disabled={resetLoading}
                          >
                            {resetLoading ? t('common.loading') : t('settings.requestCode')}
                          </button>
                        </div>
                      ) : (
                        <>
                          <div className="password-input-group">
                            <label htmlFor="resetCode">{t('settings.resetCode')}</label>
                            <input
                              id="resetCode"
                              type="text"
                              value={resetCode}
                              onChange={(e) => setResetCode(e.target.value)}
                              placeholder={t('settings.resetCodePlaceholder')}
                              required
                            />
                          </div>
                          <div className="password-input-group">
                            <label htmlFor="resetNewPassword">{t('settings.newPassword')}</label>
                            <input
                              id="resetNewPassword"
                              type="password"
                              value={resetNewPassword}
                              onChange={(e) => setResetNewPassword(e.target.value)}
                              placeholder={t('settings.newPasswordPlaceholder')}
                              required
                              minLength={6}
                              autoComplete="new-password"
                            />
                          </div>
                          <div className="password-input-group">
                            <label htmlFor="resetConfirmPassword">{t('settings.confirmPassword')}</label>
                            <input
                              id="resetConfirmPassword"
                              type="password"
                              value={resetConfirmPassword}
                              onChange={(e) => setResetConfirmPassword(e.target.value)}
                              placeholder={t('settings.confirmPasswordPlaceholder')}
                              required
                              minLength={6}
                              autoComplete="new-password"
                            />
                          </div>
                          {resetError && <div className="password-error">{resetError}</div>}
                          {resetSuccess && <div className="password-success">{resetSuccess}</div>}
                          <div className="password-actions">
                            <button type="submit" className="btn-save-password" disabled={resetLoading}>
                              {resetLoading ? t('common.saving') : t('common.save')}
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setShowPasswordReset(false);
                                setResetCode('');
                                setResetNewPassword('');
                                setResetConfirmPassword('');
                                setResetError('');
                                setResetSuccess('');
                                setCodeSent(false);
                              }}
                              className="btn-cancel-password"
                            >
                              {t('common.cancel')}
                            </button>
                          </div>
                        </>
                      )}
                    </form>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </main>

      <LogoutConfirmModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleLogout}
      />
    </div>
  );
};

export default Settings;
