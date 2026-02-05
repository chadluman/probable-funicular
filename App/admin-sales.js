// ADMIN_GUARD: block non-admin access (frontend demo)
(() => {
  const role = localStorage.getItem("session_role");
  const user = localStorage.getItem("current_user");
  if (!user || role !== "admin") {
    window.location.href = "../Auth/login.html?adminRequired=1";
  }
})();


document.addEventListener("DOMContentLoaded", () => {
  const pill = document.getElementById("rolePill");
  const role = localStorage.getItem("session_role") || "user";
  if (pill) pill.textContent = `Role: ${role}`;

  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("current_user");
      localStorage.removeItem("session_role");
      localStorage.removeItem("authToken");
      window.location.href = "../Auth/login.html";
    });
  }
});


const fmtMoney = (n) => `$${(Number(n || 0)).toFixed(2)}`;
const fmtDate = (iso) => new Date(iso).toLocaleString();

function statusBadge(s) {
  const key = String(s || "").toUpperCase();
  const cls = key === "PENDING" ? "pending" : key === "CLEARED" ? "cleared" : key === "REFUNDED" ? "refunded" : "failed";
  return `<span class="status ${cls}">${key}</span>`;
}

async function api(path) {
  const token = localStorage.getItem("authToken");
  const headers = token ? { "Authorization": `Bearer ${token}` } : {};
  const res = await fetch(path, { headers });
  const text = await res.text();
  let data;
  try { data = text ? JSON.parse(text) : null; } catch { data = text; }
  return { ok: res.ok, data };
}

// Expected backend:
// GET /api/admin/sales?start=YYYY-MM-DD&end=YYYY-MM-DD&status=PENDING|CLEARED|REFUNDED|FAILED&q=...
// returns { transactions: Transaction[], pointsIssued:number, pointsRedeemed:number }
async function fetchSales({ start, end, status, q }) {
  const url = new URL("/api/admin/sales", window.location.origin);
  if (start) url.searchParams.set("start", start);
  if (end) url.searchParams.set("end", end);
  if (status && status !== "all") url.searchParams.set("status", status);
  if (q) url.searchParams.set("q", q);

  try {
    const res = await api(url.toString());
    if (res.ok) return res.data;
  } catch {
    // ignore
  }

  // Mock fallback (so the page renders during prototyping)
  const now = Date.now();
  const mk = (daysAgo, userEmail, amount, status, pointsDelta, tier, brand = "VISA", last4 = "4242") => ({
    id: `tx_${Math.random().toString(16).slice(2)}`,
    createdAt: new Date(now - daysAgo * 86400000).toISOString(),
    type: "PURCHASE",
    status,
    amount,
    currency: "USD",
    user: { email: userEmail },
    orderId: `ORD-${Math.floor(Math.random() * 90000 + 10000)}`,
    rewards: { pointsDelta, tierAtPurchase: tier },
    payment: { brand, last4 },
  });

  const transactions = [
    mk(1, "user@test.com", 49.99, "CLEARED", 5, "bronze"),
    mk(2, "vip@test.com", 119.50, "PENDING", 24, "silver", "MC", "5454"),
    mk(4, "vip@test.com", 3100.00, "CLEARED", 930, "gold"),
    mk(8, "user@test.com", 25.00, "REFUNDED", 0, "bronze"),
    mk(12, "admin@test.com", 75.40, "CLEARED", 15, "bronze"),
  ];

  return {
    transactions,
    pointsIssued: transactions.filter((t) => (t.rewards?.pointsDelta || 0) > 0).reduce((a, t) => a + t.rewards.pointsDelta, 0),
    pointsRedeemed: transactions.filter((t) => (t.rewards?.pointsDelta || 0) < 0).reduce((a, t) => a + Math.abs(t.rewards.pointsDelta), 0),
    _mock: true,
  };
}

function computeKpis(transactions, pointsIssued, pointsRedeemed) {
  const okTx = transactions.filter((t) => String(t.status).toUpperCase() !== "FAILED");
  const gross = okTx.reduce((a, t) => a + Number(t.amount || 0), 0);
  const refunds = okTx.filter((t) => String(t.status).toUpperCase() === "REFUNDED").reduce((a, t) => a + Number(t.amount || 0), 0);
  const net = gross - refunds;
  const orders = okTx.length;
  const aov = orders ? net / orders : 0;
  const pending = okTx.filter((t) => String(t.status).toUpperCase() === "PENDING").reduce((a, t) => a + Number(t.amount || 0), 0);

  return { gross, net, orders, aov, refunds, pending, pointsIssued: pointsIssued || 0, pointsRedeemed: pointsRedeemed || 0 };
}

