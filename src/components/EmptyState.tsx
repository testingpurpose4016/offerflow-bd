import { Smartphone, RefreshCw } from "lucide-react";

interface EmptyStateProps {
  title?: string;
  description?: string;
  showRefresh?: boolean;
  onRefresh?: () => void;
}

const EmptyState = ({ 
  title = "No offers found", 
  description = "Try selecting a different operator or check back later",
  showRefresh = false,
  onRefresh 
}: EmptyStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="bg-muted/50 rounded-full p-4 mb-4">
        <Smartphone size={48} className="text-muted-foreground" />
      </div>
      
      <h3 className="heading-md text-foreground mb-2">{title}</h3>
      <p className="body-md text-muted max-w-sm mb-6">{description}</p>
      
      {showRefresh && onRefresh && (
        <button
          onClick={onRefresh}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
        >
          <RefreshCw size={16} />
          Refresh
        </button>
      )}
    </div>
  );
};

export default EmptyState;