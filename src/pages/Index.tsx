import { useState, useEffect } from "react";
import AppHeader from "@/components/AppHeader";
import FilterTabs from "@/components/FilterTabs";
import StatsBar from "@/components/StatsBar";
import OfferCard from "@/components/OfferCard";
import OfferCardSkeleton from "@/components/OfferCardSkeleton";
import EmptyState from "@/components/EmptyState";
import { useToast } from "@/hooks/use-toast";
import { useOffers, type Offer } from "@/hooks/useOffers";
import { useConfig } from "@/hooks/useConfig";

const Index = () => {
  const { offers, isLoading, refreshOffers } = useOffers();
  const { config } = useConfig();
  const [filteredOffers, setFilteredOffers] = useState<Offer[]>([]);
  const [activeFilter, setActiveFilter] = useState("all");
  const [balance] = useState(1250);
  const { toast } = useToast();

  // Update filtered offers when offers or filter changes
  useEffect(() => {
    if (activeFilter === "all") {
      setFilteredOffers(offers);
    } else {
      setFilteredOffers(offers.filter(offer => offer.operator === activeFilter));
    }
  }, [activeFilter, offers]);

  // Calculate offer counts by operator
  const offerCounts = {
    all: offers.length,
    GP: offers.filter(o => o.operator === "GP").length,
    Robi: offers.filter(o => o.operator === "Robi").length,
    Banglalink: offers.filter(o => o.operator === "Banglalink").length,
    Airtel: offers.filter(o => o.operator === "Airtel").length,
    Skitto: offers.filter(o => o.operator === "Skitto").length,
  };

  const handleWhatsAppOrder = (offer: Offer) => {
    const message = encodeURIComponent(
      `আসসালামু আলাইকুম! আমি এই অফারটি নিতে চাই:\n\n${offer.title}\n📱 অপারেটর: ${offer.operator}\n💰 দাম: ৳${offer.selling_price}\n\nঅনুগ্রহ করে আমাকে পরবর্তী ধাপ জানান।`
    );
    window.open(`https://wa.me/${offer.whatsapp_number}?text=${message}`, '_blank');
    
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

  return (
    <div className="mobile-container">
      {/* Header */}
      <AppHeader balance={balance} cartItems={0} />

      {/* Filter Tabs */}
      <FilterTabs 
        activeFilter={activeFilter}
        onFilterChange={handleFilterChange}
        offerCounts={offerCounts}
      />

      {/* Stats Bar */}
      <StatsBar availableOffers={filteredOffers.length} />

      {/* Main Content */}
      <main className="px-4 py-4 space-y-4">
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
          <>
            {filteredOffers.map((offer) => (
              <OfferCard
                key={offer.id}
                offer={offer}
                onWhatsAppOrder={() => handleWhatsAppOrder(offer)}
                onPhoneOrder={() => handlePhoneOrder(offer)}
              />
            ))}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="px-4 py-6 text-center border-t border-border mt-8">
        <p className="body-sm text-muted">
          © 2024 {config.company_name || 'রিয়েলদের সিম অফার'}। All rights reserved.
        </p>
        <p className="body-sm text-muted mt-1">
          📞 Support: {config.support_phone || '+880171234567'} | 📧 {config.support_email || 'support@realdeals.com'}
        </p>
      </footer>
    </div>
  );
};

export default Index;
