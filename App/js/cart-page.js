import { getCart, removeFromCart, updateCartQuantity, getCartCount } from "./cart.js";
import { getRewardsSnapshot, applyTierBorderToLogo, createTransaction } from "./rewards-system.js";
import { shippingQuote, money, POINTS_PER_DOLLAR } from "./shipping.js";

// Promo codes live in localStorage and are managed in the admin dashboard.
const PROMO_STORAGE_KEY = "promo_codes_v1";
const APPLIED_PROMO_KEY = "applied_promo_v1";
const PROMO_USAGE_KEY = "promo_usage_v1";

function safeJsonParse(v, fallback) {
  try { return JSON.parse(v); } catch { return fallback; }
}

function normalizeEmail(v) {
  return String(v || "").trim().toLowerCase();
}

function getCurrentUserEmail() {
  const u = safeJsonParse(localStorage.getItem("current_user") || "null", null);
  return normalizeEmail(u?.email || u?.userEmail || u?.username || "");
}

function getPromoCodes() {
  return safeJsonParse(localStorage.getItem(PROMO_STORAGE_KEY) || "[]", []);
}

function userHasPromoAccess(promo, email) {
  if (!promo) return false;
  if (!promo.active) return false;

  const allowed = Array.isArray(promo.allowedEmails) ? promo.allowedEmails : [];
  if (allowed.length === 0) return true;

  const e = normalizeEmail(email);
  return allowed.map(normalizeEmail).includes(e);
}

function getPromoUsage() {
  return safeJsonParse(localStorage.getItem(PROMO_USAGE_KEY) || "{}", {});
}

function savePromoUsage(usage) {
  localStorage.setItem(PROMO_USAGE_KEY, JSON.stringify(usage || {}));
}

function withinWindow(promo, now = new Date()) {
  const start = promo?.startAt ? new Date(promo.startAt) : null;
  const end = promo?.endAt ? new Date(promo.endAt) : null;

  if (start && !isNaN(start) && now < start) return false;
  if (end && !isNaN(end) && now > end) return false;
  return true;
}

function cartHasEligibleItem(cart, promo) {
  const ids = Array.isArray(promo?.productIds) ? promo.productIds.map(Number) : [];
  if (ids.length === 0) return true;
  return cart.some(it => ids.includes(Number(it.productId)));
}

function canUsePromo(promo, email) {
  const usage = getPromoUsage();
  const id = String(promo?.id || promo?.code || "");
  const bucket = usage[id] || { total: 0, byEmail: {} };

  const totalMax = Number(promo?.maxTotalUses);
  if (Number.isFinite(totalMax) && totalMax > 0 && Number(bucket.total || 0) >= totalMax) {
    return { ok: false, message: "This promo has reached its maximum total uses." };
  }

  const perMax = Number(promo?.maxUsesPerCustomer);
  const e = normalizeEmail(email);
  if (Number.isFinite(perMax) && perMax > 0 && e) {
    const used = Number(bucket.byEmail?.[e] || 0);
    if (used >= perMax) return { ok: false, message: "You have already used this promo the maximum number of times." };
  }

  return { ok: true };
}

function recordPromoUse(promo, email) {
  if (!promo?.id) return;
  const usage = getPromoUsage();
  const id = String(promo.id);
  if (!usage[id]) usage[id] = { total: 0, byEmail: {} };
  usage[id].total = Number(usage[id].total || 0) + 1;

  const e = normalizeEmail(email);
  if (e) usage[id].byEmail[e] = Number(usage[id].byEmail?.[e] || 0) + 1;

  savePromoUsage(usage);
}

