const OfferCardSkeleton = () => {
  return (
    <div className="offer-card space-y-4">
      {/* Header Section Skeleton */}
      <div className="flex justify-between items-start">
        <div className="flex-1 space-y-3">
          <div className="flex items-center gap-2">
            <div className="shimmer h-6 w-12 rounded-md"></div>
            <div className="shimmer h-6 w-16 rounded-md"></div>
          </div>
          
          <div className="shimmer h-5 w-48 rounded"></div>
          <div className="shimmer h-4 w-32 rounded"></div>
        </div>

        {/* Pricing Section Skeleton */}
        <div className="text-right space-y-2">
          <div className="shimmer h-3 w-12 rounded"></div>
          <div className="shimmer h-6 w-16 rounded"></div>
          <div className="shimmer h-4 w-14 rounded-md"></div>
        </div>
      </div>

      {/* Action Buttons Skeleton */}
      <div className="flex gap-2">
        <div className="shimmer h-11 flex-1 rounded-lg"></div>
        <div className="shimmer h-11 w-11 rounded-lg"></div>
      </div>
    </div>
  );
};

export default OfferCardSkeleton;