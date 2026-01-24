import { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import './LogoutConfirmModal.css';

interface LogoutConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const LogoutConfirmModal = ({ isOpen, onClose, onConfirm }: LogoutConfirmModalProps) => {
  const { t } = useLanguage();
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Block scroll when modal is open
      document.documentElement.style.overflow = 'hidden';
      document.body.style.overflow = 'hidden';
    } else {
      // Restore scroll when modal is closed
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
    }

    return () => {
      // Ensure scroll is restored on unmount
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleConfirm = async () => {
    try {
      setLoggingOut(true);
      onConfirm();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content logout-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{t('settings.logout')}</h2>
          <button className="modal-close" onClick={onClose} aria-label={t('common.close')}>
            ×
          </button>
        </div>

        <div className="logout-modal-body">
          <p>{t('settings.logoutConfirm')}</p>
        </div>

        <div className="modal-actions">
          <button type="button" onClick={onClose} className="btn-cancel" disabled={loggingOut}>
            {t('common.cancel')}
          </button>
          <button type="button" onClick={handleConfirm} className="btn-logout-confirm" disabled={loggingOut}>
            {loggingOut ? t('common.loggingOut') : t('settings.logout')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogoutConfirmModal;
