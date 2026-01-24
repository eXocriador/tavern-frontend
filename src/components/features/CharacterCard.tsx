import { useLanguage } from '../../context/LanguageContext';
import type { Character } from '../../api/characters';
import './CharacterCard.css';

interface CharacterCardProps {
  character: Character;
  isDeleteMode: boolean;
  onEdit: (character: Character) => void;
  onDelete: (character: Character) => void;
}

const CharacterCard = ({ character, isDeleteMode, onEdit, onDelete }: CharacterCardProps) => {
  const { t } = useLanguage();

  return (
    <div className="character-card">
      <div className="character-level-badge">
        {t('characters.levelShort')} {character.level}
      </div>
      <div className="character-info">
        <div className="character-name">{character.nickname}</div>
        <div className="character-profession">{character.profession}</div>
      </div>
      <div className="character-actions">
        <button
          onClick={() => onEdit(character)}
          className="btn-edit"
          title={t('characters.edit')}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
          </svg>
        </button>
        {isDeleteMode && (
          <button
            onClick={() => onDelete(character)}
            className="btn-delete"
            title={t('characters.delete')}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

export default CharacterCard;
