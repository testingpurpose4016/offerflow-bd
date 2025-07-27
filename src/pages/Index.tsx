import { useState, useEffect, useMemo } from "react";
import AppHeader from "@/components/AppHeader";
import FilterTabs from "@/components/FilterTabs";
import StatsBar from "@/components/StatsBar";
import OfferCard from "@/components/OfferCard";
import OfferCardSkeleton from "@/components/OfferCardSkeleton";
import EmptyState from "@/components/EmptyState";
import SearchAndSort from "@/components/SearchAndSort";
import ComparisonModal from "@/components/ComparisonModal";
import FavoritesModal from "@/components/FavoritesModal";
import { useToast } from "@/hooks/use-toast";
import { useOffers, type Offer } from "@/hooks/useOffers";
import { useConfig } from "@/hooks/useConfig";
import {
  getFavorites,
  addToFavorites,
  removeFromFavorites,
  isFavorite,
  getComparison,
  addToComparison,
  removeFromComparison,
  clearComparison,
  isInComparison,
} from "@/lib/utils";

const Index = () => {
  const { offers, isLoading, refreshOffers } = useOffers();
  const { config } = useConfig();
  const [filteredOffers, setFilteredOffers] = useState<Offer[]>([]);
  const [activeFilter, setActiveFilter] = useState("all");
  const [balance] = useState(1250);
  const { toast } = useToast();

  // New state for enhanced features
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
  const [validityFilter, setValidityFilter] = useState(0);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [comparison, setComparison] = useState<string[]>([]);
  const [showComparisonModal, setShowComparisonModal] = useState(false);
  const [showFavoritesModal, setShowFavoritesModal] = useState(false);

  // Load favorites and comparison from localStorage
  useEffect(() => {
    setFavorites(getFavorites());
    setComparison(getComparison());
  }, []);

  // Advanced filtering and sorting logic
  const processedOffers = useMemo(() => {
    let filtered = offers;

    // Operator filter
    if (activeFilter !== "all") {
      filtered = filtered.filter((offer) => offer.operator === activeFilter);
    }

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (offer) =>
          offer.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          offer.operator.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    // Category filter
    if (categoryFilter !== "all") {
      filtered = filtered.filter((offer) => offer.category === categoryFilter);
    }

    // Price range filter
    filtered = filtered.filter(
      (offer) =>
        offer.selling_price >= priceRange[0] &&
        offer.selling_price <= priceRange[1],
    );

    // Validity filter
    if (validityFilter > 0) {
      filtered = filtered.filter(
        (offer) => offer.validity_days >= validityFilter,
      );
    }

    // Sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.selling_price - b.selling_price;
        case "price-high":
          return b.selling_price - a.selling_price;
        case "validity-high":
          return b.validity_days - a.validity_days;
        case "validity-low":
          return a.validity_days - b.validity_days;
        case "data-high": {
          // Simple data comparison (assumes GB format)
          const aData = parseFloat(a.data_amount.replace(/[^0-9.]/g, "")) || 0;
          const bData = parseFloat(b.data_amount.replace(/[^0-9.]/g, "")) || 0;
          return bData - aData;
        }
        case "newest":
        default:
          return (
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          );
      }
    });

    return filtered;
  }, [
    offers,
    activeFilter,
    searchTerm,
    categoryFilter,
    priceRange,
    validityFilter,
    sortBy,
  ]);

  // Update filtered offers when processed offers change
  useEffect(() => {
    setFilteredOffers(processedOffers);
  }, [processedOffers]);

  // Calculate offer counts by operator
  const offerCounts = {
    all: offers.length,
    GP: offers.filter((o) => o.operator === "GP").length,
    Robi: offers.filter((o) => o.operator === "Robi").length,
    Banglalink: offers.filter((o) => o.operator === "Banglalink").length,
    Airtel: offers.filter((o) => o.operator === "Airtel").length,
    Skitto: offers.filter((o) => o.operator === "Skitto").length,
  };

  const handleWhatsAppOrder = (offer: Offer) => {
    const message = encodeURIComponent(
      `আসসালামু আলাইকুম! আমি এই অফারটি নিতে চাই:\n\n${offer.title}\n📱 অপারেটর: ${offer.operator}\n💰 দাম: ৳${offer.selling_price}\n\nঅনুগ্রহ করে আমাকে পরবর্তী ধাপ জানান।`,
    );
    window.open(
      `https://wa.me/${offer.whatsapp_number}?text=${message}`,
      "_blank",
    );

    toast({
      title: "WhatsApp Opened",
      description: "Continue your order on WhatsApp",
    });
  };

  const handlePhoneOrder = (offer: Offer) => {
    window.open(`tel:+${offer.whatsapp_number}`);

    toast({
      title: "Calling...",
      description: `Connecting to ${offer.operator} sales team`,
    });
  };

  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter);
  };

  const handleRefresh = () => {
    refreshOffers();
    toast({
      title: "Refreshed",
      description: "Offers updated successfully",
    });
  };

  // Favorites handlers
  const handleToggleFavorite = (offerId: string) => {
    if (isFavorite(offerId)) {
      removeFromFavorites(offerId);
      setFavorites((prev) => prev.filter((id) => id !== offerId));
      toast({
        title: "Removed from favorites",
        description: "Offer removed from your favorites",
      });
    } else {
      addToFavorites(offerId);
      setFavorites((prev) => [...prev, offerId]);
      toast({
        title: "Added to favorites",
        description: "Offer saved to your favorites",
      });
    }
  };

  // Comparison handlers
  const handleToggleComparison = (offerId: string) => {
    if (isInComparison(offerId)) {
      removeFromComparison(offerId);
      setComparison((prev) => prev.filter((id) => id !== offerId));
      toast({
        title: "Removed from comparison",
        description: "Offer removed from comparison",
      });
    } else if (comparison.length < 3) {
      addToComparison(offerId);
      setComparison((prev) => [...prev, offerId]);
      toast({
        title: "Added to comparison",
        description: "Offer added to comparison",
      });
    } else {
      toast({
        title: "Comparison full",
        description: "You can only compare up to 3 offers",
        variant: "destructive",
      });
    }
  };

  const handleClearComparison = () => {
    clearComparison();
    setComparison([]);
    toast({
      title: "Comparison cleared",
      description: "All offers removed from comparison",
    });
  };

  // Get favorite and comparison offers
  const favoriteOffers = offers.filter((offer) => favorites.includes(offer.id));
  const comparisonOffers = offers.filter((offer) =>
    comparison.includes(offer.id),
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <AppHeader
        balance={balance}
        favoriteCount={favorites.length}
        comparisonCount={comparison.length}
        onFavoritesClick={() => setShowFavoritesModal(true)}
        onComparisonClick={() => setShowComparisonModal(true)}
      />

      <div className="px-3 py-2 space-y-3">
        {/* Search and Sort */}
        <SearchAndSort
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          sortBy={sortBy}
          onSortChange={setSortBy}
          categoryFilter={categoryFilter}
          onCategoryChange={setCategoryFilter}
          priceRange={priceRange}
          onPriceRangeChange={setPriceRange}
          validityFilter={validityFilter}
          onValidityFilterChange={setValidityFilter}
          offers={filteredOffers}
          showAdvanced={showAdvancedFilters}
          onToggleAdvanced={() => setShowAdvancedFilters(!showAdvancedFilters)}
        />

        {/* Filter Tabs */}
        <FilterTabs
          activeFilter={activeFilter}
          onFilterChange={handleFilterChange}
          offerCounts={offerCounts}
        />

        {/* Stats Bar */}
        <StatsBar availableOffers={filteredOffers.length} />

        {/* Main Content */}
        <main className="space-y-3 pb-6">
        {isLoading ? (
          // Loading State
          <>
            {[...Array(6)].map((_, index) => (
              <OfferCardSkeleton key={index} />
            ))}
          </>
        ) : filteredOffers.length === 0 ? (
          // Empty State
          <EmptyState
            title="No offers found"
            description="Try selecting a different operator or check back later"
            showRefresh={true}
            onRefresh={handleRefresh}
          />
        ) : (
          // Offers List
          <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
            {filteredOffers.map((offer) => (
              <OfferCard
                key={offer.id}
                offer={offer}
                onWhatsAppOrder={() => handleWhatsAppOrder(offer)}
                onPhoneOrder={() => handlePhoneOrder(offer)}
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
      <ComparisonModal
        isOpen={showComparisonModal}
        onClose={() => setShowComparisonModal(false)}
        offers={comparisonOffers}
        onWhatsAppOrder={handleWhatsAppOrder}
        onPhoneOrder={handlePhoneOrder}
        onRemoveFromComparison={(offerId) => {
          removeFromComparison(offerId);
          setComparison((prev) => prev.filter((id) => id !== offerId));
        }}
      />

      <FavoritesModal
        isOpen={showFavoritesModal}
        onClose={() => setShowFavoritesModal(false)}
        favoriteOffers={favoriteOffers}
        onWhatsAppOrder={handleWhatsAppOrder}
        onPhoneOrder={handlePhoneOrder}
        onRemoveFromFavorites={(offerId) => {
          removeFromFavorites(offerId);
          setFavorites((prev) => prev.filter((id) => id !== offerId));
        }}
      />

      {/* Footer */}
      <footer className="px-4 py-6 text-center border-t border-border mt-8">
        <p className="body-sm text-muted">
          © 2024 {config.company_name || "রিয়েলদের সিম অফার"}। All rights
          reserved.
        </p>
        <p className="body-sm text-muted mt-1">
          📞 Support: {config.support_phone || "+880171234567"} | 📧{" "}
          {config.support_email || "support@realdeals.com"}
        </p>
      </footer>
      </div>
    </div>
  );
};

export default Index;
