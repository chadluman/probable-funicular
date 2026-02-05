import { getRewardsSnapshot, applyTierBorderToLogo } from "./rewards-system.js";

// Apply tier border on the homepage logo.
document.addEventListener("DOMContentLoaded", () => {
  const rewards = getRewardsSnapshot();
  applyTierBorderToLogo(rewards.tier);
});