function renderKpis(k) {
  document.getElementById("kpiGross").textContent = fmtMoney(k.gross);
  document.getElementById("kpiNet").textContent = fmtMoney(k.net);
  document.getElementById("kpiOrders").textContent = String(k.orders);
  document.getElementById("kpiAov").textContent = fmtMoney(k.aov);
  document.getElementById("kpiRefund").textContent = fmtMoney(k.refunds);
  document.getElementById("kpiPending").textContent = fmtMoney(k.pending);
  document.getElementById("kpiPtsIssued").textContent = String(k.pointsIssued);
  document.getElementById("kpiPtsRedeemed").textContent = String(k.pointsRedeemed);
}

function renderTransactions(transactions) {
  const body = document.getElementById("txBody");
  body.innerHTML = transactions
    .slice()
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .map((t) => {
      const email = t.user?.email || t.userEmail || "—";
      const points = t.rewards?.pointsDelta ?? t.pointsDelta ?? 0;
      const order = t.orderId || t.order?.id || "—";
      const pay = t.payment ? `${t.payment.brand || "—"} **** ${t.payment.last4 || "—"}` : "—";
      return `
        <tr>
          <td>${fmtDate(t.createdAt)}</td>
          <td>${email}</td>
          <td>${order}</td>
          <td>${fmtMoney(t.amount)}</td>
          <td>${statusBadge(t.status)}</td>
          <td>${points}</td>
          <td>${pay}</td>
        </tr>
      `;
    })
    .join("");
}

function computeTopCustomersRolling30(transactions) {
  const cutoff = Date.now() - 30 * 86400000;
  const recent = transactions.filter((t) => new Date(t.createdAt).getTime() >= cutoff && String(t.status).toUpperCase() !== "FAILED");
  const map = new Map();

  for (const t of recent) {
    const email = t.user?.email || t.userEmail || "unknown";
    const cur = map.get(email) || { email, spend: 0, orders: 0, tier: "bronze" };
    cur.spend += Number(t.amount || 0);
    cur.orders += 1;
    cur.tier = t.rewards?.tierAtPurchase || cur.tier;
    map.set(email, cur);
  }

  return [...map.values()].sort((a, b) => b.spend - a.spend).slice(0, 10);
}

function renderTopCustomers(rows) {
  const body = document.getElementById("topCustomers");
  body.innerHTML = rows
    .map(
      (r) => `
        <tr>
          <td>${r.email}</td>
          <td>${fmtMoney(r.spend)}</td>
          <td>${r.orders}</td>
          <td>${r.tier}</td>
        </tr>
      `
    )
    .join("");
}

function yyyyMmDd(d) {
  return d.toISOString().slice(0, 10);
}

function setPresetDates(preset) {
  const startEl = document.getElementById("startDate");
  const endEl = document.getElementById("endDate");

  if (preset === "custom") return;

  const today = new Date();
  const end = new Date(today);
  const start = new Date(today);

  if (preset === "7d") start.setDate(start.getDate() - 7);
  if (preset === "30d") start.setDate(start.getDate() - 30);

  startEl.value = yyyyMmDd(start);
  endEl.value = yyyyMmDd(end);
}

async function load() {
  const preset = document.getElementById("rangePreset").value;
  setPresetDates(preset);

  const start = document.getElementById("startDate").value;
  const end = document.getElementById("endDate").value;
  const status = document.getElementById("statusFilter").value;
  const q = document.getElementById("userQuery").value.trim();

  const data = await fetchSales({ start, end, status, q });
  const tx = data.transactions || [];

  renderKpis(computeKpis(tx, data.pointsIssued, data.pointsRedeemed));
  renderTransactions(tx);
  renderTopCustomers(computeTopCustomersRolling30(tx));
}

document.getElementById("rangePreset").addEventListener("change", load);
document.getElementById("applyFilters").addEventListener("click", load);

load();
