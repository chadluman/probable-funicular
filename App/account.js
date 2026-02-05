import { getUsers, saveUsers, getCurrentUser, setCurrentUser, clearCurrentUser } from "../Auth/mockDb.js";

const user = getCurrentUser();
if (!user) {
  window.location.href = "../Auth/login.html";
}

const sessionRole = localStorage.getItem("session_role") || "user";
if (sessionRole === "admin" || sessionRole === "elevated") document.body.classList.add("elevated");

const el = (id) => document.getElementById(id);
const msg = el("msg");

function normalizeCardNumber(raw) {
  return String(raw || "").replace(/[^0-9]/g, "");
}

function inferBrandFromNumber(num) {
  // Very rough, demo-level detection.
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

function renderPayments(u){
  const list = el("paymentList");
  list.innerHTML = "";
  const pms = u.paymentMethods || [];
  if (pms.length === 0) {
    const li = document.createElement("li");
    li.textContent = "None";
    list.appendChild(li);
    return;
  }
  pms.forEach((pm) => {
    const li = document.createElement("li");
    const exp = (pm.expMonth && pm.expYear) ? ` (exp ${String(pm.expMonth).padStart(2,"0")}/${String(pm.expYear).slice(-2)})` : "";
    li.textContent = `${pm.brand} •••• ${pm.last4}${exp}`;
    list.appendChild(li);
  });
}

function fillForm(u){
  el("firstName").value = u.firstName || "";
  el("lastName").value = u.lastName || "";
  el("email").value = u.email || "";
  el("age").value = u.age ?? "";
  el("address").value = u.address || "";
  el("city").value = u.city || "";
  el("state").value = u.state || "";
  el("country").value = u.country || "";
  el("postalCode").value = u.postalCode || "";
  el("confirmPw").value = "";
  renderPayments(u);

  // Reset payment form
  const pmFields = ["pmName","pmNumber","pmExpMonth","pmExpYear","pmCvv","pmBillingZip","pmBrand","pmLast4"];
  pmFields.forEach(id => {
    const node = el(id);
    if (node) node.value = "";
  });
}

fillForm(user);

el("logoutBtn").addEventListener("click", () => {
  clearCurrentUser();
  localStorage.removeItem("session_role");
  window.location.href = "../Auth/login.html";
});

el("cancelBtn").addEventListener("click", () => fillForm(getCurrentUser()));

el("saveBtn").addEventListener("click", () => {
  const current = getCurrentUser();
  if (!current) return;

  const pw = el("confirmPw").value;
  if (!pw || pw !== current.password) {
    msg.textContent = "Password required (or incorrect). Nothing saved.";
    return;
  }

  const updated = {
    ...current,
    firstName: el("firstName").value.trim(),
    lastName: el("lastName").value.trim(),
    age: Number(el("age").value || 0) || "",
    address: el("address").value.trim(),
    city: el("city").value.trim(),
    state: el("state").value.trim(),
    country: el("country").value.trim(),
    postalCode: el("postalCode").value.trim()
  };

  const users = getUsers();
  const idx = users.findIndex(u => u.email === current.email);
  if (idx >= 0) users[idx] = updated;

  saveUsers(users);
  setCurrentUser(updated);

  msg.textContent = "Saved.";
  fillForm(updated);
});

el("addPmBtn").addEventListener("click", () => {
  const current = getCurrentUser();
  if (!current) return;

  const pw = el("confirmPw").value;
  if (!pw || pw !== current.password) {
    msg.textContent = "Password required to modify payment methods.";
    return;
  }

  const nameOnCard = el("pmName").value.trim();
  const cardNumber = normalizeCardNumber(el("pmNumber").value);
  const expMonth = el("pmExpMonth").value.trim();
  const expYear = el("pmExpYear").value.trim();
  const cvv = String(el("pmCvv").value || "").trim();
  const billingZip = el("pmBillingZip").value.trim();

  // Basic validation (demo level)
  if (!nameOnCard) {
    msg.textContent = "Name on card is required.";
    return;
  }
  if (!/^\d{13,19}$/.test(cardNumber)) {
    msg.textContent = "Enter a valid card number (13-19 digits).";
    return;
  }
  if (!/^(0?[1-9]|1[0-2])$/.test(expMonth)) {
    msg.textContent = "Exp month must be 1-12.";
    return;
  }
  if (!/^\d{4}$/.test(expYear)) {
    msg.textContent = "Exp year must be 4 digits (YYYY).";
    return;
  }
  if (!/^\d{3,4}$/.test(cvv)) {
    msg.textContent = "CVV must be 3-4 digits.";
    return;
  }
  if (!billingZip) {
    msg.textContent = "Billing ZIP/Postal is required.";
    return;
  }

  const brand = inferBrandFromNumber(cardNumber);
  const last4 = safeLast4(cardNumber);
  const token = `tok_${Math.random().toString(36).slice(2)}_${Date.now()}`;

  const updated = { ...current };
  updated.paymentMethods = [
    ...(updated.paymentMethods || []),
    {
      token,
      brand,
      last4,
      nameOnCard,
      expMonth: String(expMonth).padStart(2, "0"),
      expYear,
      billingZip,
    }
  ];

  const users = getUsers();
  const idx = users.findIndex(u => u.email === current.email);
  if (idx >= 0) users[idx] = updated;

  saveUsers(users);
  setCurrentUser(updated);

  // Clear fields
  ["pmName","pmNumber","pmExpMonth","pmExpYear","pmCvv","pmBillingZip","pmBrand","pmLast4"].forEach(id => {
    const node = el(id);
    if (node) node.value = "";
  });
  msg.textContent = "Payment method added.";
  fillForm(updated);
});

// Auto-fill brand + last4 as user types
const pmNumberEl = el("pmNumber");
if (pmNumberEl) {
  pmNumberEl.addEventListener("input", () => {
    const digits = normalizeCardNumber(pmNumberEl.value);
    el("pmBrand").value = digits ? inferBrandFromNumber(digits) : "";
    el("pmLast4").value = digits.length >= 4 ? digits.slice(-4) : "";
  });
}

el("clearPmBtn").addEventListener("click", () => {
  const current = getCurrentUser();
  if (!current) return;

  const pw = el("confirmPw").value;
  if (!pw || pw !== current.password) {
    msg.textContent = "Password required to modify payment methods.";
    return;
  }

  const updated = { ...current, paymentMethods: [] };

  const users = getUsers();
  const idx = users.findIndex(u => u.email === current.email);
  if (idx >= 0) users[idx] = updated;

  saveUsers(users);
  setCurrentUser(updated);

  msg.textContent = "Payment methods cleared.";
  fillForm(updated);
});
