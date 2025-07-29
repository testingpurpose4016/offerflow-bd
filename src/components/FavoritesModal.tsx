import { X, MessageCircle, Phone, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { type Offer } from "@/lib/api/contracts";
import OfferCard from "./OfferCard";

interface FavoritesModalProps {
  isOpen: boolean;
  onClose: () => void;
  favoriteOffers: Offer[];
  onWhatsAppOrder: (offer: Offer) => void;
  onPhoneOrder: (offer: Offer) => void;
  onRemoveFromFavorites: (offerId: string) => void;
}

const FavoritesModal = ({
  isOpen,
  onClose,
  favoriteOffers,
  onWhatsAppOrder,
  onPhoneOrder,
  onRemoveFromFavorites,
}: FavoritesModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-background rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-2">
            <Heart className="text-red-500 fill-red-500" size={20} />
            <h2 className="heading-lg">
              Favorite Offers ({favoriteOffers.length})
            </h2>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X size={20} />
          </Button>
        </div>

        {/* Favorites Content */}
        <div className="p-4">
          {favoriteOffers.length === 0 ? (
            <div className="text-center py-8">
              <Heart className="mx-auto text-muted-foreground mb-4" size={48} />
              <p className="text-muted-foreground">No favorite offers yet</p>
              <p className="text-sm text-muted-foreground mt-2">
                Tap the heart icon on offers to save them here
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {favoriteOffers.map((offer) => (
                <OfferCard
                  key={offer.id}
                  offer={offer}
                  onWhatsAppOrder={() => onWhatsAppOrder(offer)}
                  onPhoneOrder={() => onPhoneOrder(offer)}
                  isFavorite={true}
                  onToggleFavorite={() => onRemoveFromFavorites(offer.id)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-border p-4">
          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">
              {favoriteOffers.length} favorite offer
              {favoriteOffers.length !== 1 ? "s" : ""}
            </p>
            <Button onClick={onClose}>Close</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FavoritesModal;
