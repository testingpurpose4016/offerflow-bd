import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { type Offer } from "@/hooks/useOffers";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// CSV Export utility
export function exportToCSV(offers: Offer[], filename: string = "offers") {
  const headers = [
    "Operator",
    "Title",
    "Data Amount",
    "Minutes",
    "Validity (Days)",
    "Selling Price",
    "Original Price",
    "Region",
    "Category",
    "WhatsApp Number",
  ];

  const csvContent = [
    headers.join(","),
    ...offers.map((offer) =>
      [
        offer.operator,
        `"${offer.title}"`,
        offer.data_amount,
        offer.minutes,
        offer.validity_days,
        offer.selling_price,
        offer.original_price,
        offer.region,
        offer.category,
        offer.whatsapp_number,
      ].join(","),
    ),
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute(
    "download",
    `${filename}_${new Date().toISOString().split("T")[0]}.csv`,
  );
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Favorites utility functions
export const getFavorites = (): string[] => {
  const favorites = localStorage.getItem("sim-offer-favorites");
  return favorites ? JSON.parse(favorites) : [];
};

export const addToFavorites = (offerId: string): void => {
  const favorites = getFavorites();
  if (!favorites.includes(offerId)) {
    favorites.push(offerId);
    localStorage.setItem("sim-offer-favorites", JSON.stringify(favorites));
  }
};

export const removeFromFavorites = (offerId: string): void => {
  const favorites = getFavorites();
  const updated = favorites.filter((id) => id !== offerId);
  localStorage.setItem("sim-offer-favorites", JSON.stringify(updated));
};

export const isFavorite = (offerId: string): boolean => {
  return getFavorites().includes(offerId);
};

// Comparison utility functions
export const getComparison = (): string[] => {
  const comparison = localStorage.getItem("sim-offer-comparison");
  return comparison ? JSON.parse(comparison) : [];
};

export const addToComparison = (offerId: string): void => {
  const comparison = getComparison();
  if (!comparison.includes(offerId) && comparison.length < 3) {
    comparison.push(offerId);
    localStorage.setItem("sim-offer-comparison", JSON.stringify(comparison));
  }
};

export const removeFromComparison = (offerId: string): void => {
  const comparison = getComparison();
  const updated = comparison.filter((id) => id !== offerId);
  localStorage.setItem("sim-offer-comparison", JSON.stringify(updated));
};

export const clearComparison = (): void => {
  localStorage.removeItem("sim-offer-comparison");
};

export const isInComparison = (offerId: string): boolean => {
  return getComparison().includes(offerId);
};
