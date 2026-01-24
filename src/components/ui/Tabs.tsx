import './Tabs.css';

interface Tab {
  id: string;
  label: string;
}

interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

const Tabs = ({ tabs, activeTab, onTabChange }: TabsProps) => {
  return (
    <div className="tabs-container">
      {tabs.map(tab => (
        <button
          key={tab.id}
          type="button"
          className={`tab ${activeTab === tab.id ? 'active' : ''}`}
          onClick={() => onTabChange(tab.id)}
          aria-pressed={activeTab === tab.id}
          aria-label={tab.label}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default Tabs;
