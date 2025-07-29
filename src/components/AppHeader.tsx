import { Smartphone, Heart, GitCompare, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import UserPreferences from "@/components/UserPreferences";

interface AppHeaderProps {
  balance: number;
  favoriteCount?: number;
  comparisonCount?: number;
  onFavoritesClick?: () => void;
  onComparisonClick?: () => void;
  onHomeClick?: () => void;
}

const AppHeader = ({
  balance,
  favoriteCount = 0,
  comparisonCount = 0,
  onFavoritesClick,
  onComparisonClick,
  onHomeClick,
}: AppHeaderProps) => {
  return (
    <header className="bg-white border-b border-gray-200 px-4 py-4 sticky top-0 z-50 backdrop-blur-sm shadow-sm">
      <div className="flex items-center justify-between">
        {/* Home Button */}
        {onHomeClick && (
          <Button
            onClick={onHomeClick}
            variant="ghost"
            size="sm"
            className="mr-3 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
          >
            <Home size={18} />
          </Button>
        )}

        {/* App Title */}
        <div className="flex-1">
          <h1 className="text-xl font-bold text-gray-900 text-center sm:text-left">রিয়েলদের সিম অফার</h1>
          <p className="text-sm text-gray-600 text-center sm:text-left font-medium">সবচেয়ে কম দামে সিম অফার</p>
        </div>

        {/* Balance and Actions */}
        <div className="flex items-center gap-3">
          <div className="bg-blue-50 text-blue-700 px-3 py-2 rounded-xl flex items-center gap-2 text-sm font-bold">
            <Smartphone size={16} />
            <span className="hidden sm:inline">৳{balance.toLocaleString()}</span>
            <span className="sm:hidden">৳{balance}</span>
          </div>

          {/* User Preferences */}
          <UserPreferences />

          {/* Favorites */}
          {/* <button
            onClick={onFavoritesClick}
            className="relative p-3 hover:bg-gray-100 rounded-xl transition-all duration-200 hover:scale-110"
            aria-label="Favorites"
          >
            <Heart
              size={20}
              className={
                favoriteCount > 0
                  ? "text-red-500 fill-red-500"
                  : "text-gray-400"
              }
            />
            {favoriteCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center font-bold">
                {favoriteCount}
              </span>
            )}
          </button> */}

          {/* Comparison */}
          {/* <button
            onClick={onComparisonClick}
            className="relative p-3 hover:bg-gray-100 rounded-xl transition-all duration-200 hover:scale-110"
            aria-label="Compare"
          >
            <GitCompare
              size={20}
              className={
                comparisonCount > 0 ? "text-blue-500" : "text-gray-400"
              }
            />
            {comparisonCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center font-bold">
                {comparisonCount}
              </span>
            )}
          </button> */}
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