function setAppliedPromo(promo) {
  if (!promo) {
    localStorage.removeItem(APPLIED_PROMO_KEY);
    return;
  }
  // Store only what checkout needs for pricing + usage tracking.
  localStorage.setItem(APPLIED_PROMO_KEY, JSON.stringify({
    id: promo.id,
    code: promo.code,
    type: promo.type,
    value: promo.value ?? null,
    productIds: Array.isArray(promo.productIds) ? promo.productIds.map(Number) : [],
    startAt: promo.startAt ?? null,
    endAt: promo.endAt ?? null,
    maxTotalUses: promo.maxTotalUses ?? null,
    maxUsesPerCustomer: promo.maxUsesPerCustomer ?? null,
  }));
}

function getAppliedPromo() {
  return safeJsonParse(localStorage.getItem(APPLIED_PROMO_KEY) || "null", null);
}

function clearAppliedPromo() {
  localStorage.removeItem(APPLIED_PROMO_KEY);
}

// IMPORTANT:
// This project is often run with Live Server using /App as the web root.
// In that setup, importing "../../Auth/mockDb.js" fails (404) and the entire
// cart page stops rendering. So we access the same localStorage-backed data
// directly here instead of importing across folders.

function getCurrentUser() {
  try {
    return JSON.parse(localStorage.getItem("current_user")) || null;
  } catch {
    return null;
  }
}

function getUsers() {
  try {
    return JSON.parse(localStorage.getItem("app_users")) || [];
  } catch {
    return [];
  }
}

function saveUsers(users) {
  localStorage.setItem("app_users", JSON.stringify(users || []));
}

function setCurrentUser(user) {
  localStorage.setItem("current_user", JSON.stringify(user));
}

const PRODUCTS = [
  { id: 1, name: "Pro Diver", price: 74, tag: "Dress", img: "./images/products/pro-diver.jpg" },
  { id: 2, name: "Expedition Scout", price: 40, tag: "Sport", img: "./images/products/expedition-scout.jpg" },
  { id: 3, name: "Seascape Auto", price: 199, tag: "Dress", img: "./images/products/seascape-auto.jpg" },
  { id: 4, name: "Trail Runner", price: 89, tag: "Sport", img: "./images/products/trail-runner.jpg" },
  { id: 5, name: "City Classic", price: 129, tag: "Dress", img: "./images/products/city-classic.jpg" },
  { id: 6, name: "Aero Chrono", price: 159, tag: "Sport", img: "./images/products/aero-chrono.jpg" },
];

function normalizeCardNumber(raw) {
  return String(raw || "").replace(/[^0-9]/g, "");
}

function inferBrandFromNumber(num) {
  if (/^4/.test(num)) return "VISA";
  if (/^(5[1-5])/.test(num)) return "MASTERCARD";
  if (/^3[47]/.test(num)) return "AMEX";
  if (/^6/.test(num)) return "DISCOVER";
  return "CARD";
}

function safeLast4(num) {
  const digits = normalizeCardNumber(num);
  return digits.length >= 4 ? digits.slice(-4) : "";
}

function getCartTotals(cart) {
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
  if (el) {
    // Update only the text while preserving the link
    const count = getCartCount();
    el.textContent = `Cart (${count})`;
  }
  updateCartDropdown();
}

function updateCartDropdown() {
  const dropdown = document.getElementById("cart-dropdown");
  if (!dropdown) return;
  
  const cart = getCart();
  if (cart.length === 0) {
    dropdown.innerHTML = '<div class="cart-empty">Cart is empty</div>';
    return;
  }
  
  let totalPrice = 0;
  let html = '';
  for (let item of cart) {
    const product = PRODUCTS.find(p => p.id === item.productId);
    if (!product) continue;
    
    const lineTotal = product.price * item.qty;
    totalPrice += lineTotal;
    
    html += `
      <div class="cart-item">
        <div class="cart-item-header">
          <span class="cart-item-name">${product.name}</span>
          <span class="cart-item-qty">x${item.qty}</span>
        </div>
        <div class="cart-item-details">
          <span class="cart-item-unit">$${product.price} each</span>
          <span class="cart-item-total">$${lineTotal.toFixed(2)}</span>
        </div>
      </div>
    `;
  }
  
  html += `
    <div class="cart-dropdown-total">
      <strong>Total: $${totalPrice.toFixed(2)}</strong>
    </div>
  `;
  
  dropdown.innerHTML = html;
}

