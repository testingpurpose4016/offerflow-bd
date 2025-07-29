import { Sparkles } from "lucide-react";

interface StatsBarProps {
  availableOffers: number;
  lastUpdated?: string;
}

const StatsBar = ({ availableOffers, lastUpdated = "today" }: StatsBarProps) => {
  return (
    <div className="flex items-center justify-between px-4 py-3 bg-blue-50 rounded-lg border border-blue-100">
      <span className="text-gray-700 text-sm font-medium">
        <span className="font-bold text-blue-600">{availableOffers}</span> offers available
      </span>

      <div className="flex items-center gap-1 text-green-600 text-xs font-medium">
        <Sparkles size={14} />
        <span className="hidden sm:inline">Updated {lastUpdated}</span>
        <span className="sm:hidden">Live</span>
      </div>
    </div>
  );
};

export default StatsBar;