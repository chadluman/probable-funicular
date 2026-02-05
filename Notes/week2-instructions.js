
/*
======================================================
WEEK 2 — MICRO E‑COMMERCE (Store Lite) — INSTRUCTIONS
======================================================
Goal this week (portfolio‑ready, small, visible):
- Add a Store page that renders a product grid
- Add-to-cart (badge only)
- Shipping Calculator (nested if / else if / logical operators)
- Promo Code switch (switch/case)
- Optional: Category filter

Everything runs locally with Live Server, building on Week 1.

📁 TARGET STRUCTURE
Project/
 ├─ App/
 │   ├─ index2.html        (existing)
 │   ├─ style2.css         (existing)
 │   ├─ store.html         ← new
 │   └─ js/
 │       ├─ cart.js        ← new
 │       └─ store.js       ← new
 ├─ Auth/                  (existing)
 └─ Notes/
     ├─ STEP1_Additions.js (existing)
     └─ week2-instructions.js  ← (this file)
*/



/*
-------------------------------------------------------
1️⃣  ADD LINKS TO THE STORE
-------------------------------------------------------
FILE: App/index2.html
LOCATION: Inside the <ul id="navMenu" class="nav__list"> ... </ul>
TYPE the two lines below:
-------------------------------------------------------
<li><a href="./store.html" class="nav__link">Store</a></li>
<li><a href="./store.html" class="btn btn--sm btn--primary">Explore Store</a></li>
-------------------------------------------------------

LOCATION: Inside the hero actions <div class="hero__actions"> ... </div>
TYPE the line below:
-------------------------------------------------------
<a href="./store.html" class="btn btn--primary">Explore Store</a>
-------------------------------------------------------

(OPTIONAL) Add a tiny cart badge in the header (somewhere visible in nav):
TYPE this span where you want the cart count to show:
-------------------------------------------------------
<span id="cart-badge" class="btn btn--sm btn--outline" aria-live="polite">Cart (0)</span>
-------------------------------------------------------
*/



/*
-------------------------------------------------------
2️⃣  CREATE FILE: App/store.html
-------------------------------------------------------
TYPE this full minimal page:
-------------------------------------------------------
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Store</title>
  <link rel="stylesheet" href="./style2.css" />
</head>
<body>
  <header class="site-header">
    <div class="container header-inner">
      <a class="brand" href="./index2.html"><span class="brand__name">YourBrand</span></a>
      <nav class="nav" aria-label="Primary">
        <ul class="nav__list">
          <li><a href="./index2.html" class="nav__link">Home</a></li>
          <li><a href="./store.html" class="nav__link">Store</a></li>
          <li><a href="../Auth/login.html" class="btn btn--sm btn--primary">Log In</a></li>
          <li><span id="cart-badge" class="btn btn--sm btn--outline">Cart (0)</span></li>
        </ul>
      </nav>
    </div>
  </header>

  <main class="section">
    <div class="container grid grid--2">
      <!-- Left: products -->
      <section>
        <header class="section__header">
          <h2>Products</h2>
          <p>Hand‑picked items</p>
        </header>

        <!-- (optional) filter bar -->
        <div id="filter-bar" class="form" style="margin-bottom:12px">
          <select id="categoryFilter">
            <option value="all">All</option>
            <option value="Dress">Dress</option>
            <option value="Sport">Sport</option>
          </select>
          <button id="applyFilter" class="btn btn--outline btn--sm">Filter</button>
        </div>

        <div id="store-grid" class="grid grid--3"></div>
      </section>

      <!-- Right: utilities -->
      <aside>
        <div class="card" id="shipping-card">
          <h3>Shipping Calculator</h3>
          <div class="form" style="margin-top:10px">
            <input id="age" type="number" placeholder="Your age" />
            <input id="cartValue" type="number" placeholder="Cart value ($)" />
            <input id="points" type="number" placeholder="Reward points" />
            <button id="calcShipBtn" class="btn btn--primary btn--sm">Calculate</button>
            <p id="shippingResult" class="xsmall"></p>
          </div>
        </div>

        <div class="card" id="promo-card" style="margin-top:16px">
          <h3>Promo Code</h3>
          <div class="form" style="margin-top:10px">
            <input id="promoInput" type="text" placeholder="Enter code (e.g., STUDENT)" />
            <button id="applyPromoBtn" class="btn btn--outline btn--sm">Apply</button>
            <p id="promoResult" class="xsmall"></p>
          </div>
        </div>
      </aside>
    </div>
  </main>

  <footer class="site-footer">
    <div class="container">
      <p>© <span id="year"></span> YourBrand</p>
    </div>
  </footer>

  <script>
    document.getElementById('year').textContent = new Date().getFullYear();
  </script>
  <script type="module" src="./js/cart.js"></script>
  <script type="module" src="./js/store.js"></script>
</body>
</html>
-------------------------------------------------------
*/



/*
-------------------------------------------------------
3️⃣  CREATE FILE: App/js/cart.js
-------------------------------------------------------
TYPE this code exactly:
-------------------------------------------------------
export const CART_KEY = "cart_items";

export function getCart() {
  const raw = localStorage.getItem(CART_KEY);
  return raw ? JSON.parse(raw) : [];
}

export function saveCart(items) {
  localStorage.setItem(CART_KEY, JSON.stringify(items));
}

export function addToCart(productId, qty = 1) {
  const cart = getCart();
  const found = cart.find(i => i.productId === productId);
  if (found) {
    found.qty += qty;
  } else {
    cart.push({ productId, qty });
  }
  saveCart(cart);
}

export function getCartCount() {
  return getCart().reduce((sum, i) => sum + i.qty, 0);
}
-------------------------------------------------------
*/