function renderCart() {
  const container = document.getElementById("cart-container");
  const cart = getCart();
  
  if (cart.length === 0) {
    container.innerHTML = `
      <div class="empty-cart">
        <p>Your cart is empty</p>
        <a href="./store.html" class="btn btn--primary">Continue Shopping</a>
      </div>
    `;
    return;
  }

  let totalPrice = 0;
  let itemsHTML = '';
  const rewards = getRewardsSnapshot();
  applyTierBorderToLogo(rewards.tier);

  for (let item of cart) {
    const product = PRODUCTS.find(p => p.id === item.productId);
    if (!product) continue;

    const lineTotal = product.price * item.qty;
    totalPrice += lineTotal;

    itemsHTML += `
      <div class="cart-line-item">
        <div class="line-item-media">
          <img class="cart-thumb" src="${product.img || './images/store-card-placeholder.webp'}" alt="${product.name}" loading="lazy" />
        </div>
        <div class="line-item-info">
          <h4>${product.name}</h4>
          <p class="line-item-price">$${product.price} each</p>
        </div>
        <div class="line-item-qty">
          <label for="qty-${product.id}">Quantity:</label>
          <input type="number" id="qty-${product.id}" class="qty-input" data-product-id="${product.id}" min="1" value="${item.qty}" />
        </div>
        <div class="line-item-remove">
          <label for="remove-${product.id}">Remove:</label>
          <div class="remove-controls">
            <input type="number" id="remove-${product.id}" class="remove-input" data-remove-qty="${product.id}" min="1" max="${item.qty}" value="1" />
            <button class="btn btn--danger btn--sm" data-remove-item="${product.id}">Remove</button>
          </div>
        </div>
        <div class="line-item-total">
          <p>$${lineTotal.toFixed(2)}</p>
        </div>
      </div>
    `;
  }

  const currentUser = getCurrentUser();
  const savedMethods = (currentUser && Array.isArray(currentUser.paymentMethods)) ? currentUser.paymentMethods : [];
  const hasSaved = savedMethods.length > 0;

  const defaults = {
    country: currentUser?.country || "",
    state: currentUser?.state || "",
    city: currentUser?.city || "",
  };

  container.innerHTML = `
    <div class="cart-items">
      ${itemsHTML}
    </div>

    <hr class="cart-break" />

    <div class="cart-summary cart-summary--full">
      <h3 style="margin:0 0 10px 0">Checkout</h3>

      <div class="summary-row">
        <span>Subtotal:</span>
        <span id="sumSubtotal">$${totalPrice.toFixed(2)}</span>
      </div>
      <div class="summary-row" style="margin-top:12px">
        <strong>Promo code</strong>
      </div>
      <div class="summary-row" style="gap:10px; align-items:center; margin-top:10px; flex-wrap:wrap;">
        <input id="promoInputCheckout" placeholder="Enter promo code" style="flex:1; min-width:180px;" />
        <button class="secondary" id="applyPromoCheckoutBtn" type="button" style="width:auto;">Apply</button>
      </div>
      <div id="promoApplyMsg" class="xsmall" style="opacity:.85; margin-top:8px"></div>


      <div class="summary-row" id="promoRow" style="display:none; margin-top:10px">
        <span>Promo (<span id="promoCodeLabel"></span>):</span>
        <span id="sumPromoDiscount">-</span>
      </div>
      <div class="summary-row" id="promoRemoveRow" style="display:none; margin-top:6px">
        <button class="secondary" id="removePromoBtn" type="button" style="width:100%">Remove promo</button>
      </div>

      <div class="summary-row" style="margin-top:12px">
        <strong>Shipping destination</strong>
      </div>
      <div class="summary-row" style="gap:10px; align-items:center; margin-top:10px">
        <label for="shipCountry" style="min-width:160px">Country</label>
        <input id="shipCountry" value="${defaults.country}" placeholder="US, CA, MX..." style="width: 170px" />
      </div>
      <div class="summary-row" style="gap:10px; align-items:center; margin-top:10px">
        <label for="shipState" style="min-width:160px">State / Province</label>
        <input id="shipState" value="${defaults.state}" placeholder="TX, MN, ..." style="width: 170px" />
      </div>
      <div class="summary-row" style="gap:10px; align-items:center; margin-top:10px">
        <label for="shipCity" style="min-width:160px">City (optional)</label>
        <input id="shipCity" value="${defaults.city}" placeholder="El Paso" style="width: 170px" />
      </div>

      <div class="summary-row" style="margin-top:12px">
        <span>Cart qty:</span>
        <span id="sumQty">${getCartTotals(cart).qty}</span>
      </div>

      <div class="summary-row" style="margin-top:12px">
        <span>Available points:</span>
        <span id="sumAvailPts">${rewards.availablePoints}</span>
      </div>
      <div class="summary-row" style="gap:10px; align-items:center; margin-top:10px">
        <label for="redeemPoints" style="min-width:160px">Use points</label>
        <input id="redeemPoints" type="number" min="0" step="1" value="0" style="width:140px" />
      </div>
      <div class="summary-row" style="margin-top:8px">
        <span class="xsmall" style="opacity:.8">${POINTS_PER_DOLLAR} pts = $1 off</span>
      </div>

      <div class="summary-row" style="margin-top:14px">
        <strong>Payment</strong>
      </div>

      ${hasSaved ? `
        <div class="summary-row" style="gap:10px; align-items:center; margin-top:10px">
          <label for="paymentSelect" style="min-width:160px">Saved method</label>
          <select id="paymentSelect" style="width: 170px; padding:10px 12px; border-radius: var(--radius-sm); border:1px solid var(--color-border); background: var(--color-surface-alt); color: var(--color-text);">
            ${savedMethods.map(pm => `<option value="${pm.token}">${pm.brand} •••• ${pm.last4}</option>`).join("")}
            <option value="new">Use a new card</option>
          </select>
        </div>
      ` : `
        <div class="summary-row" style="margin-top:10px">
          <span class="xsmall" style="opacity:.85">No saved payment methods${currentUser ? "" : " (log in to save one)"}.</span>
        </div>
      `}

      <div id="newCardFields" style="margin-top:10px; ${hasSaved ? "display:none" : ""}">
        <div class="summary-row" style="gap:10px; align-items:center; margin-top:10px">
          <label for="cardName" style="min-width:160px">Name on card</label>
          <input id="cardName" placeholder="Jane Q. Customer" autocomplete="cc-name" style="width: 170px" />
        </div>
        <div class="summary-row" style="gap:10px; align-items:center; margin-top:10px">
          <label for="cardNumber" style="min-width:160px">Card number</label>
          <input id="cardNumber" inputmode="numeric" placeholder="1234 5678 9012 3456" autocomplete="cc-number" style="width: 170px" />
        </div>
        <div class="summary-row" style="gap:10px; align-items:center; margin-top:10px">
          <label for="cardExpMonth" style="min-width:160px">Exp month</label>
          <input id="cardExpMonth" inputmode="numeric" placeholder="MM" maxlength="2" autocomplete="cc-exp-month" style="width: 80px" />
          <label for="cardExpYear" style="min-width:70px">Year</label>
          <input id="cardExpYear" inputmode="numeric" placeholder="YYYY" maxlength="4" autocomplete="cc-exp-year" style="width: 90px" />
        </div>
        <div class="summary-row" style="gap:10px; align-items:center; margin-top:10px">
          <label for="cardCvv" style="min-width:160px">CVV</label>
          <input id="cardCvv" inputmode="numeric" placeholder="123" maxlength="4" autocomplete="cc-csc" style="width: 90px" />
          <label for="cardZip" style="min-width:70px">ZIP</label>
          <input id="cardZip" placeholder="ZIP" autocomplete="postal-code" style="width: 90px" />
        </div>
        ${currentUser ? `
          <div class="summary-row" style="gap:10px; align-items:center; margin-top:10px">
            <label style="min-width:160px">Save to account</label>
            <input id="saveNewCard" type="checkbox" style="width:auto" />
          </div>
        ` : ``}
        <div class="summary-row" style="margin-top:8px">
          <span class="xsmall" style="opacity:.8">Demo: full card number/CVV are not stored.</span>
        </div>
      </div>

      <div class="summary-row" style="margin-top:16px">
        <span>Shipping:</span>
        <span id="sumShipping">-</span>
      </div>
      <div class="summary-row">
        <span>Points discount:</span>
        <span id="sumDiscount">-</span>
      </div>
      <div class="summary-row summary-total" style="margin-top:6px">
        <span>Total due:</span>
        <span id="sumTotalDue">-</span>
      </div>

      <div id="shipMessage" class="xsmall" style="opacity:.85; margin-top:10px"></div>

      <button class="btn btn--accent" id="checkoutBtn" style="width: 100%; margin-top: 16px;">Checkout</button>
    </div>
  `;

  function updateQuoteUI() {
    const country = container.querySelector("#shipCountry")?.value || "";
    const state = container.querySelector("#shipState")?.value || "";
    const redeemInput = container.querySelector("#redeemPoints");
    let pts = Math.floor(Number(redeemInput?.value) || 0);
    if (pts < 0) pts = 0;
    if (pts > rewards.availablePoints) pts = rewards.availablePoints;
    if (redeemInput) redeemInput.value = String(pts);

    const cartNow = getCart();
    const totals = getCartTotals(cartNow);

    // Promo (validated at checkout only)
    const applied = getAppliedPromo();
    const promoApplyMsg = container.querySelector("#promoApplyMsg");

    let promoDiscount = 0;
    let freeShip = false;

    if (applied?.code) {
      const promos = getPromoCodes();
      const full = promos.find(p => String(p.id) === String(applied.id)) ||
                   promos.find(p => String(p.code || "").toUpperCase() === String(applied.code || "").toUpperCase());

      const email = getCurrentUserEmail();

      // Hard validation every time totals change so we don't "apply" dead codes.
      const invalid = (!full || !full.active || !userHasPromoAccess(full, email) || !withinWindow(full) || !cartHasEligibleItem(cartNow, full));
      const useGate = full ? canUsePromo(full, email) : { ok: false, message: "Promo is unavailable." };

      if (invalid) {
        clearAppliedPromo();
        if (promoApplyMsg) promoApplyMsg.textContent = "Promo removed (no longer valid for this cart/account).";
      } else if (!useGate.ok) {
        clearAppliedPromo();
        if (promoApplyMsg) promoApplyMsg.textContent = useGate.message;
      } else {
        // Compute discount for eligible items only.
        const ids = Array.isArray(full.productIds) ? full.productIds.map(Number) : [];
        const isEligible = (pid) => ids.length === 0 || ids.includes(Number(pid));

        if (full.type === "percent") {
          const pct = Math.max(0, Math.min(90, Number(full.value) || 0));
          const eligibleSubtotal = cartNow.reduce((sum, it) => {
            if (!isEligible(it.productId)) return sum;
            const p = PRODUCTS.find(x => x.id === it.productId);
            if (!p) return sum;
            return sum + (p.price * Math.max(0, Number(it.qty) || 0));
          }, 0);
          promoDiscount = Number((eligibleSubtotal * (pct / 100)).toFixed(2));
        }

        if (full.type === "free_shipping") {
          freeShip = true;
        }

        if (full.type === "bogo") {
          const unitPrices = [];
          for (let it of cartNow) {
            if (!isEligible(it.productId)) continue;
            const p = PRODUCTS.find(x => x.id === it.productId);
            if (!p) continue;
            const q = Math.max(0, Math.floor(Number(it.qty) || 0));
            for (let i = 0; i < q; i++) unitPrices.push(p.price);
          }
          unitPrices.sort((a,b) => a - b);
          const freeCount = Math.floor(unitPrices.length / 2);
          promoDiscount = Number(unitPrices.slice(0, freeCount).reduce((s,n)=>s+n, 0).toFixed(2));
        }

        if (promoApplyMsg) {
          const scope = (Array.isArray(full.productIds) && full.productIds.length) ? "Eligible products only." : "All products.";
          promoApplyMsg.textContent = `Applied: ${full.code}. ${scope}`;
        }
      }
    } else {
      if (promoApplyMsg) promoApplyMsg.textContent = "";
    }


    const promoRow = container.querySelector("#promoRow");
    const promoRemoveRow = container.querySelector("#promoRemoveRow");
    const promoCodeLabel = container.querySelector("#promoCodeLabel");
    const promoDiscEl = container.querySelector("#sumPromoDiscount");
    if (applied?.code && promoRow && promoCodeLabel && promoDiscEl) {
      promoRow.style.display = "flex";
      promoRemoveRow.style.display = "block";
      promoCodeLabel.textContent = applied.code;
      promoDiscEl.textContent = promoDiscount > 0 ? `-${money(promoDiscount)}` : "-";
    } else {
      if (promoRow) promoRow.style.display = "none";
      if (promoRemoveRow) promoRemoveRow.style.display = "none";
    }

    const cartValueAfterPromo = Math.max(0, Number((totals.value - promoDiscount).toFixed(2)));

    // Cap points to what remains after promo
    const maxPtsByOrder = Math.floor(cartValueAfterPromo * POINTS_PER_DOLLAR);
    pts = Math.min(pts, maxPtsByOrder);
    if (redeemInput) redeemInput.value = String(pts);

    const quote = shippingQuote({
      country,
      state,
      cartQty: totals.qty,
      cartValue: cartValueAfterPromo,
      pointsToUse: pts,
      availablePoints: rewards.availablePoints,
    });

    const shipEl = container.querySelector("#sumShipping");
    const discEl = container.querySelector("#sumDiscount");
    const totalDueEl = container.querySelector("#sumTotalDue");
    const msgEl = container.querySelector("#shipMessage");

    if (!quote.ok) {
      if (shipEl) shipEl.textContent = "-";
      if (discEl) discEl.textContent = "-";
      if (totalDueEl) totalDueEl.textContent = "-";
      if (msgEl) msgEl.textContent = quote.message;
      return { ok: false, pointsUsed: pts };
    }

    // Apply free shipping promo after quote
    if (quote.ok && freeShip) {
      quote.shipping = 0;
      quote.message = `Shipping: ${money(0)} • Order after points: ${money(quote.orderAfterPoints)} • Points used: ${quote.pointsUsed} (${money(quote.pointsValue)} off) • Promo: ${applied.code}`;
    }

    const totalDue = Number((quote.orderAfterPoints + quote.shipping).toFixed(2));
    if (shipEl) shipEl.textContent = money(quote.shipping);
    if (discEl) discEl.textContent = `-${money(quote.pointsValue)}`;
    if (totalDueEl) totalDueEl.textContent = money(totalDue);
    if (msgEl) msgEl.textContent = quote.message;

    return { ok: true, quote, pointsUsed: quote.pointsUsed, totalDue };
  }

  // Initial quote
  updateQuoteUI();

  const removePromoBtn = container.querySelector("#removePromoBtn");
  if (removePromoBtn) {
    removePromoBtn.addEventListener("click", () => {
      clearAppliedPromo();
      updateQuoteUI();
    });
  }
  const promoInput = container.querySelector("#promoInputCheckout");
  const promoBtn = container.querySelector("#applyPromoCheckoutBtn");
  const promoMsg = container.querySelector("#promoApplyMsg");

  if (promoBtn && promoInput) {
    // Show existing applied promo in the input
    const existing = getAppliedPromo();
    if (existing?.code) promoInput.value = existing.code;

    promoBtn.addEventListener("click", () => {
      const code = String(promoInput.value || "").trim().toUpperCase().replace(/\s+/g, "");
      if (!code) { if (promoMsg) promoMsg.textContent = "Enter a promo code."; return; }

      const promos = getPromoCodes();
      const promo = promos.find(p => String(p.code || "").toUpperCase() === code);

      if (!promo) { clearAppliedPromo(); if (promoMsg) promoMsg.textContent = "Invalid code."; updateQuoteUI(); return; }

      const email = getCurrentUserEmail();
      const cartNow = getCart();

      if (!userHasPromoAccess(promo, email)) { clearAppliedPromo(); if (promoMsg) promoMsg.textContent = "This code is restricted for your account."; updateQuoteUI(); return; }
      if (!withinWindow(promo)) { clearAppliedPromo(); if (promoMsg) promoMsg.textContent = "This promo is not active right now."; updateQuoteUI(); return; }
      if (!cartHasEligibleItem(cartNow, promo)) { clearAppliedPromo(); if (promoMsg) promoMsg.textContent = "This promo doesn't apply to anything in your cart."; updateQuoteUI(); return; }

      const gate = canUsePromo(promo, email);
      if (!gate.ok) { clearAppliedPromo(); if (promoMsg) promoMsg.textContent = gate.message; updateQuoteUI(); return; }

      setAppliedPromo(promo);
      if (promoMsg) promoMsg.textContent = `Applied: ${promo.code}`;
      updateQuoteUI();
    });
  }


  // React to inputs
  ["shipCountry","shipState","redeemPoints"].forEach(id => {
    const node = container.querySelector(`#${id}`);
    if (node) node.addEventListener("input", updateQuoteUI);
  });

  const paymentSelect = container.querySelector("#paymentSelect");
  const newFields = container.querySelector("#newCardFields");
  if (paymentSelect && newFields) {
    paymentSelect.addEventListener("change", () => {
      newFields.style.display = (paymentSelect.value === "new") ? "block" : "none";
    });
  }

  const checkoutBtn = container.querySelector("#checkoutBtn");
  checkoutBtn.addEventListener("click", () => {
    const q = updateQuoteUI();
    if (!q.ok) {
      alert("Fix shipping destination first.");
      return;
    }

    // Payment validation
    let paymentUsed = null;
    if (paymentSelect && paymentSelect.value !== "new") {
      paymentUsed = paymentSelect.value;
    } else {
      const nameOnCard = container.querySelector("#cardName")?.value.trim() || "";
      const cardNumber = normalizeCardNumber(container.querySelector("#cardNumber")?.value);
      const expMonth = container.querySelector("#cardExpMonth")?.value.trim() || "";
      const expYear = container.querySelector("#cardExpYear")?.value.trim() || "";
      const cvv = String(container.querySelector("#cardCvv")?.value || "").trim();
      const billingZip = container.querySelector("#cardZip")?.value.trim() || "";

      if (!nameOnCard) return alert("Enter the name on the card.");
      if (!/^\d{13,19}$/.test(cardNumber)) return alert("Enter a valid card number (13-19 digits).");
      if (!/^(0?[1-9]|1[0-2])$/.test(expMonth)) return alert("Exp month must be 1-12.");
      if (!/^\d{4}$/.test(expYear)) return alert("Exp year must be 4 digits (YYYY).");
      if (!/^\d{3,4}$/.test(cvv)) return alert("CVV must be 3-4 digits.");
      if (!billingZip) return alert("Billing ZIP/Postal is required.");

      const brand = inferBrandFromNumber(cardNumber);
      const last4 = safeLast4(cardNumber);
      const token = `tok_${Math.random().toString(36).slice(2)}_${Date.now()}`;
      paymentUsed = token;

      // Save to account if requested
      const saveBox = container.querySelector("#saveNewCard");
      if (currentUser && saveBox && saveBox.checked) {
        const updated = { ...currentUser };
        updated.paymentMethods = [
          ...(updated.paymentMethods || []),
          { token, brand, last4, nameOnCard, expMonth: String(expMonth).padStart(2, "0"), expYear, billingZip }
        ];

        const users = getUsers();
        const idx = users.findIndex(u => u.email === currentUser.email);
        if (idx >= 0) users[idx] = updated;
        saveUsers(users);
        setCurrentUser(updated);
      }
    }

    // Build items list for history
    const items = getCart().map((item) => {
      const product = PRODUCTS.find((p) => p.id === item.productId);
      return {
        sku: product ? `SKU-${product.id}` : `SKU-${item.productId}`,
        name: product ? product.name : "Unknown Item",
        qty: item.qty,
        price: product ? product.price : 0,
      };
    });

    // Record transaction
    const appliedPromo = getAppliedPromo();

    createTransaction({
      // Spend should reflect what was actually charged (after promos/points + shipping).
      amount: Number(q.totalDue.toFixed(2)),
      items,
      pointsSpent: q.pointsUsed,
      meta: {
        shipping: q.quote.shipping,
        totalDue: q.totalDue,
        promo: appliedPromo || null,
        paymentToken: paymentUsed,
        shipTo: { country: q.quote.country, state: q.quote.state },
      }
    });

    // Record promo usage (demo-only localStorage counter)
    if (appliedPromo?.id) {
      recordPromoUse(appliedPromo, getCurrentUserEmail());
      clearAppliedPromo();
    }

    // Clear cart after checkout
    localStorage.removeItem("cart_items");
    setCartBadge();
    renderCart();

    alert("Checkout complete. Transaction recorded as PENDING until it clears.");
  });

  // Add event listeners
  const removeButtons = container.querySelectorAll("[data-remove-item]");
  removeButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const productId = Number(btn.getAttribute("data-remove-item"));
      const cartNow = getCart();
      const line = cartNow.find(it => Number(it.productId) === productId);
      if (!line) return;

      const removeInput = container.querySelector(`[data-remove-qty="${productId}"]`);
      let removeQty = Number(removeInput?.value || 1);
      if (!Number.isFinite(removeQty) || removeQty < 1) removeQty = 1;

      // Clamp to what's actually in the cart.
      removeQty = Math.min(removeQty, Number(line.qty) || 1);

      const nextQty = (Number(line.qty) || 1) - removeQty;
      if (nextQty <= 0) {
        removeFromCart(productId);
      } else {
        updateCartQuantity(productId, nextQty);
      }

      setCartBadge();
      renderCart();
    });
  });

  const qtyInputs = container.querySelectorAll(".qty-input");
  qtyInputs.forEach(input => {
    input.addEventListener("change", (e) => {
      const productId = Number(input.getAttribute("data-product-id"));
      const newQty = Number(input.value);
      updateCartQuantity(productId, newQty);
      // Keep the remove-qty control sane.
      const removeInput = container.querySelector(`[data-remove-qty="${productId}"]`);
      if (removeInput) {
        removeInput.max = String(newQty);
        if (Number(removeInput.value) > newQty) removeInput.value = String(newQty);
      }
      setCartBadge();
      renderCart();
    });
  });
}

function init() {
  setCartBadge();

  // Apply tier border to logo even if cart is empty
  const rewards = getRewardsSnapshot();
  applyTierBorderToLogo(rewards.tier);

  renderCart();
}

document.addEventListener("DOMContentLoaded", init);
