import { X, MessageCircle, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { type Offer } from "@/hooks/useOffers";

interface ComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  offers: Offer[];
  onWhatsAppOrder: (offer: Offer) => void;
  onPhoneOrder: (offer: Offer) => void;
  onRemoveFromComparison: (offerId: string) => void;
}

const ComparisonModal = ({
  isOpen,
  onClose,
  offers,
  onWhatsAppOrder,
  onPhoneOrder,
  onRemoveFromComparison,
}: ComparisonModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-background rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="heading-lg">Compare Offers ({offers.length}/3)</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X size={20} />
          </Button>
        </div>

        {/* Comparison Content */}
        <div className="p-4">
          {offers.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                No offers selected for comparison
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Add offers to compare their features
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {offers.map((offer) => (
                <div
                  key={offer.id}
                  className="border border-border rounded-lg p-4 relative"
                >
                  {/* Remove button */}
                  <button
                    onClick={() => onRemoveFromComparison(offer.id)}
                    className="absolute top-2 right-2 p-1 hover:bg-muted rounded-full"
                  >
                    <X size={16} className="text-muted-foreground" />
                  </button>

                  {/* Offer Details */}
                  <div className="space-y-3">
                    <div>
                      <span
                        className={`operator-badge operator-${offer.operator.toLowerCase()}`}
                      >
                        {offer.operator}
                      </span>
                      <h3 className="heading-sm mt-2">{offer.title}</h3>
                    </div>

                    {/* Comparison Table */}
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Data:</span>
                        <span className="font-medium">{offer.data_amount}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Minutes:</span>
                        <span className="font-medium">{offer.minutes}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Validity:</span>
                        <span className="font-medium">
                          {offer.validity_days} days
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Price:</span>
                        <span className="font-bold text-primary">
                          ৳{offer.selling_price}
                        </span>
                      </div>
                      {offer.original_price && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">
                            Original:
                          </span>
                          <span className="text-sm line-through text-muted-foreground">
                            ৳{offer.original_price}
                          </span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Region:</span>
                        <span className="font-medium">{offer.region}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Category:</span>
                        <span className="font-medium capitalize">
                          {offer.category}
                        </span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 pt-2">
                      <button
                        onClick={() => onWhatsAppOrder(offer)}
                        className="whatsapp-button flex-1 text-sm h-9"
                      >
                        <MessageCircle size={14} />
                        WhatsApp
                      </button>
                      <button
                        onClick={() => onPhoneOrder(offer)}
                        className="secondary-button w-9 h-9"
                      >
                        <Phone size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-border p-4">
          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">
              You can compare up to 3 offers at once
            </p>
            <Button onClick={onClose}>Close</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComparisonModal;
