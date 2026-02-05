// Rewards System (ledger-based)
// Rolling 30 days, tiers based on CLEARED spend:
// Bronze: 0–999.99, Silver: 1000–2999.99, Gold: 3000+
// Points: round UP total spend to nearest $10, no partials, then multiplier by tier.
// Points remain pending until transactions clear (checked every 24 hours).

export const TX_KEY = "rewards_transactions_v2";
export const LEDGER_KEY = "rewards_points_ledger_v2";
export const LAST_RECONCILE_KEY = "rewards_last_reconcile_iso";

export function loadJSON(key, fallback) {
  const raw = localStorage.getItem(key);
  return raw ? JSON.parse(raw) : fallback;
}

export function saveJSON(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function getTier(spend) {
  if (spend >= 3000) return "gold";
  if (spend >= 1000) return "silver";
  return "bronze";
}

function multiplierFor(tier) {
  if (tier === "gold") return 3;
  if (tier === "silver") return 2;
  return 1;
}

function roundUpToNearest10(amount) {
  return Math.ceil(amount / 10) * 10;
}

function pointsFromSpend(spend) {
  const tier = getTier(spend);
  const rounded = roundUpToNearest10(spend);
  const points = (rounded / 10) * multiplierFor(tier);
  return { tier, roundedSpend: rounded, points };
}

function cutoff30Days(now = new Date()) {
  const d = new Date(now);
  d.setDate(d.getDate() - 30);
  return d;
}

export function rollingSpend(transactions, status, now = new Date(), userEmail = null) {
  const cutoff = cutoff30Days(now);
  const email = userEmail ? String(userEmail).toLowerCase() : null;
  return transactions
    .filter((tx) => new Date(tx.timestamp) >= cutoff)
    .filter((tx) => tx.status === status)
    .filter((tx) => {
      if (!email) return true;
      if (tx.userEmail) return String(tx.userEmail).toLowerCase() === email;
      // Legacy tx without userEmail: treat as belonging to the current user.
      const current = (JSON.parse(localStorage.getItem("current_user") || "null") || {}).email;
      return current && String(current).toLowerCase() === email;
    })
    .reduce((sum, tx) => sum + Number(tx.amount || 0), 0);
}

function newLedgerId(ledger) {
  const n = ledger.length + 1;
  return `PL-${String(n).padStart(5, "0")}`;
}

function postLedgerEntry(ledger, entry) {
  const currentUserRaw = localStorage.getItem("current_user");
  const currentUser = currentUserRaw ? JSON.parse(currentUserRaw) : null;
  ledger.push({
    id: newLedgerId(ledger),
    timestamp: new Date().toISOString(),
    userEmail: entry.userEmail || currentUser?.email || null,
    ...entry,
  });
}

export function sumAvailablePoints(ledger, userEmail = null) {
  const email = userEmail ? String(userEmail).toLowerCase() : null;
  return ledger
    .filter((e) =>
      ["EARN_AVAILABLE", "ADJUST_AVAILABLE", "SPEND", "REVERSE"].includes(e.type)
    )
    .filter((e) => {
      if (!email) return true;
      if (e.userEmail) return String(e.userEmail).toLowerCase() === email;
      // Legacy entries without userEmail: treat as belonging to the current user.
      const current = (JSON.parse(localStorage.getItem("current_user") || "null") || {}).email;
      return current && String(current).toLowerCase() === email;
    })
    .reduce((s, e) => s + Number(e.points || 0), 0);
}

// "Earned" points only (used for recompute).
// IMPORTANT: recompute should never cancel out user redemptions.
// If we include SPEND in the current total, the daily target adjustment will
// just add the points back (effectively making redemption pointless).
function sumEarnedAvailablePoints(ledger, userEmail = null) {
  const email = userEmail ? String(userEmail).toLowerCase() : null;
  return ledger
    .filter((e) => ["EARN_AVAILABLE", "ADJUST_AVAILABLE"].includes(e.type))
    .filter((e) => {
      if (!email) return true;
      if (e.userEmail) return String(e.userEmail).toLowerCase() === email;
      const current = (JSON.parse(localStorage.getItem("current_user") || "null") || {}).email;
      return current && String(current).toLowerCase() === email;
    })
    .reduce((s, e) => s + Number(e.points || 0), 0);
}

function sumEarnedPendingPoints(ledger, userEmail = null) {
  const email = userEmail ? String(userEmail).toLowerCase() : null;
  return ledger
    .filter((e) => ["EARN_PENDING", "ADJUST_PENDING"].includes(e.type))
    .filter((e) => {
      if (!email) return true;
      if (e.userEmail) return String(e.userEmail).toLowerCase() === email;
      const current = (JSON.parse(localStorage.getItem("current_user") || "null") || {}).email;
      return current && String(current).toLowerCase() === email;
    })
    .reduce((s, e) => s + Number(e.points || 0), 0);
}

export function sumPendingPoints(ledger, userEmail = null) {
  const email = userEmail ? String(userEmail).toLowerCase() : null;
  return ledger
    .filter((e) => ["EARN_PENDING", "ADJUST_PENDING"].includes(e.type))
    .filter((e) => {
      if (!email) return true;
      if (e.userEmail) return String(e.userEmail).toLowerCase() === email;
      const current = (JSON.parse(localStorage.getItem("current_user") || "null") || {}).email;
      return current && String(current).toLowerCase() === email;
    })
    .reduce((s, e) => s + Number(e.points || 0), 0);
}

// Demo-only: treat PENDING older than 24h as CLEARED.
// Real implementation: query processor + update statuses server-side.
function reconcileTransactionsDailyStub(transactions) {
  const now = new Date();
  return transactions.map((tx) => {
    if (tx.status !== "PENDING") return tx;
    const ageMs = now - new Date(tx.timestamp);
    const olderThan24h = ageMs >= 24 * 60 * 60 * 1000;
    return olderThan24h ? { ...tx, status: "CLEARED" } : tx;
  });
}

// Recompute target points and post deltas to the ledger.
function recomputeAndPostLedger(transactions, ledger, now = new Date()) {
  const currentUserRaw = localStorage.getItem("current_user");
  const currentUser = currentUserRaw ? JSON.parse(currentUserRaw) : null;
  const email = currentUser?.email || null;

  const clearedSpend30d = rollingSpend(transactions, "CLEARED", now, email);
  const pendingSpend30d = rollingSpend(transactions, "PENDING", now, email);

  const availableTarget = pointsFromSpend(clearedSpend30d).points;
  const projectedTarget = pointsFromSpend(clearedSpend30d + pendingSpend30d).points;
  const pendingTarget = Math.max(0, projectedTarget - availableTarget);

  // Only adjust the EARN/ADJUST pools. SPEND entries are intentional and must
  // remain in effect.
  const availableCurrent = sumEarnedAvailablePoints(ledger, email);
  const pendingCurrent = sumEarnedPendingPoints(ledger, email);

  const availableDelta = availableTarget - availableCurrent;
  const pendingDelta = pendingTarget - pendingCurrent;

  if (availableDelta !== 0) {
    postLedgerEntry(ledger, {
      type: "ADJUST_AVAILABLE",
      userEmail: email,
      txId: null,
      points: availableDelta,
      note: "Daily recompute delta (rolling 30D cleared)",
    });
  }

  if (pendingDelta !== 0) {
    postLedgerEntry(ledger, {
      type: "ADJUST_PENDING",
      userEmail: email,
      txId: null,
      points: pendingDelta,
      note: "Daily recompute delta (rolling 30D pending projection)",
    });
  }

  return { clearedSpend30d, pendingSpend30d };
}

export function ensureRewardsInitialized() {
  const tx = loadJSON(TX_KEY, null);
  const ledger = loadJSON(LEDGER_KEY, null);
  if (tx && ledger) return;
  saveJSON(TX_KEY, []);
  saveJSON(LEDGER_KEY, []);
  localStorage.removeItem(LAST_RECONCILE_KEY);
}

export function runDailyReconcileIfNeeded() {
  ensureRewardsInitialized();

  const lastIso = localStorage.getItem(LAST_RECONCILE_KEY);
  const last = lastIso ? new Date(lastIso) : null;
  const now = new Date();
  const due = !last || now - last >= 24 * 60 * 60 * 1000;

  if (!due) return;

  let transactions = loadJSON(TX_KEY, []);
  let ledger = loadJSON(LEDGER_KEY, []);

  transactions = reconcileTransactionsDailyStub(transactions);
  recomputeAndPostLedger(transactions, ledger, now);

  saveJSON(TX_KEY, transactions);
  saveJSON(LEDGER_KEY, ledger);
  localStorage.setItem(LAST_RECONCILE_KEY, now.toISOString());
}

export function getRewardsSnapshot() {
  ensureRewardsInitialized();
  runDailyReconcileIfNeeded();

  const now = new Date();
  const transactions = loadJSON(TX_KEY, []);
  const ledger = loadJSON(LEDGER_KEY, []);

  const currentUserRaw = localStorage.getItem("current_user");
  const currentUser = currentUserRaw ? JSON.parse(currentUserRaw) : null;
  const email = currentUser?.email || null;

  const clearedSpend30d = rollingSpend(transactions, "CLEARED", now, email);
  const pendingSpend30d = rollingSpend(transactions, "PENDING", now, email);

  const tier = getTier(clearedSpend30d);
  const projectedTier = getTier(clearedSpend30d + pendingSpend30d);

  return {
    tier,
    projectedTier,
    clearedSpend30d,
    pendingSpend30d,
    availablePoints: sumAvailablePoints(ledger, email),
    pendingPoints: sumPendingPoints(ledger, email),
  };
}


export function applyTierBorderToLogo(tier) {
  const logoWrap = document.querySelector("[data-rewards-logo]");
  if (!logoWrap) return;
  logoWrap.classList.remove("tier-bronze", "tier-silver", "tier-gold");
  logoWrap.classList.add(`tier-${tier}`);
}

export function createTransaction({ amount, items, pointsSpent = 0, meta = null }) {
  ensureRewardsInitialized();
  runDailyReconcileIfNeeded();

  const transactions = loadJSON(TX_KEY, []);
  const ledger = loadJSON(LEDGER_KEY, []);

  const id = `TX${Date.now()}`;
  const currentUserRaw = localStorage.getItem("current_user");
  const currentUser = currentUserRaw ? JSON.parse(currentUserRaw) : null;

  const tx = {
    id,
    userEmail: currentUser?.email || null,
    amount: Number(amount.toFixed(2)),
    status: "PENDING",
    timestamp: new Date().toISOString(),
    items,
    meta: meta || undefined,
  };
  transactions.push(tx);

  // Points spent are immediately removed from available.
  if (pointsSpent > 0) {
    postLedgerEntry(ledger, {
      type: "SPEND",
      txId: id,
      points: -Math.abs(pointsSpent),
      note: "Redeemed points at checkout",
    });
  }

  // Recompute immediately so pending points appear right away.
  recomputeAndPostLedger(transactions, ledger, new Date());

  saveJSON(TX_KEY, transactions);
  saveJSON(LEDGER_KEY, ledger);

  return tx;
}

export function getTransactionsAndLedger() {
  ensureRewardsInitialized();
  runDailyReconcileIfNeeded();
  return {
    transactions: loadJSON(TX_KEY, []),
    ledger: loadJSON(LEDGER_KEY, []),
  };
}
