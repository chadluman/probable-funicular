import {
  getRewardsSnapshot,
  applyTierBorderToLogo,
  getTransactionsAndLedger,
} from "./rewards-system.js";

function formatMoney(n) {
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "USD",
  }).format(n);
}

function formatDate(iso) {
  return new Date(iso).toLocaleString();
}

function monthKey(iso) {
  const d = new Date(iso);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  return `${y}-${m}`;
}

function buildEvents(transactions, ledger) {
  const events = [];

  for (const tx of transactions) {
    events.push({
      timestamp: tx.timestamp,
      category: "Purchase",
      txId: tx.id,
      details:
        tx.items?.map((i) => `${i.qty}× ${i.name} (${i.sku})`).join(", ") || "—",
      amount: tx.amount,
      points: null,
      status: tx.status,
    });
  }

  for (const le of ledger) {
    events.push({
      timestamp: le.timestamp,
      category: "Points",
      txId: le.txId || "",
      details: le.note || le.type,
      amount: null,
      points: le.points,
      status: le.type,
    });
  }

  events.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  return events;
}

function populatePurchaseFilter(transactions) {
  const select = document.getElementById("purchaseFilter");
  const ids = [...new Set(transactions.map((t) => t.id))];
  for (const id of ids) {
    const opt = document.createElement("option");
    opt.value = id;
    opt.textContent = id;
    select.appendChild(opt);
  }
}

function renderTable(events) {
  const tbody = document.getElementById("historyTbody");
  tbody.innerHTML = "";

  for (const ev of events) {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${formatDate(ev.timestamp)}</td>
      <td>${ev.category}</td>
      <td>${ev.txId || "—"}</td>
      <td>${ev.details || "—"}</td>
      <td class="right">${ev.amount != null ? formatMoney(ev.amount) : "—"}</td>
      <td class="right">${ev.points != null ? ev.points : "—"}</td>
      <td>${ev.status || "—"}</td>
    `;
    tbody.appendChild(tr);
  }
}

function applyFilters(allEvents) {
  const monthVal = document.getElementById("monthFilter").value;
  const purchaseVal = document.getElementById("purchaseFilter").value;

  let filtered = allEvents;
  if (monthVal) filtered = filtered.filter((e) => monthKey(e.timestamp) === monthVal);
  if (purchaseVal) filtered = filtered.filter((e) => e.txId === purchaseVal);

  renderTable(filtered);
}

document.addEventListener("DOMContentLoaded", () => {
  const snapshot = getRewardsSnapshot();
  applyTierBorderToLogo(snapshot.tier);

  const { transactions, ledger } = getTransactionsAndLedger();
  populatePurchaseFilter(transactions);

  const allEvents = buildEvents(transactions, ledger);
  renderTable(allEvents);

  document
    .getElementById("monthFilter")
    .addEventListener("change", () => applyFilters(allEvents));
  document
    .getElementById("purchaseFilter")
    .addEventListener("change", () => applyFilters(allEvents));
  document.getElementById("clearFiltersBtn").addEventListener("click", () => {
    document.getElementById("monthFilter").value = "";
    document.getElementById("purchaseFilter").value = "";
    renderTable(allEvents);
  });
});
