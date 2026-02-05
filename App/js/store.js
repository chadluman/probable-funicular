import { addToCart, getCartCount, getCart, removeFromCart } from "./cart.js";
import { shippingQuote, money, normalizeCountry, POINTS_PER_DOLLAR } from "./shipping.js";
import { getRewardsSnapshot, applyTierBorderToLogo } from "./rewards-system.js";

// Promo codes are created/managed in the admin dashboard and stored in localStorage.
// Store + cart pages read from this same storage so it's consistent.
const PROMO_STORAGE_KEY = "promo_codes_v1";
const APPLIED_PROMO_KEY = "applied_promo_v1";

function safeJsonParse(v, fallback) {
  try { return JSON.parse(v); } catch { return fallback; }
}

function getCurrentUserEmail() {
  const u = safeJsonParse(localStorage.getItem("current_user") || "null", null);
  const email = u?.email || u?.userEmail || u?.username;
  return email ? String(email).toLowerCase() : "";
}

function normalizeEmail(v) {
  return String(v || "").trim().toLowerCase();
}

function getPromoCodes() {
  return safeJsonParse(localStorage.getItem(PROMO_STORAGE_KEY) || "[]", []);
}

function userHasPromoAccess(promo, email) {
  if (!promo) return false;
  if (!promo.active) return false;
  if (!Array.isArray(promo.allowedEmails) || promo.allowedEmails.length === 0) return true;
  const e = normalizeEmail(email);
  return promo.allowedEmails.map(normalizeEmail).includes(e);
}

function setAppliedPromo(promo) {
  if (!promo) {
    localStorage.removeItem(APPLIED_PROMO_KEY);
    return;
  }
  // Store only what we need at checkout.
  localStorage.setItem(APPLIED_PROMO_KEY, JSON.stringify({
    id: promo.id,
    code: promo.code,
    type: promo.type,
    value: promo.value ?? null,
  }));
}

function getAppliedPromo() {
  return safeJsonParse(localStorage.getItem(APPLIED_PROMO_KEY) || "null", null);
}

// Simple shared catalog (demo)
export const PRODUCTS = [
  { id: 1, name: "Pro Diver", price: 74, tag: "Dress", img: "./images/products/pro-diver.jpg" },
  { id: 2, name: "Expedition Scout", price: 40, tag: "Sport", img: "./images/products/expedition-scout.jpg" },
  { id: 3, name: "Seascape Auto", price: 199, tag: "Dress", img: "./images/products/seascape-auto.jpg" },
  { id: 4, name: "Trail Runner", price: 89, tag: "Sport", img: "./images/products/trail-runner.jpg" },
  { id: 5, name: "City Classic", price: 129, tag: "Dress", img: "./images/products/city-classic.jpg" },
  { id: 6, name: "Aero Chrono", price: 159, tag: "Sport", img: "./images/products/aero-chrono.jpg" },
];

function getCartTotals(cart = getCart()) {
  let qty = 0;
  let value = 0;

  for (let item of cart) {
    const product = PRODUCTS.find((p) => p.id === item.productId);
    if (!product) continue;
    qty += Number(item.qty || 0);
    value += product.price * Number(item.qty || 0);
  }

  return { qty, value: Number(value.toFixed(2)) };
}

function setCartBadge() {
  const el = document.getElementById("cart-badge");
  if (el) el.textContent = `Cart (${getCartCount()})`;
}

function renderGrid(list) {
  const grid = document.getElementById("store-grid");
  if (!grid) return;

  grid.innerHTML = "";

  for (let p of list) {
    const card = document.createElement("article");
    card.className = "card";
    card.innerHTML = `
      <img
        src="${p.img || './images/placeholder.jpg'}"
        alt="${p.name}"
        class="product-img"
        
        onerror="this.onerror=null;this.src='./images/placeholder.jpg'"
      />
      <h4>${p.name}</h4>
      <p>$${p.price}</p>
      <p class="xsmall card-category">Category: ${p.tag}</p>

      <div class="qty-input-wrapper">
        <input type="number" class="qty-input" data-qty-input="${p.id}" min="1" value="1" />
      </div>

      <button class="btn btn--accent btn--sm" data-add="${p.id}" type="button">Add to cart</button>
      <button class="btn btn--danger btn--sm btn--remove" data-remove="${p.id}" type="button">Remove</button>
    `;
    grid.appendChild(card);
  }
}

