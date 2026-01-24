import { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import type { Character } from '../../api/characters';
import './CharacterModal.css';

interface CharacterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (nickname: string, profession: string, level: number) => Promise<void>;
  character?: Character | null;
  mode: 'create' | 'edit';
}

const CharacterModal = ({ isOpen, onClose, onSave, character, mode }: CharacterModalProps) => {
  const { t } = useLanguage();
  const [nickname, setNickname] = useState('');
  const [profession, setProfession] = useState('');
  const [level, setLevel] = useState<number | ''>('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      if (mode === 'edit' && character) {
        setNickname(character.nickname);
        setProfession(character.profession);
        setLevel(character.level);
      } else {
        setNickname('');
        setProfession('');
        setLevel('');
      }
      setError('');
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
  }, [isOpen, mode, character]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!nickname.trim()) {
      setError(t('characters.errors.nicknameRequired'));
      return;
    }

    if (!profession.trim()) {
      setError(t('characters.errors.professionRequired'));
      return;
    }

    if (level === '' || Number(level) < 1 || Number(level) > 100) {
      setError(t('characters.errors.levelInvalid'));
      return;
    }

    try {
      setSaving(true);
      await onSave(nickname.trim(), profession.trim(), Number(level));
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : t('characters.errors.saveFailed'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{mode === 'create' ? t('characters.create') : t('characters.edit')}</h2>
          <button className="modal-close" onClick={onClose} aria-label={t('common.close')}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {error && <div className="modal-error">{error}</div>}

          <div className="form-group">
            <label>{t('characters.nickname')}</label>
            <input
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder={t('characters.nicknamePlaceholder')}
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label>{t('characters.profession')}</label>
            <input
              type="text"
              value={profession}
              onChange={(e) => setProfession(e.target.value)}
              placeholder={t('characters.professionPlaceholder')}
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label>{t('characters.level')}</label>
            <input
              type="number"
              min="1"
              max="100"
              value={level}
              onChange={(e) => setLevel(e.target.value === '' ? '' : Number(e.target.value))}
              placeholder={t('characters.levelPlaceholder')}
              className="form-input"
              required
            />
          </div>

          <div className="modal-actions">
            <button type="button" onClick={onClose} className="btn-cancel" disabled={saving}>
              {t('common.cancel')}
            </button>
            <button type="submit" className="btn-save" disabled={saving}>
              {saving ? t('common.saving') : t('common.save')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CharacterModal;
