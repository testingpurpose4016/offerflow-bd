import { useState, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface FilterTabsProps {
  activeFilter: string;
  onFilterChange: (filter: string) => void;
  offerCounts: Record<string, number>;
}

const FilterTabs = ({ activeFilter, onFilterChange, offerCounts }: FilterTabsProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeftScroll, setShowLeftScroll] = useState(false);
  const [showRightScroll, setShowRightScroll] = useState(true);

  const filters = [
    { id: "all", label: "সবগুলি", count: offerCounts.all || 0 },
    { id: "GP", label: "GP", count: offerCounts.GP || 0 },
    { id: "Robi", label: "Robi", count: offerCounts.Robi || 0 },
    { id: "Banglalink", label: "Banglalink", count: offerCounts.Banglalink || 0 },
    { id: "Airtel", label: "Airtel", count: offerCounts.Airtel || 0 },
    { id: "Skitto", label: "Skitto", count: offerCounts.Skitto || 0 },
  ];

  const checkScrollButtons = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setShowLeftScroll(scrollLeft > 0);
      setShowRightScroll(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 200;
      const newScrollLeft = direction === 'left' 
        ? scrollRef.current.scrollLeft - scrollAmount
        : scrollRef.current.scrollLeft + scrollAmount;
      
      scrollRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="relative bg-white rounded-xl border border-gray-200 shadow-sm">
      {/* Left Scroll Button */}
      {showLeftScroll && (
        <button
          onClick={() => scroll('left')}
          className="absolute left-1 top-1/2 -translate-y-1/2 z-10 bg-white/95 backdrop-blur-sm p-2 rounded-full shadow-lg border border-gray-200"
        >
          <ChevronLeft size={18} className="text-gray-600" />
        </button>
      )}

      {/* Filter Tabs Container */}
      <div
        ref={scrollRef}
        onScroll={checkScrollButtons}
        className="flex gap-2 overflow-x-auto scrollbar-hide px-4 py-4"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {filters.map((filter) => (
          <button
            key={filter.id}
            onClick={() => onFilterChange(filter.id)}
            className={`filter-tab ${
              activeFilter === filter.id ? 'active' : 'inactive'
            }`}
          >
            {filter.label}
            {filter.count > 0 && (
              <span className="ml-1 text-xs opacity-75">({filter.count})</span>
            )}
          </button>
        ))}
      </div>

      {/* Right Scroll Button */}
      {showRightScroll && (
        <button
          onClick={() => scroll('right')}
          className="absolute right-1 top-1/2 -translate-y-1/2 z-10 bg-white/95 backdrop-blur-sm p-2 rounded-full shadow-lg border border-gray-200"
        >
          <ChevronRight size={18} className="text-gray-600" />
        </button>
      )}

    </div>
  );
};

export default FilterTabs;