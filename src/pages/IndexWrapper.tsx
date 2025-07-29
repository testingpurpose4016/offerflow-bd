import React, { useEffect, useState } from 'react';
import Index from './Index';
import { DataLoader, type OffersPageProps } from '@/lib/dataLoader';
import OfferCardSkeleton from '@/components/OfferCardSkeleton';

// Wrapper component that handles data fetching and passes props to Index
const IndexWrapper = () => {
  const [data, setData] = useState<OffersPageProps | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const result = await DataLoader.getOffersData();
        setData(result);
      } catch (error) {
        setData({
          offers: [],
          config: {},
          error: error instanceof Error ? error.message : 'Failed to load data'
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <OfferCardSkeleton key={index} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground mb-2">Error Loading Data</h2>
          <p className="text-muted-foreground">Failed to load application data</p>
        </div>
      </div>
    );
  }

  return <Index {...data} />;
};

export default IndexWrapper;