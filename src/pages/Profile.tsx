import { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { getCharacters, createCharacter, updateCharacter, deleteCharacter, type Character } from '../api/characters';
import { CharacterCard } from '../components/features';
import { EmptyState } from '../components/ui';
import CharacterModal from '../components/modals/CharacterModal';
import DeleteConfirmModal from '../components/modals/DeleteConfirmModal';
import './Profile.css';

const Profile = () => {
  const { t } = useLanguage();
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingCharacter, setEditingCharacter] = useState<Character | null>(null);
  const [deletingCharacter, setDeletingCharacter] = useState<Character | null>(null);
  const [isDeleteMode, setIsDeleteMode] = useState(false);

  useEffect(() => {
    loadCharacters();
  }, []);

  const loadCharacters = async () => {
    try {
      setLoading(true);
      const data = await getCharacters();
      setCharacters(data);
    } catch (error) {
      console.error('Error loading characters:', error);
      alert(t('characters.errors.loadFailed'));
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (nickname: string, profession: string, level: number) => {
    await createCharacter(nickname, profession, level);
    await loadCharacters();
  };

  const handleUpdate = async (nickname: string, profession: string, level: number) => {
    if (!editingCharacter) return;
    await updateCharacter(editingCharacter._id, nickname, profession, level);
    await loadCharacters();
    setEditingCharacter(null);
  };

  const handleDelete = async () => {
    if (!deletingCharacter) return;
    await deleteCharacter(deletingCharacter._id);
    await loadCharacters();
    setDeletingCharacter(null);
  };

  if (loading) {
    return <div className="loading">{t('common.loading')}</div>;
  }

  return (
    <div className="profile">
      <main className="profile-main">
        <div className="profile-card">
          <div className="profile-header">
            <h2>{t('profile.title')}</h2>
            <div className="profile-header-actions">
              {characters.length > 0 && (
                <>
                  <button
                    onClick={() => setIsDeleteMode(!isDeleteMode)}
                    className={`btn-delete-mode ${isDeleteMode ? 'active' : ''}`}
                    title={isDeleteMode ? t('characters.exitDeleteMode') : t('characters.deleteMode')}
                  >
                    {isDeleteMode ? (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 6L9 17l-5-5"></path>
                      </svg>
                    ) : (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                      </svg>
                    )}
                  </button>
                  <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="btn-create-character"
                  >
                    {t('characters.createNew')}
                  </button>
                </>
              )}
            </div>
          </div>

          {characters.length === 0 ? (
            <EmptyState
              message={t('characters.noCharacters')}
              actionLabel={t('characters.create')}
              onAction={() => setIsCreateModalOpen(true)}
            />
          ) : (
            <div className="characters-list">
              {characters.map((character) => (
                <CharacterCard
                  key={character._id}
                  character={character}
                  isDeleteMode={isDeleteMode}
                  onEdit={setEditingCharacter}
                  onDelete={setDeletingCharacter}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      <CharacterModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSave={handleCreate}
        mode="create"
      />

      {editingCharacter && (
        <CharacterModal
          isOpen={!!editingCharacter}
          onClose={() => setEditingCharacter(null)}
          onSave={handleUpdate}
          character={editingCharacter}
          mode="edit"
        />
      )}

      {deletingCharacter && (
        <DeleteConfirmModal
          isOpen={!!deletingCharacter}
          onClose={() => setDeletingCharacter(null)}
          onConfirm={handleDelete}
          characterName={deletingCharacter.nickname}
        />
      )}
    </div>
  );
};

export default Profile;
