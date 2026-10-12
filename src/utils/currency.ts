/**
 * Indian Rupee (INR / ₹) formatting and currency utilities for BIAS FOLIO.
 * Formats all numbers using the standard Indian numbering system:
 * - ₹5,000 (Five Thousand Rupees)
 * - ₹50,000 (Fifty Thousand Rupees)
 * - ₹1,00,000 (One Lakh Rupees)
 * - ₹10,00,000 (Ten Lakh Rupees)
 * - ₹1,00,00,000 (One Crore Rupees)
 *
 * Denominated purely in Indian Rupees (₹) without USD or foreign exchange dependencies.
 */

export function formatIndianNumber(amount: number): string {
  if (isNaN(amount) || amount === null || amount === undefined) {
    return '0';
  }
  return new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: 0
  }).format(Math.round(amount));
}

export function formatINR(amount: number): string {
  return `₹${formatIndianNumber(amount)}`;
}

/**
 * Returns a human-readable Indian unit description (e.g. "1 Lakh", "10 Lakhs", "1.5 Crores")
 * for accessible display in educational tables and charts.
 */
export function formatIndianDenominationWords(amount: number): string {
  if (isNaN(amount) || amount <= 0) return '₹0';
  
  if (amount >= 10000000) {
    const crores = amount / 10000000;
    return `₹${crores % 1 === 0 ? crores : crores.toFixed(2)} Crore${crores > 1 ? 's' : ''}`;
  }
  
  if (amount >= 100000) {
    const lakhs = amount / 100000;
    return `₹${lakhs % 1 === 0 ? lakhs : lakhs.toFixed(2)} Lakh${lakhs > 1 ? 's' : ''}`;
  }
  
  return formatINR(amount);
}
