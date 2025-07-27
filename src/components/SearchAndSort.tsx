import { useState } from "react";
import { Search, SlidersHorizontal, Download, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { exportToCSV } from "@/lib/utils";
import { type Offer } from "@/hooks/useOffers";

interface SearchAndSortProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
  categoryFilter: string;
  onCategoryChange: (category: string) => void;
  priceRange: [number, number];
  onPriceRangeChange: (range: [number, number]) => void;
  validityFilter: number;
  onValidityFilterChange: (days: number) => void;
  offers: Offer[];
  showAdvanced: boolean;
  onToggleAdvanced: () => void;
}

const SearchAndSort = ({
  searchTerm,
  onSearchChange,
  sortBy,
  onSortChange,
  categoryFilter,
  onCategoryChange,
  priceRange,
  onPriceRangeChange,
  validityFilter,
  onValidityFilterChange,
  offers,
  showAdvanced,
  onToggleAdvanced,
}: SearchAndSortProps) => {
  const [localMinPrice, setLocalMinPrice] = useState(priceRange[0].toString());
  const [localMaxPrice, setLocalMaxPrice] = useState(priceRange[1].toString());

  const handleExportCSV = () => {
    exportToCSV(offers, "filtered-offers");
  };

  const handlePriceRangeSubmit = () => {
    const min = parseInt(localMinPrice) || 0;
    const max = parseInt(localMaxPrice) || 10000;
    onPriceRangeChange([min, max]);
  };

  const clearFilters = () => {
    onSearchChange("");
    onSortChange("newest");
    onCategoryChange("all");
    onPriceRangeChange([0, 10000]);
    onValidityFilterChange(0);
    setLocalMinPrice("0");
    setLocalMaxPrice("10000");
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-3 space-y-3 shadow-sm">
      {/* Search Bar */}
      <div className="relative">
        <Search
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          size={18}
        />
        <Input
          type="text"
          placeholder="Search offers..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-11 pr-4 h-12 text-base border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Quick Actions */}
      <div className="flex gap-2 flex-wrap">
        <Button
          variant="outline"
          size="sm"
          onClick={onToggleAdvanced}
          className="flex items-center gap-2"
        >
          <SlidersHorizontal size={14} />
          {showAdvanced ? "Hide Filters" : "Show Filters"}
        </Button>



        <Button
          variant="outline"
          size="sm"
          onClick={clearFilters}
          className="flex items-center gap-2"
        >
          <X size={14} />
          Clear All
        </Button>
      </div>

      {/* Advanced Filters */}
      {showAdvanced && (
        <div className="space-y-4 p-4 bg-muted/30 rounded-lg border">
          {/* Sort Options */}
          <div>
            <label className="block text-sm font-medium mb-2">Sort By</label>
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value)}
              className="w-full p-2 border border-border rounded-md bg-background"
            >
              <option value="newest">Newest First</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="validity-high">Validity: High to Low</option>
              <option value="validity-low">Validity: Low to High</option>
              <option value="data-high">Data: High to Low</option>
            </select>
          </div>

          {/* Category Filter */}
          <div>
            <label className="block text-sm font-medium mb-2">Category</label>
            <select
              value={categoryFilter}
              onChange={(e) => onCategoryChange(e.target.value)}
              className="w-full p-2 border border-border rounded-md bg-background"
            >
              <option value="all">All Categories</option>
              <option value="internet">Internet Only</option>
              <option value="combo">Combo Packs</option>
              <option value="minutes">Minutes Only</option>
              <option value="sms">SMS Packs</option>
            </select>
          </div>

          {/* Price Range */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Price Range (৳)
            </label>
            <div className="flex gap-2 items-center">
              <Input
                type="number"
                placeholder="Min"
                value={localMinPrice}
                onChange={(e) => setLocalMinPrice(e.target.value)}
                className="flex-1"
              />
              <span className="text-muted-foreground">to</span>
              <Input
                type="number"
                placeholder="Max"
                value={localMaxPrice}
                onChange={(e) => setLocalMaxPrice(e.target.value)}
                className="flex-1"
              />
              <Button size="sm" onClick={handlePriceRangeSubmit}>
                Apply
              </Button>
            </div>
          </div>

          {/* Validity Filter */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Minimum Validity (Days)
            </label>
            <select
              value={validityFilter}
              onChange={(e) => onValidityFilterChange(parseInt(e.target.value))}
              className="w-full p-2 border border-border rounded-md bg-background"
            >
              <option value={0}>Any Validity</option>
              <option value={7}>7+ Days</option>
              <option value={15}>15+ Days</option>
              <option value={30}>30+ Days</option>
              <option value={60}>60+ Days</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchAndSort;