function bindGridEvents() {
  const grid = document.getElementById("store-grid");
  if (!grid) return;

  // Avoid double-binding if init runs twice
  if (grid.dataset.bound === "1") return;
  grid.dataset.bound = "1";

  grid.addEventListener("click", (e) => {
    const addBtn = e.target.closest("[data-add]");
    const removeBtn = e.target.closest("[data-remove]");

    if (addBtn) {
      const pid = Number(addBtn.getAttribute("data-add"));
      const qtyInput = grid.querySelector(`[data-qty-input="${pid}"]`);
      const qty = Math.max(1, Number(qtyInput?.value || 1));
      addToCart(pid, qty);

      const originalText = addBtn.textContent;
      addBtn.textContent = "✓ Added!";
      addBtn.style.opacity = "0.7";
      setTimeout(() => {
        addBtn.textContent = originalText;
        addBtn.style.opacity = "1";
      }, 1200);

      if (qtyInput) qtyInput.value = "1";
      setCartBadge();
      syncShippingUI({ recalc: true });
      syncShippingCheckoutVisibility();
    }

    if (removeBtn) {
      const pid = Number(removeBtn.getAttribute("data-remove"));
      removeFromCart(pid);
      setCartBadge();
      syncShippingUI({ recalc: true });
      syncShippingCheckoutVisibility();
    }
  });
}

// ----- Shipping calculator -----

function getDestinationDefaults() {
  const raw = localStorage.getItem("current_user");
  const user = raw ? JSON.parse(raw) : null;

  return {
    country: user?.country || "",
    state: user?.state || "",
    city: user?.city || "",
  };
}

function syncShippingUI({ recalc = false } = {}) {
  const qtyEl = document.getElementById("shipCartQty");
  const valEl = document.getElementById("shipCartValue");
  const pointsHint = document.getElementById("shipPointsHint");
  const pointsUse = document.getElementById("shipPointsUse");

  if (qtyEl || valEl) {
    const { qty, value } = getCartTotals();
    if (qtyEl) qtyEl.value = String(qty);
    if (valEl) valEl.value = money(value);
  }

  const rewards = getRewardsSnapshot();
  if (pointsHint) {
    pointsHint.textContent = `Available: ${rewards.availablePoints} pts (${POINTS_PER_DOLLAR} pts = $1 off)`;
  }

  // Clamp points input
  if (pointsUse) {
    const maxPts = Number(rewards.availablePoints || 0);
    const current = Math.max(0, Number(pointsUse.value || 0));
    if (current > maxPts) pointsUse.value = String(maxPts);
  }

  if (recalc) {
    // Quietly refresh the displayed estimate if it exists
    const resultEl = document.getElementById("shippingResult");
    if (resultEl && resultEl.textContent.trim()) {
      calculateShipping(true);
    }
  }
}

function calculateShipping(silent = false) {
  const resultEl = document.getElementById("shippingResult");
  if (!resultEl) return;

  const countryEl = document.getElementById("shipCountry");
  const stateEl = document.getElementById("shipState");
  const cityEl = document.getElementById("shipCity");
  const pointsUseEl = document.getElementById("shipPointsUse");

  const { qty, value } = getCartTotals();
  const rewards = getRewardsSnapshot();

  const dest = {
    country: normalizeCountry(countryEl?.value || ""),
    state: String(stateEl?.value || "").trim(),
    city: String(cityEl?.value || "").trim(),
  };

  const pointsToUse = Math.max(0, Math.min(Number(pointsUseEl?.value || 0), Number(rewards.availablePoints || 0)));

  if (!dest.country || !dest.state) {
    if (!silent) resultEl.textContent = "Select a country and enter a state/province to estimate shipping.";
    return;
  }

  const quote = shippingQuote({
    country: dest.country,
    state: dest.state,
    city: dest.city,
    cartQty: qty,
    cartValue: value,
    pointsToUse,
    availablePoints: Number(rewards.availablePoints || 0),
  });

  resultEl.textContent =
    `Est. shipping: ${money(quote.shipping)} · Subtotal: ${money(value)} · ` +
    `Points: -${money(quote.pointsDiscount)} · Est. total: ${money(quote.totalAfterPoints + quote.shipping)}`;
}

