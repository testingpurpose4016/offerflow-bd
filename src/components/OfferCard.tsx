import { Phone, MessageCircle, Heart, GitCompare } from "lucide-react";

interface Offer {
  id: string;
  operator: string;
  title: string;
  data_amount: string;
  minutes: number;
  validity_days: number;
  selling_price: number;
  original_price: number;
  region: string;
  category: string;
  whatsapp_number: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface OfferCardProps {
  offer: Offer;
  onWhatsAppOrder: () => void;
  onPhoneOrder: () => void;
  isFavorite?: boolean;
  isInComparison?: boolean;
  onToggleFavorite?: () => void;
  onToggleComparison?: () => void;
  canAddToComparison?: boolean;
}

const OfferCard = ({
  offer,
  onWhatsAppOrder,
  onPhoneOrder,
  isFavorite = false,
  isInComparison = false,
  onToggleFavorite,
  onToggleComparison,
  canAddToComparison = true,
}: OfferCardProps) => {
  const getOperatorClass = (operator: string) => {
    return `operator-${operator.toLowerCase()}`;
  };

  const formatWhatsAppMessage = () => {
    return encodeURIComponent(
      `আসসালামু আলাইকুম! আমি এই অফারটি নিতে চাই:\n\n${offer.title}\n📱 অপারেটর: ${offer.operator}\n💰 দাম: ৳${offer.selling_price}\n\nঅনুগ্রহ করে আমাকে পরবর্তী ধাপ জানান।`,
    );
  };

  const savings = offer.original_price
    ? offer.original_price - offer.selling_price
    : 0;
  const isCombo = offer.category === "combo";
  const isLocationSpecific = offer.region && offer.region !== "All Bangladesh";

  return (
    <div className="offer-card space-y-4">
      {/* Header Section */}
      <div className="flex justify-between items-start">
        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className={`operator-badge ${getOperatorClass(offer.operator)}`}
            >
              {offer.operator}
            </span>
            {isCombo && <span className="combo-badge">📦 Combo</span>}
            {isLocationSpecific && (
              <span className="region-badge">📍 {offer.region}</span>
            )}
          </div>

          <h3 className="heading-sm text-foreground">{offer.title}</h3>

          <p className="body-sm text-muted">
            {offer.data_amount}
            {offer.minutes > 0 && ` + ${offer.minutes} minutes`}
            {" • "}
            {offer.validity_days} days
          </p>
        </div>

        {/* Pricing Section */}
        <div className="text-right space-y-1">
          {offer.original_price && (
            <div className="price-original">৳{offer.original_price}</div>
          )}
          <div className="price-current">৳{offer.selling_price}</div>
          {savings > 0 && <div className="savings-badge">Save ৳{savings}</div>}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-2">
        <div className="flex gap-2">
          <button onClick={onWhatsAppOrder} className="whatsapp-button flex-1">
            <MessageCircle size={16} />
            WhatsApp Order
          </button>

          <button onClick={onPhoneOrder} className="secondary-button w-11 h-11">
            <Phone size={16} />
          </button>
        </div>

        {/* Favorite and Compare buttons */}
        <div className="flex gap-2">
          {onToggleFavorite && (
            <button
              onClick={onToggleFavorite}
              className={`flex-1 h-9 rounded-lg border transition-colors flex items-center justify-center gap-2 text-sm ${
                isFavorite
                  ? "bg-red-50 border-red-200 text-red-600 hover:bg-red-100"
                  : "bg-background border-border text-muted-foreground hover:bg-muted"
              }`}
            >
              <Heart size={14} className={isFavorite ? "fill-current" : ""} />
              {isFavorite ? "Favorited" : "Favorite"}
            </button>
          )}

          {onToggleComparison && (
            <button
              onClick={onToggleComparison}
              disabled={!canAddToComparison && !isInComparison}
              className={`flex-1 h-9 rounded-lg border transition-colors flex items-center justify-center gap-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed ${
                isInComparison
                  ? "bg-blue-50 border-blue-200 text-blue-600 hover:bg-blue-100"
                  : "bg-background border-border text-muted-foreground hover:bg-muted"
              }`}
            >
              <GitCompare size={14} />
              {isInComparison ? "In Compare" : "Compare"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OfferCard;
