import { useCallback, useEffect, useState } from 'react';
import { getInstances, type InstanceZone } from '../api/instances';
import { getMyVisits, markVisit, type Visit } from '../api/visits';
import { useLanguage } from '../context/LanguageContext';
import { DashboardStats, InstanceCard } from '../components/features';
import { EmptyState } from '../components/ui';
import CloseInstanceModal from '../components/modals/CloseInstanceModal';
import CreatePartyModal from '../components/modals/CreatePartyModal';
import './Dashboard.css';

const Dashboard = () => {
  const { t } = useLanguage();
  const [instances, setInstances] = useState<InstanceZone[]>([]);
  const [visits, setVisits] = useState<Visit[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [closingInstance, setClosingInstance] = useState<InstanceZone | null>(null);
  const [creatingPartyFor, setCreatingPartyFor] = useState<InstanceZone | null>(null);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [instancesData, visitsData] = await Promise.all([getInstances(), getMyVisits()]);
      console.log('Loaded instances:', instancesData);
      console.log('Loaded visits:', visitsData);
      setInstances(instancesData || []);
      setVisits(visitsData || []);
    } catch (error) {
      console.error('Error loading data:', error);
      alert(t('dashboard.error'));
      setInstances([]);
      setVisits([]);
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleCloseInstance = async () => {
    if (!closingInstance) return;
    try {
      setUpdating(closingInstance.zoneId);
      await markVisit(closingInstance.zoneId);
      const newVisit = await getMyVisits();
      setVisits(newVisit);
      setClosingInstance(null);
    } catch (error) {
      console.error('Error closing instance:', error);
      alert(t('dashboard.errors.closeFailed'));
    } finally {
      setUpdating(null);
    }
  };

  const handleCreatePartySuccess = () => {
    // Party created successfully, could show notification
  };

  if (loading) {
    return <div className="loading">{t('common.loading')}</div>;
  }

  const visitedZoneIds = new Set(visits.filter(v => v.zoneId?.zoneId).map(v => v.zoneId.zoneId));

  // Sort instances: available (not visited) first, then closed (visited)
  const availableInstances = instances.filter(instance => !visitedZoneIds.has(instance.zoneId));
  const closedInstances = instances.filter(instance => visitedZoneIds.has(instance.zoneId));

  return (
    <div className="dashboard">
      <main className="dashboard-main">
        <div className="instances-list">
          <h2>{t('dashboard.instanceZones')}</h2>

          <DashboardStats totalInstances={instances.length} visitedCount={visits.length} />
          {instances.length === 0 ? (
            <EmptyState message={t('dashboard.noInstances')} />
          ) : (
            <>
              {availableInstances.length > 0 && (
                <>
                  <h3 className="instances-section-title">{t('dashboard.available')}</h3>
                  {availableInstances.map(instance => (
                    <InstanceCard
                      key={instance.zoneId}
                      instance={instance}
                      isVisited={false}
                      isUpdating={updating === instance.zoneId}
                      onMarkAsPassed={setClosingInstance}
                      onCreateParty={setCreatingPartyFor}
                    />
                  ))}
                </>
              )}

              {closedInstances.length > 0 && (
                <>
                  <h3 className="instances-section-title">{t('dashboard.passed')}</h3>
                  {closedInstances.map(instance => (
                    <InstanceCard
                      key={instance.zoneId}
                      instance={instance}
                      isVisited={true}
                    />
                  ))}
                </>
              )}
            </>
          )}
        </div>
      </main>

      {closingInstance && (
        <CloseInstanceModal
          isOpen={!!closingInstance}
          onClose={() => setClosingInstance(null)}
          onConfirm={handleCloseInstance}
          instanceName={closingInstance.name}
        />
      )}

      {creatingPartyFor && (
        <CreatePartyModal
          isOpen={!!creatingPartyFor}
          onClose={() => setCreatingPartyFor(null)}
          onSuccess={handleCreatePartySuccess}
          instance={creatingPartyFor}
        />
      )}
    </div>
  );
};

export default Dashboard;
