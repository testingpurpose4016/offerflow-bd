import { Smartphone, Heart, GitCompare } from "lucide-react";

interface AppHeaderProps {
  balance: number;
  favoriteCount?: number;
  comparisonCount?: number;
  onFavoritesClick?: () => void;
  onComparisonClick?: () => void;
}

const AppHeader = ({
  balance,
  favoriteCount = 0,
  comparisonCount = 0,
  onFavoritesClick,
  onComparisonClick,
}: AppHeaderProps) => {
  return (
    <header className="bg-background border-b border-border px-4 py-4">
      <div className="flex items-center justify-between">
        {/* App Title */}
        <div className="flex-1 text-center">
          <h1 className="heading-lg text-foreground">রিয়েলদের সিম অফার</h1>
          <p className="body-sm text-muted">সবচেয়ে কম দামে সিম অফার</p>
        </div>

        {/* Balance and Actions */}
        <div className="flex items-center gap-3">
          <div className="balance-display">
            <Smartphone size={14} />
            <span>৳{balance.toLocaleString()}</span>
          </div>

          {/* Favorites */}
          <button
            onClick={onFavoritesClick}
            className="relative p-1 hover:bg-muted rounded-md transition-colors"
          >
            <Heart
              size={18}
              className={
                favoriteCount > 0
                  ? "text-red-500 fill-red-500"
                  : "text-muted-foreground"
              }
            />
            {favoriteCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                {favoriteCount}
              </span>
            )}
          </button>

          {/* Comparison */}
          <button
            onClick={onComparisonClick}
            className="relative p-1 hover:bg-muted rounded-md transition-colors"
          >
            <GitCompare
              size={18}
              className={
                comparisonCount > 0 ? "text-blue-500" : "text-muted-foreground"
              }
            />
            {comparisonCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                {comparisonCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
