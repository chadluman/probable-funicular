export const CART_KEY = "cart_items";

export function getCart() {
  const raw = localStorage.getItem(CART_KEY);
  return raw ? JSON.parse(raw) : [];
}

export function saveCart(items) {
  localStorage.setItem(CART_KEY, JSON.stringify(items));

  // Let any UI (badge, shipping calculator, cart modal, etc.) react instantly.
  try {
    window.dispatchEvent(new CustomEvent("cart:updated", { detail: { items } }));
  } catch (e) {
    // Older browsers can suffer quietly.
  }
}

export function addToCart(productId, qty = 1) {
  const cart = getCart();
  const found = cart.find((i) => i.productId === productId);
  if (found) {
    found.qty += qty;
  } else {
    cart.push({ productId, qty });
  }
  saveCart(cart);
}

export function removeFromCart(productId) {
  const cart = getCart();
  const filtered = cart.filter((i) => i.productId !== productId);
  saveCart(filtered);
}

export function updateCartQuantity(productId, qty) {
  const cart = getCart();
  const found = cart.find((i) => i.productId === productId);
  if (found) {
    if (qty <= 0) {
      removeFromCart(productId);
    } else {
      found.qty = qty;
      saveCart(cart);
    }
  }
}

export function getCartCount() {
  return getCart().reduce((sum, i) => sum + i.qty, 0);
}

export function getCartWithDetails(products) {
  const cart = getCart();
  return cart.map((item) => {
    const product = products.find((p) => p.id === item.productId);
    return {
      ...item,
      name: product ? product.name : "Unknown Item",
      price: product ? product.price : 0,
    };
  });
}
