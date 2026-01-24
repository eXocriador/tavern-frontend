import { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { getUsers, type UserWithCharacters } from '../../api/users';
import { createParty, type CreatePartyData } from '../../api/parties';
import type { InstanceZone } from '../../api/instances';
import './CreatePartyModal.css';

// Популярні ніки з Lineage 2
const POPULAR_L2_NICKNAMES = [
  'DarkKnight',
  'ShadowHunter',
  'DragonSlayer',
  'BloodMage',
  'IronWarrior',
  'NightElf',
];

interface CreatePartyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  instance: InstanceZone;
}

const CreatePartyModal = ({ isOpen, onClose, onSuccess, instance }: CreatePartyModalProps) => {
  const { t, language } = useLanguage();
  const [users, setUsers] = useState<UserWithCharacters[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUserIds, setSelectedUserIds] = useState<Set<string>>(new Set());
  const [selectedNicknames, setSelectedNicknames] = useState<Map<string, string>>(new Map());
  const [readyTime, setReadyTime] = useState('');
  const [readyDate, setReadyDate] = useState('');
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');

  // Отримуємо найвищий рівень гравця
  const getUserMaxLevel = (user: UserWithCharacters): number => {
    if (!user.characters || user.characters.length === 0) return 0;
    return Math.max(...user.characters.map(char => char.level));
  };

  useEffect(() => {
    if (isOpen) {
      loadUsers();
      const now = new Date();
      const dateStr = now.toISOString().split('T')[0];
      const timeStr = now.toTimeString().slice(0, 5);
      setReadyDate(dateStr);
      setReadyTime(timeStr);
      setSelectedUserIds(new Set());
      setSelectedNicknames(new Map());
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
  }, [isOpen]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await getUsers();
      setUsers(data);
    } catch (error) {
      console.error('Error loading users:', error);
      setError(t('party.errors.loadUsersFailed'));
    } finally {
      setLoading(false);
    }
  };

  const handleUserToggle = (userId: string) => {
    const newSet = new Set(selectedUserIds);
    if (newSet.has(userId)) {
      newSet.delete(userId);
      const newMap = new Map(selectedNicknames);
      newMap.delete(userId);
      setSelectedNicknames(newMap);
    } else {
      newSet.add(userId);
      // Автоматично встановлюємо перший популярний нік
      const newMap = new Map(selectedNicknames);
      newMap.set(userId, POPULAR_L2_NICKNAMES[0]);
      setSelectedNicknames(newMap);
    }
    setSelectedUserIds(newSet);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (selectedUserIds.size === 0) {
      setError(t('party.errors.noUsersSelected'));
      return;
    }

    if (!readyDate || !readyTime) {
      setError(t('party.errors.timeRequired'));
      return;
    }

    try {
      setCreating(true);
      const readyDateTime = new Date(`${readyDate}T${readyTime}`);
      const nicknamesMap: { [userId: string]: string } = {};
      selectedNicknames.forEach((nickname, userId) => {
        nicknamesMap[userId] = nickname;
      });

      const data: CreatePartyData = {
        zoneId: instance.zoneId,
        readyTime: readyDateTime.toISOString(),
        invitedUserIds: Array.from(selectedUserIds),
        selectedNicknames: nicknamesMap,
      };

      await createParty(data);
      onSuccess();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : t('party.errors.createFailed'));
    } finally {
      setCreating(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay create-party-modal-overlay" onClick={onClose}>
      <div className="modal-content create-party-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{t('party.create')}</h2>
          <button className="modal-close" onClick={onClose} aria-label={t('common.close')}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="party-instance-info">
            <h3>{instance.name}</h3>
          </div>

          {error && <div className="modal-error">{error}</div>}

          <div className="party-users-section">
            <h4>{t('party.invitePlayers')}</h4>
            {loading ? (
              <div className="loading" style={{ minHeight: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {t('common.loading')}
              </div>
            ) : (
              <div className="users-list">
                {users.map((user) => {
                  const maxLevel = getUserMaxLevel(user);
                  const isSelected = selectedUserIds.has(user._id);
                  return (
                    <div key={user._id} className={`user-item ${isSelected ? 'selected' : ''}`}>
                      <div className="user-info">
                        <span className="user-name">
                          {user.username || `ID: ${user.telegramId}`}
                        </span>
                        {maxLevel > 0 && (
                          <span className="user-level">
                            {t('characters.levelShort')} {maxLevel}
                          </span>
                        )}
                      </div>
                      <button
                        type="button"
                        className={`btn-add-user ${isSelected ? 'added' : ''}`}
                        onClick={() => handleUserToggle(user._id)}
                        title={isSelected ? (t('common.remove') || 'Remove') : (t('common.add') || 'Add')}
                        aria-label={isSelected ? (t('common.remove') || 'Remove') : (t('common.add') || 'Add')}
                      >
                        {isSelected ? (
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                          </svg>
                        ) : (
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="12" y1="5" x2="12" y2="19"></line>
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                          </svg>
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="party-time-section">
            <h4>{t('party.readyTime')}</h4>
            <div className="time-inputs">
              <input
                type="date"
                value={readyDate}
                onChange={(e) => setReadyDate(e.target.value)}
                className="form-input"
                required
                disabled={loading}
                lang={language === 'ua' ? 'uk' : language === 'ru' ? 'ru' : 'en'}
              />
              <input
                type="time"
                value={readyTime}
                onChange={(e) => setReadyTime(e.target.value)}
                className="form-input"
                required
                disabled={loading}
              />
            </div>
          </div>

          <div className="modal-actions">
            <button type="submit" className="btn-save" disabled={creating || loading}>
              {creating ? t('common.creating') : t('party.create')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePartyModal;