/*
-------------------------------------------------------
4️⃣  CREATE FILE: App/js/store.js
-------------------------------------------------------
TYPE this code. It includes:
- PRODUCTS data
- renderGrid (for/for…of loops)
- wire up "Add to cart" buttons → updates #cart-badge
- shippingCostFor(...) (nested if / else if, && / ||)
- promo switch
- optional category filter
-------------------------------------------------------
import { addToCart, getCartCount } from "./cart.js";

// ----- Data (objects/arrays) -----
export const PRODUCTS = [
  { id: 1, name: "Pro Diver", price: 74, tag: "Dress" },
  { id: 2, name: "Expedition Scout", price: 40, tag: "Sport" },
  { id: 3, name: "Seascape Auto", price: 199, tag: "Dress" },
  { id: 4, name: "Trail Runner", price: 89, tag: "Sport" },
  { id: 5, name: "City Classic", price: 129, tag: "Dress" },
  { id: 6, name: "Aero Chrono", price: 159, tag: "Sport" },
];

// ----- DOM helpers -----
function setCartBadge() {
  const el = document.getElementById("cart-badge");
  if (el) el.textContent = `Cart (${getCartCount()})`;
}

function renderGrid(list) {
  const grid = document.getElementById("store-grid");
  if (!grid) return;
  grid.innerHTML = ""; // clear
  for (let p of list) { // for…of loop
    const card = document.createElement("article");
    card.className = "card";
    card.innerHTML = `
      <h4>${p.name}</h4>
      <p>$${p.price}</p>
      <p class="xsmall">Category: ${p.tag}</p>
      <button class="btn btn--accent btn--sm" data-add="${p.id}">Add to cart</button>
    `;
    grid.appendChild(card);
  }
  // Delegate: listen for buttons
  grid.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-add]");
    if (!btn) return;
    const pid = Number(btn.getAttribute("data-add"));
    addToCart(pid, 1);
    setCartBadge();
  }, { once: true }); // attach once per render
}

// ----- Shipping calculator (conditionals + logical ops) -----
export function shippingCostFor(age, points, cartValue, base = 9.99) {
  // guard clauses
  if (age == null || cartValue == null || points == null) return "Please fill all fields.";
  if (Number.isNaN(age) || Number.isNaN(cartValue) || Number.isNaN(points)) return "Use numbers only.";

  if (age > 21) {
    if (cartValue >= 300 || points >= 500) {
      return 0;
    } else {
      return base;
    }
  } else {
    // user is not over 21
    return base; // business decision for demo
  }
}

// ----- Promo switch -----
export function applyPromo(code) {
  const key = String(code || "").trim().toUpperCase();
  switch (key) {
    case "STUDENT":
      return { ok: true, message: "Student promo applied: 10% off" };
    case "FREESHIP":
      return { ok: true, message: "Free shipping applied" };
    default:
      return { ok: false, message: "Invalid promo code" };
  }
}

// ----- Filter helper -----
function filterProducts(category) {
  if (category === "all") return PRODUCTS;
  const out = [];
  for (let p of PRODUCTS) {
    if (p.tag === category) out.push(p); // conditional within loop
  }
  return out;
}

// ----- Init/wiring -----
function init() {
  setCartBadge();
  renderGrid(PRODUCTS);

  const calcBtn = document.getElementById("calcShipBtn");
  if (calcBtn) {
    calcBtn.addEventListener("click", () => {
      const age = Number(document.getElementById("age").value);
      const cartValue = Number(document.getElementById("cartValue").value);
      const points = Number(document.getElementById("points").value);
      const result = shippingCostFor(age, points, cartValue);
      document.getElementById("shippingResult").textContent = String(result);
    });
  }

  const promoBtn = document.getElementById("applyPromoBtn");
  if (promoBtn) {
    promoBtn.addEventListener("click", () => {
      const code = document.getElementById("promoInput").value;
      const res = applyPromo(code);
      const el = document.getElementById("promoResult");
      el.textContent = res.message;
      el.className = "xsmall" + (res.ok ? " success" : " error");
    });
  }

  const filterBtn = document.getElementById("applyFilter");
  if (filterBtn) {
    filterBtn.addEventListener("click", () => {
      const val = document.getElementById("categoryFilter").value;
      renderGrid(filterProducts(val));
    });
  }
}

document.addEventListener("DOMContentLoaded", init);
-------------------------------------------------------
*/



/*
-------------------------------------------------------
5️⃣  TEST CHECKLIST (students)
-------------------------------------------------------
[ ] Store link appears in the header + hero
[ ] /App/store.html loads with a grid of products
[ ] Clicking "Add to cart" updates the Cart badge
[ ] Shipping Calculator returns a number or message
[ ] Promo Code switch returns a message for STUDENT/FREESHIP
[ ] (Optional) Filter shows only Dress or Sport
-------------------------------------------------------
*/



/*
🎉 DONE!
-------------------------------------------------------
Week 2 delivers a visible, portfolio‑friendly Store Lite MVP:
- Loops render the grid and compute the cart count
- Conditionals + logical ops drive the shipping rules
- A switch statement powers promo codes
- Arrays & objects model products and the cart
- All changes live in App/store.html + App/js/*
-------------------------------------------------------
*/
