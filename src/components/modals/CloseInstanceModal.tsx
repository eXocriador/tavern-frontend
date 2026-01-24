import { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import './CloseInstanceModal.css';

interface CloseInstanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  instanceName: string;
}

const CloseInstanceModal = ({ isOpen, onClose, onConfirm, instanceName }: CloseInstanceModalProps) => {
  const { t } = useLanguage();
  const [closing, setClosing] = useState(false);

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
      setClosing(true);
      await onConfirm();
      onClose();
    } catch (error) {
      console.error('Close error:', error);
      alert(t('dashboard.errors.closeFailed'));
    } finally {
      setClosing(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content close-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{t('dashboard.markAsPassed')}</h2>
          <button className="modal-close" onClick={onClose} aria-label={t('common.close')}>
            ×
          </button>
        </div>

        <div className="close-modal-body">
          <p>{t('dashboard.passedConfirm', { name: instanceName })}</p>
        </div>

        <div className="modal-actions">
          <button type="button" onClick={onClose} className="btn-cancel" disabled={closing}>
            {t('common.cancel')}
          </button>
          <button type="button" onClick={handleConfirm} className="btn-confirm" disabled={closing}>
            {closing ? t('common.marking') : t('dashboard.passed')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CloseInstanceModal;
