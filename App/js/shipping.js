// shipping.js
// Shared shipping estimation logic used by store + cart modal.

export const POINTS_PER_DOLLAR = 100; // 100 pts = $1.00 off (demo rule)

export function money(n) {
  return new Intl.NumberFormat(undefined, { style: "currency", currency: "USD" }).format(n);
}

export function normalizeCountry(v) {
  const key = String(v || "").trim().toUpperCase();
  if (["US", "USA", "UNITED STATES", "UNITED STATES OF AMERICA"].includes(key)) return "US";
  if (["CA", "CAN", "CANADA"].includes(key)) return "CA";
  if (["MX", "MEX", "MEXICO"].includes(key)) return "MX";
  if (key === "OTHER") return "OTHER";
  if (key) return "OTHER";
  return "";
}

export function normalizeState(v) {
  return String(v || "").trim().toUpperCase();
}

export function shippingQuote({ country, state, cartQty, cartValue, pointsToUse = 0, availablePoints = 0 }) {
  const c = normalizeCountry(country);
  const s = normalizeState(state);

  if (!c) return { ok: false, message: "Pick a country.", shipping: null };
  if ((c === "US" || c === "CA" || c === "MX") && !s) return { ok: false, message: "Enter a state/province.", shipping: null };
  if (cartQty <= 0) return { ok: false, message: "Your cart is empty.", shipping: null };

  const pts = Math.max(0, Math.floor(Number(pointsToUse) || 0));
  const maxPts = Math.max(0, Math.floor(Number(availablePoints) || 0));
  const ptsUsed = Math.min(pts, maxPts);

  const discount = ptsUsed / POINTS_PER_DOLLAR;
  const orderAfterPoints = Math.max(0, Number(cartValue || 0) - discount);

  // Base by destination
  let base = 0;
  if (c === "US") base = 7.99;
  else if (c === "MX") base = 10.99;
  else if (c === "CA") base = 12.99;
  else base = 24.99;

  // Surcharges / discounts
  let surcharge = 0;

  // Remote US states
  if (c === "US" && ["AK", "HI"].includes(s)) surcharge += 10;

  // Cart quantity
  if (cartQty > 2) surcharge += (cartQty - 2) * 0.75;

  let shipping = base + surcharge;

  const freeThreshold = (c === "US" ? 300 : 400);
  if (orderAfterPoints >= freeThreshold) shipping = 0;

  if (shipping > 0) shipping = Math.max(4.99, shipping);
  shipping = Number(shipping.toFixed(2));

  return {
    ok: true,
    country: c,
    state: s,
    cartQty,
    cartValue: Number(Number(cartValue || 0).toFixed(2)),
    availablePoints: maxPts,
    pointsUsed: ptsUsed,
    pointsValue: Number(discount.toFixed(2)),
    orderAfterPoints: Number(orderAfterPoints.toFixed(2)),
    shipping,
    message: `Shipping: ${money(shipping)} • Order after points: ${money(orderAfterPoints)} • Points used: ${ptsUsed} (${money(discount)} off)`,
  };
}
