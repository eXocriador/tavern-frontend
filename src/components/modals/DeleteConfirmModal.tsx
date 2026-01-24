import { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import './DeleteConfirmModal.css';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  characterName: string;
}

const DeleteConfirmModal = ({ isOpen, onClose, onConfirm, characterName }: DeleteConfirmModalProps) => {
  const { t } = useLanguage();
  const [deleting, setDeleting] = useState(false);

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
      setDeleting(true);
      await onConfirm();
      onClose();
    } catch (error) {
      console.error('Delete error:', error);
      alert(t('characters.errors.deleteFailed'));
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content delete-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{t('characters.delete')}</h2>
          <button className="modal-close" onClick={onClose} aria-label={t('common.close')}>
            ×
          </button>
        </div>

        <div className="delete-modal-body">
          <p>{t('characters.deleteConfirm').replace('{name}', characterName)}</p>
        </div>

        <div className="modal-actions">
          <button type="button" onClick={onClose} className="btn-cancel" disabled={deleting}>
            {t('common.cancel')}
          </button>
          <button type="button" onClick={handleConfirm} className="btn-delete" disabled={deleting}>
            {deleting ? t('common.deleting') : t('common.delete')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;
