import { Smartphone, ShoppingCart } from "lucide-react";

interface AppHeaderProps {
  balance: number;
  cartItems?: number;
}

const AppHeader = ({ balance, cartItems = 0 }: AppHeaderProps) => {
  return (
    <header className="bg-background border-b border-border px-4 py-4">
      <div className="flex items-center justify-between">
        {/* App Title */}
        <div className="flex-1 text-center">
          <h1 className="heading-lg text-foreground">রিয়েলদের সিম অফার</h1>
          <p className="body-sm text-muted">সবচেয়ে কম দামে সিম অফার</p>
        </div>

        {/* Balance and Cart */}
        <div className="flex items-center gap-3">
          <div className="balance-display">
            <Smartphone size={14} />
            <span>৳{balance.toLocaleString()}</span>
          </div>
          
          <div className="relative">
            <ShoppingCart size={18} className="text-muted-foreground" />
            {cartItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {cartItems}
              </span>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default AppHeader;