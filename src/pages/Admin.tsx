import React, { useEffect, useState } from 'react';
import { AdminPanel } from '@/components/AdminPanel';
import { DataLoader, type AdminPageProps } from '@/lib/dataLoader';

const Admin = () => {
  const [data, setData] = useState<AdminPageProps | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const result = await DataLoader.getAdminData();
        setData(result);
      } catch (error) {
        setData({
          config: {},
          error: error instanceof Error ? error.message : 'Failed to load admin data'
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground mb-2">Loading Admin Panel...</h2>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground mb-2">Error Loading Admin Data</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <AdminPanel config={data.config} error={data.error} />
    </div>
  );
};

export default Admin;