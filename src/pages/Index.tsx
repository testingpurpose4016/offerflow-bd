import { useState, useEffect } from "react";
import AppHeader from "@/components/AppHeader";
import FilterTabs from "@/components/FilterTabs";
import StatsBar from "@/components/StatsBar";
import OfferCard from "@/components/OfferCard";
import OfferCardSkeleton from "@/components/OfferCardSkeleton";
import EmptyState from "@/components/EmptyState";
import { useToast } from "@/hooks/use-toast";

// Sample data - In real app, this would come from API
const sampleOffers = [
  {
    id: 1,
    operator: "GP",
    title: "50GB + 1500 Minutes Bundle",
    data_amount: "50GB",
    minutes: 1500,
    validity_days: 30,
    selling_price: 775,
    original_price: 900,
    region: "All Bangladesh",
    category: "combo",
    whatsapp_number: "8801712345678",
    is_active: true
  },
  {
    id: 2,
    operator: "GP", 
    title: "120GB + 1800 Minutes Bundle",
    data_amount: "120GB",
    minutes: 1800,
    validity_days: 30,
    selling_price: 830,
    original_price: 1000,
    region: "All Bangladesh",
    category: "combo",
    whatsapp_number: "8801712345678",
    is_active: true
  },
  {
    id: 3,
    operator: "Skitto",
    title: "5GB Data Pack",
    data_amount: "5GB",
    minutes: 0,
    validity_days: 7,
    selling_price: 160,
    original_price: 200,
    region: "All Bangladesh",
    category: "internet",
    whatsapp_number: "8801712345678",
    is_active: true
  },
  {
    id: 4,
    operator: "Skitto",
    title: "10GB Data Pack",
    data_amount: "10GB",
    minutes: 0,
    validity_days: 15,
    selling_price: 240,
    original_price: 300,
    region: "All Bangladesh",
    category: "internet",
    whatsapp_number: "8801712345678",
    is_active: true
  },
  {
    id: 5,
    operator: "Banglalink",
    title: "150GB Data Pack",
    data_amount: "150GB",
    minutes: 0,
    validity_days: 30,
    selling_price: 640,
    original_price: 750,
    region: "Dhaka/Chittagong",
    category: "internet",
    whatsapp_number: "8801712345678",
    is_active: true
  },
  {
    id: 6,
    operator: "Airtel",
    title: "125GB Data Pack",
    data_amount: "125GB", 
    minutes: 0,
    validity_days: 30,
    selling_price: 650,
    original_price: 750,
    region: "All Bangladesh",
    category: "internet",
    whatsapp_number: "8801712345678",
    is_active: true
  },
  {
    id: 7,
    operator: "Robi",
    title: "5GB Data Pack",
    data_amount: "5GB",
    minutes: 0,
    validity_days: 7,
    selling_price: 110,
    original_price: 150,
    region: "All Bangladesh",
    category: "internet",
    whatsapp_number: "8801712345678",
    is_active: true
  }
];

const Index = () => {
  const [offers, setOffers] = useState(sampleOffers);
  const [filteredOffers, setFilteredOffers] = useState(sampleOffers);
  const [activeFilter, setActiveFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [balance] = useState(1250);
  const { toast } = useToast();

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  // Filter offers based on selected operator
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

  const handleWhatsAppOrder = (offer: typeof sampleOffers[0]) => {
    const message = encodeURIComponent(
      `আসসালামু আলাইকুম! আমি এই অফারটি নিতে চাই:\n\n${offer.title}\n📱 অপারেটর: ${offer.operator}\n💰 দাম: ৳${offer.selling_price}\n\nঅনুগ্রহ করে আমাকে পরবর্তী ধাপ জানান।`
    );
    window.open(`https://wa.me/${offer.whatsapp_number}?text=${message}`, '_blank');
    
    toast({
      title: "WhatsApp Opened",
      description: "Continue your order on WhatsApp",
    });
  };

  const handlePhoneOrder = (offer: typeof sampleOffers[0]) => {
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
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Refreshed",
        description: "Offers updated successfully",
      });
    }, 1000);
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
          © 2024 রিয়েলদের সিম অফার। All rights reserved.
        </p>
        <p className="body-sm text-muted mt-1">
          📞 Support: +880171234567 | 📧 support@realdeals.com
        </p>
      </footer>
    </div>
  );
};

export default Index;
