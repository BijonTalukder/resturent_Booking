// utils/priceUtils.js

/**
 * Calculate the price based on quantity and price tiers.
 * @param {number} quantity - The selected quantity.
 * @param {number} basePrice - The default/base price of the product or variant.
 * @param {Array} priceTiers - The price tiers array (e.g., [{ minQty, maxQty, price }]).
 * @returns {number} - The calculated price.
 */
export const calculatePrice = (quantity, basePrice, priceTiers) => {
  // If no price tiers are provided, return the base price
  if (!priceTiers || priceTiers.length === 0) {
    return basePrice;
  }

  // Find the applicable price tier
  const applicableTier = priceTiers.find(
    (tier) => quantity >= tier.minQty && quantity <= tier.maxQty
  );

  // If an applicable tier is found, return its price
  if (applicableTier) {
    return parseFloat(applicableTier.price); // Convert price to a number
  }

  // If quantity is >= 100, look for a tier with maxQty >= 100
  if (quantity >= 100) {
    const tierForLargeQuantity = priceTiers.find(
      (tier) => tier.maxQty >= 100
    );

    // If a tier for large quantities exists, return its price
    if (tierForLargeQuantity) {
      return parseFloat(tierForLargeQuantity.price);
    }
  }

  // If no applicable tier is found, return the base price
  return basePrice;
};