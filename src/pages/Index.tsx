import React, { useState, useMemo } from 'react';
import LandingHero from '@/components/LandingHero';
import SearchAndSort from '@/components/SearchAndSort';
import FilterTabs from '@/components/FilterTabs';
import StatsBar from '@/components/StatsBar';
import OfferCard from '@/components/OfferCard';
import EmptyState from '@/components/EmptyState';
import FavoritesModal from '@/components/FavoritesModal';
import ComparisonModal from '@/components/ComparisonModal';
import AppHeader from '@/components/AppHeader';
import { useToast } from '@/hooks/use-toast';
import type { Offer } from '@/lib/api/contracts';
import type { OffersPageProps } from '@/lib/dataLoader';

// Pure component that receives all data as props
const Index: React.FC<OffersPageProps> = ({ offers, config, error }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'price' | 'validity' | 'data'>('price');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [selectedOperator, setSelectedOperator] = useState('All Operators');
  const [selectedRegion, setSelectedRegion] = useState('All Bangladesh');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [comparison, setComparison] = useState<string[]>([]);
  const [showFavorites, setShowFavorites] = useState(false);
  const [showComparison, setShowComparison] = useState(false);
  const [showLanding, setShowLanding] = useState(false);
  const { toast } = useToast();

  // Pure filtering and sorting logic
  const filteredOffers = useMemo(() => {
    let filtered = offers;

    // Operator filter
    if (selectedOperator !== 'All Operators') {
      filtered = filtered.filter(offer => offer.operator === selectedOperator);
    }

    // Region filter
    if (selectedRegion !== 'All Bangladesh') {
      filtered = filtered.filter(offer => offer.region === selectedRegion);
    }

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(offer =>
        offer.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        offer.operator.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort
    filtered.sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'price':
          comparison = a.selling_price - b.selling_price;
          break;
        case 'validity':
          comparison = a.validity_days - b.validity_days;
          break;
        case 'data':
          const aData = parseFloat(a.data_amount.replace(/[^0-9.]/g, '')) || 0;
          const bData = parseFloat(b.data_amount.replace(/[^0-9.]/g, '')) || 0;
          comparison = aData - bData;
          break;
      }
      return sortOrder === 'desc' ? -comparison : comparison;
    });

    return filtered;
  }, [offers, selectedOperator, selectedRegion, searchTerm, sortBy, sortOrder]);

  // Calculate operator counts
  const operatorCounts = useMemo(() => {
    const counts: Record<string, number> = { 'All Operators': offers.length };
    offers.forEach(offer => {
      counts[offer.operator] = (counts[offer.operator] || 0) + 1;
    });
    return counts;
  }, [offers]);

  // Event handlers
  const handleWhatsAppOrder = (offer: Offer) => {
    const message = encodeURIComponent(
      `আসসালামু আলাইকুম! আমি এই অফারটি নিতে চাই:\n\n${offer.title}\n📱 অপারেটর: ${offer.operator}\n💰 দাম: ৳${offer.selling_price}\n\nঅনুগ্রহ করে আমাকে পরবর্তী ধাপ জানান।`
    );
    window.open(`https://wa.me/${offer.whatsapp_number}?text=${message}`, '_blank');
    
    toast({
      title: "WhatsApp Opened",
      description: "Continue your order on WhatsApp"
    });
  };

  const handleToggleFavorite = (offerId: string) => {
    setFavorites(prev => 
      prev.includes(offerId) 
        ? prev.filter(id => id !== offerId)
        : [...prev, offerId]
    );
  };

  const handleToggleComparison = (offerId: string) => {
    setComparison(prev => {
      if (prev.includes(offerId)) {
        return prev.filter(id => id !== offerId);
      } else if (prev.length < 3) {
        return [...prev, offerId];
      } else {
        toast({
          title: "Comparison full",
          description: "You can only compare up to 3 offers",
          variant: "destructive"
        });
        return prev;
      }
    });
  };

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground mb-2">Error Loading Offers</h2>
          <p className="text-muted-foreground">{error}</p>
        </div>
      </div>
    );
  }

  if (showLanding) {
    return (
      <LandingHero
        onGetStarted={() => setShowLanding(false)}
        totalOffers={offers.length}
        avgSavings={150}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <AppHeader
        balance={1250}
        favoriteCount={favorites.length}
        comparisonCount={comparison.length}
        onFavoritesClick={() => setShowFavorites(true)}
        onComparisonClick={() => setShowComparison(true)}
        onHomeClick={() => setShowLanding(true)}
      />

      <div className="container mx-auto px-4 py-6 space-y-6">
        <SearchAndSort
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          sortBy={sortBy}
          onSortChange={(sort: string) => setSortBy(sort as 'price' | 'validity' | 'data')}
          categoryFilter="all"
          onCategoryChange={() => {}}
          priceRange={[0, 10000]}
          onPriceRangeChange={() => {}}
          validityFilter={0}
          onValidityFilterChange={() => {}}
          offers={filteredOffers}
          showAdvanced={false}
          onToggleAdvanced={() => {}}
        />

        <FilterTabs
          activeFilter={selectedOperator}
          onFilterChange={setSelectedOperator}
          offerCounts={operatorCounts}
        />

        <StatsBar availableOffers={filteredOffers.length} />

        <main className="space-y-6">
          {filteredOffers.length === 0 ? (
            <EmptyState
              title="No offers found"
              description="Try adjusting your filters or check back later"
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredOffers.map((offer) => (
                <OfferCard
                  key={offer.id}
                  offer={offer}
                  onWhatsAppOrder={() => handleWhatsAppOrder(offer)}
                  onPhoneOrder={() => handleWhatsAppOrder(offer)}
                  isFavorite={favorites.includes(offer.id)}
                  isInComparison={comparison.includes(offer.id)}
                  onToggleFavorite={() => handleToggleFavorite(offer.id)}
                  onToggleComparison={() => handleToggleComparison(offer.id)}
                  canAddToComparison={comparison.length < 3}
                />
              ))}
            </div>
          )}
        </main>

        {/* Modals */}
        <FavoritesModal
          isOpen={showFavorites}
          onClose={() => setShowFavorites(false)}
          favoriteOffers={offers.filter(offer => favorites.includes(offer.id))}
          onWhatsAppOrder={handleWhatsAppOrder}
          onPhoneOrder={handleWhatsAppOrder}
          onRemoveFromFavorites={handleToggleFavorite}
        />

        <ComparisonModal
          isOpen={showComparison}
          onClose={() => setShowComparison(false)}
          offers={offers.filter(offer => comparison.includes(offer.id))}
          onWhatsAppOrder={handleWhatsAppOrder}
          onPhoneOrder={handleWhatsAppOrder}
          onRemoveFromComparison={handleToggleComparison}
        />

        {/* Footer */}
        <footer className="text-center py-6 border-t border-border">
          <p className="text-sm text-muted-foreground">
            © 2024 {config.company_name || "রিয়েলদের সিম অফার"}. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            📞 Support: {config.support_phone || "+880171234567"} | 📧 {config.support_email || "support@realdeals.com"}
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Index;