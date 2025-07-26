import { Sparkles } from "lucide-react";

interface StatsBarProps {
  availableOffers: number;
  lastUpdated?: string;
}

const StatsBar = ({ availableOffers, lastUpdated = "today" }: StatsBarProps) => {
  return (
    <div className="flex items-center justify-between px-4 py-3 border-b border-border/50">
      <span className="stats-text">
        {availableOffers} offers available
      </span>
      
      <div className="flex items-center gap-1 text-success text-sm">
        <Sparkles size={14} />
        <span>Updated {lastUpdated}</span>
      </div>
    </div>
  );
};

export default StatsBar;