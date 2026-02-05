import { getCart, getCartCount } from "./cart.js";
import { getRewardsSnapshot } from "./rewards-system.js";
import { shippingQuote, money } from "./shipping.js";

// Simple shared catalog (demo)
const PRODUCTS = [
  { id: 1, name: "Pro Diver", price: 74, tag: "Dress", img: "./images/products/pro-diver.jpg" },
  { id: 2, name: "Expedition Scout", price: 40, tag: "Sport", img: "./images/products/expedition-scout.jpg" },
  { id: 3, name: "Seascape Auto", price: 199, tag: "Dress", img: "./images/products/seascape-auto.jpg" },
  { id: 4, name: "Trail Runner", price: 89, tag: "Sport", img: "./images/products/trail-runner.jpg" },
  { id: 5, name: "City Classic", price: 129, tag: "Dress", img: "./images/products/city-classic.jpg" },
  { id: 6, name: "Aero Chrono", price: 159, tag: "Sport", img: "./images/products/aero-chrono.jpg" },
];

function getCartTotals() {
  const cart = getCart();
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
  if (!el) return;
  el.textContent = `Cart (${getCartCount()})`;
}

function getDestinationFromPageOrProfile() {
  // Prefer the store shipping form if it's present
  const shipCountry = document.getElementById("shipCountry");
  const shipState = document.getElementById("shipState");

  if (shipCountry && shipState) {
    return {
      country: shipCountry.value || "",
      state: shipState.value || "",
    };
  }

  // Fall back to stored user profile
  const raw = localStorage.getItem("current_user");
  const user = raw ? JSON.parse(raw) : null;
  return {
    country: user?.country || "",
    state: user?.state || "",
  };
}

function ensureModal() {
  if (document.getElementById("cartModal")) return;

  const modal = document.createElement("div");
  modal.id = "cartModal";
  modal.className = "cart-modal";
  modal.innerHTML = `
    <div class="cart-modal__backdrop" data-cart-close></div>
    <div class="cart-modal__panel" role="dialog" aria-modal="true" aria-label="Cart">
      <div class="cart-modal__header">
        <h3 style="margin:0">Your Cart</h3>
        <button class="btn btn--sm btn--outline" type="button" data-cart-close aria-label="Close">Close</button>
      </div>

      <div class="cart-modal__body">
        <div id="cartModalBody"></div>
      </div>

      <div class="cart-modal__footer">
        <a class="btn btn--outline" href="./store.html">Continue shopping</a>
        <a class="btn btn--primary" href="./cart.html">Checkout</a>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  modal.addEventListener("click", (e) => {
    const close = e.target.closest("[data-cart-close]");
    if (close) hideModal();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") hideModal();
  });
}

function renderModal() {
  const body = document.getElementById("cartModalBody");
  if (!body) return;

  const cart = getCart();
  const totals = getCartTotals();
  const rewards = getRewardsSnapshot();

  if (cart.length === 0) {
    body.innerHTML = `
      <div class="empty-cart">
        <p style="margin:0">Your cart is empty.</p>
      </div>
    `;
    return;
  }

  let itemsHtml = "";
  for (let item of cart) {
    const product = PRODUCTS.find((p) => p.id === item.productId);
    if (!product) continue;
    const lineTotal = product.price * item.qty;

    itemsHtml += `
      <div class="cart-modal__item">
        <img class="cart-modal__thumb" src="${product.img || './images/store-card-placeholder.webp'}" alt="${product.name}" loading="lazy" />
        <div>
          <div class="cart-modal__itemName">${product.name}</div>
          <div class="muted xsmall">$${product.price} each</div>
        </div>
        <div class="cart-modal__itemQty">x${item.qty}</div>
        <div class="cart-modal__itemTotal">$${lineTotal.toFixed(2)}</div>
      </div>
    `;
  }

  const dest = getDestinationFromPageOrProfile();
  const pointsToUse = Math.max(0, Math.floor(Number(document.getElementById("cartModalPoints")?.value || 0)));

  const ship = shippingQuote({
    country: dest.country,
    state: dest.state,
    cartQty: totals.qty,
    cartValue: totals.value,
    pointsToUse,
    availablePoints: rewards.availablePoints,
  });

  const shippingCost = ship.ok ? ship.shipping : null;
  const orderAfterPoints = ship.ok ? ship.orderAfterPoints : totals.value;
  const projectedTotal = shippingCost === null ? null : Number((orderAfterPoints + shippingCost).toFixed(2));

  body.innerHTML = `
    <div class="cart-modal__items">
      ${itemsHtml}
    </div>

    <div class="cart-modal__summary">
      <div class="cart-modal__row"><span>Subtotal</span><span>${money(totals.value)}</span></div>

      <div class="cart-modal__row" style="align-items:flex-start; gap:10px;">
        <span>Use points</span>
        <div style="text-align:right">
          <input id="cartModalPoints" type="number" min="0" step="1" value="${pointsToUse}" style="width:160px" />
          <div class="muted xsmall" style="margin-top:4px">Available: ${rewards.availablePoints}</div>
        </div>
      </div>

      <div class="cart-modal__row"><span>Shipping (projected)</span><span>${shippingCost === null ? "—" : money(shippingCost)}</span></div>
      <div class="cart-modal__row cart-modal__row--total"><span>Projected total</span><span>${projectedTotal === null ? "—" : money(projectedTotal)}</span></div>

      <div class="muted xsmall" style="margin-top:10px">
        ${ship.ok ? ship.message : ship.message}
      </div>
    </div>
  `;

  const pts = document.getElementById("cartModalPoints");
  if (pts) {
    pts.max = String(rewards.availablePoints);
    pts.addEventListener("input", () => renderModal(), { once: true });
  }
}

function showModal() {
  ensureModal();
  renderModal();
  const modal = document.getElementById("cartModal");
  if (modal) modal.classList.add("is-open");
}

function hideModal() {
  const modal = document.getElementById("cartModal");
  if (modal) modal.classList.remove("is-open");
}

function wireCartButton() {
  const badge = document.getElementById("cart-badge");
  if (!badge) return;

  badge.addEventListener("click", (e) => {
    // Keep the link for accessibility, but open the modal for humans.
    e.preventDefault();
    showModal();
  });
}

document.addEventListener("DOMContentLoaded", () => {
  setCartBadge();
  wireCartButton();

  window.addEventListener("cart:updated", () => {
    setCartBadge();
    // If modal is open, keep it in sync.
    const modal = document.getElementById("cartModal");
    if (modal && modal.classList.contains("is-open")) renderModal();
  });
});
