import { getRewardsSnapshot, applyTierBorderToLogo } from "./rewards-system.js";

function money(n) {
  return new Intl.NumberFormat(undefined, { style: "currency", currency: "USD" }).format(n);
}

function setText(id, v) {
  const el = document.getElementById(id);
  if (el) el.textContent = v;
}

document.addEventListener("DOMContentLoaded", () => {
  const snapshot = getRewardsSnapshot();
  applyTierBorderToLogo(snapshot.tier);

  setText("tierValue", snapshot.tier.toUpperCase());
  setText("projectedTier", snapshot.projectedTier.toUpperCase());
  setText("clearedSpend", money(snapshot.clearedSpend30d));
  setText("pendingSpend", money(snapshot.pendingSpend30d));
  setText("availablePoints", String(snapshot.availablePoints));
  setText("pendingPoints", String(snapshot.pendingPoints));
});