function syncShippingCheckoutVisibility() {
  const btn = document.getElementById("shipCheckoutBtn");
  if (!btn) return;
  const { qty } = getCartTotals();
  btn.disabled = qty <= 0;
  btn.setAttribute("aria-disabled", String(qty <= 0));
}

function bindShippingEvents() {
  const calcBtn = document.getElementById("calcShipBtn");
  if (calcBtn) calcBtn.addEventListener("click", () => calculateShipping(false));

  const inputs = ["shipCountry", "shipState", "shipCity", "shipPointsUse"];
  for (let id of inputs) {
    const el = document.getElementById(id);
    if (el) el.addEventListener("input", () => calculateShipping(true));
    if (el) el.addEventListener("change", () => calculateShipping(true));
  }

  const checkoutBtn = document.getElementById("shipCheckoutBtn");
  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", () => {
      window.location.href = "./cart.html";
    });
  }
}

// ----- Promo code (simple demo) -----
function bindPromo() {
  const input = document.getElementById("promoInput");
  const btn = document.getElementById("applyPromoBtn");
  const out = document.getElementById("promoResult");
  if (!input || !btn || !out) return;

  btn.addEventListener("click", () => {
    const code = String(input.value || "").trim().toUpperCase().replace(/\s+/g, "");
    if (!code) { out.textContent = "Enter a code."; return; }

    const promos = getPromoCodes();
    const promo = promos.find(p => String(p.code || "").toUpperCase() === code);
    if (!promo) {
      setAppliedPromo(null);
      out.textContent = "Invalid code.";
      return;
    }

    const email = getCurrentUserEmail();
    if (!userHasPromoAccess(promo, email)) {
      setAppliedPromo(null);
      out.textContent = "This code is restricted for your account.";
      return;
    }

    setAppliedPromo(promo);
    if (promo.type === "percent") out.textContent = `Applied: ${promo.code} (${promo.value}% off).`;
    else if (promo.type === "free_shipping") out.textContent = `Applied: ${promo.code} (free shipping).`;
    else if (promo.type === "bogo") out.textContent = `Applied: ${promo.code} (BOGO at checkout).`;
    else out.textContent = `Applied: ${promo.code}.`;
  });

  // Show existing applied promo on load
  const existing = getAppliedPromo();
  if (existing?.code) {
    input.value = existing.code;
    if (existing.type === "percent") out.textContent = `Applied: ${existing.code} (${existing.value}% off).`;
    else if (existing.type === "free_shipping") out.textContent = `Applied: ${existing.code} (free shipping).`;
    else if (existing.type === "bogo") out.textContent = `Applied: ${existing.code} (BOGO at checkout).`;
    else out.textContent = `Applied: ${existing.code}.`;
  }
}

// ----- Filter -----
function bindFilter() {
  const select = document.getElementById("categoryFilter");
  const apply = document.getElementById("applyFilter");
  if (!select || !apply) return;

  apply.addEventListener("click", () => {
    const tag = select.value;
    if (tag === "all") renderGrid(PRODUCTS);
    else renderGrid(PRODUCTS.filter((p) => p.tag === tag));
  });
}

// ----- Init -----
function init() {
  // Prefill destination if user is logged in
  const defaults = getDestinationDefaults();
  const countryEl = document.getElementById("shipCountry");
  const stateEl = document.getElementById("shipState");
  const cityEl = document.getElementById("shipCity");

  if (countryEl && defaults.country) countryEl.value = defaults.country;
  if (stateEl && defaults.state) stateEl.value = defaults.state;
  if (cityEl && defaults.city) cityEl.value = defaults.city;

  const rewards = getRewardsSnapshot();
  applyTierBorderToLogo(rewards.tier);

  renderGrid(PRODUCTS);
  bindGridEvents();
  bindFilter();
  bindShippingEvents();
  bindPromo();

  setCartBadge();
  syncShippingUI({ recalc: false });
  syncShippingCheckoutVisibility();

  window.addEventListener("cart:updated", () => {
    setCartBadge();
    syncShippingUI({ recalc: true });
    syncShippingCheckoutVisibility();
  });
}

document.addEventListener("DOMContentLoaded", init);
