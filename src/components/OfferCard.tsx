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
      `আসসালামু আলাইকুম! আমি এই অফারটি নিতে চাই:\\n\\n${offer.title}\\n📱 অপারেটর: ${offer.operator}\\n💰 দাম: ৳${offer.selling_price}\\n\\nঅনুগ্রহ করে আমাকে পরবর্তী ধাপ জানান।`,
    );
  };

  const savings = offer.original_price
    ? offer.original_price - offer.selling_price
    : 0;
  const isCombo = offer.category === "combo";
  const isLocationSpecific = offer.region && offer.region !== "All Bangladesh";

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm hover:shadow-md transition-all duration-200 hover:scale-[1.01] space-y-4">
      {/* Header Section */}
      <div className="flex justify-between items-start">
        <div className="flex-1 space-y-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className={`operator-badge ${getOperatorClass(offer.operator)} text-xs font-bold px-3 py-1.5 rounded-full text-white`}
            >
              {offer.operator}
            </span>
            {isCombo && <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-semibold">📦 Combo</span>}
            {isLocationSpecific && (
              <span className="bg-orange-100 text-orange-700 px-2 py-1 rounded-full text-xs font-semibold">📍 {offer.region}</span>
            )}
          </div>

          <h3 className="text-lg font-bold text-gray-900 leading-tight">{offer.title}</h3>

          <p className="text-sm text-gray-600 font-medium">
            <span className="text-blue-600 font-bold">{offer.data_amount}</span>
            {offer.minutes > 0 && <span className="text-green-600"> + {offer.minutes} min</span>}
            <span className="text-gray-400 mx-1">•</span>
            <span className="text-purple-600 font-semibold">{offer.validity_days} days</span>
          </p>
        </div>

        {/* Pricing Section */}
        <div className="text-right space-y-1">
          {offer.original_price && (
            <div className="text-gray-400 text-sm line-through">৳{offer.original_price}</div>
          )}
          <div className="text-2xl font-bold text-gray-900">৳{offer.selling_price}</div>
          {savings > 0 && <div className="text-green-600 text-xs font-bold bg-green-50 px-2 py-1 rounded-full inline-block">Save ৳{savings}</div>}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        {/* Top row - Favorite and Compare */}
        {/* <div className="grid grid-cols-2 gap-3">
          {onToggleFavorite && (
            <button
              onClick={onToggleFavorite}
              className={`h-11 rounded-xl border-2 transition-all duration-200 flex items-center justify-center gap-2 text-sm font-medium ${
                isFavorite
                  ? "bg-red-50 border-red-200 text-red-600 hover:bg-red-100 hover:scale-105"
                  : "bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100 hover:scale-105"
              }`}
            >
              <Heart size={16} className={isFavorite ? "fill-current" : ""} />
              <span className="hidden sm:inline">{isFavorite ? "Favorited" : "Favorite"}</span>
            </button>
          )}

          {onToggleComparison && (
            <button
              onClick={onToggleComparison}
              disabled={!canAddToComparison && !isInComparison}
              className={`h-11 rounded-xl border-2 transition-all duration-200 flex items-center justify-center gap-2 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed ${
                isInComparison
                  ? "bg-blue-50 border-blue-200 text-blue-600 hover:bg-blue-100 hover:scale-105"
                  : "bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100 hover:scale-105"
              }`}
            >
              <GitCompare size={16} />
              <span className="hidden sm:inline">{isInComparison ? "In Compare" : "Compare"}</span>
            </button>
          )}
        </div> */}

        {/* Bottom row - Order buttons */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={onPhoneOrder}
            className="h-12 rounded-xl border-2 border-gray-200 bg-white hover:bg-gray-50 transition-all duration-200 flex items-center justify-center gap-2 text-sm font-medium text-gray-700 hover:scale-105"
          >
            <Phone size={18} />
            <span>Call</span>
          </button>

          <button
            onClick={onWhatsAppOrder}
            className="h-12 rounded-xl bg-green-600 hover:bg-green-700 text-white transition-all duration-200 flex items-center justify-center gap-2 text-sm font-bold hover:scale-105 shadow-lg"
          >
            <MessageCircle size={18} />
            <span>WhatsApp</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default OfferCard;