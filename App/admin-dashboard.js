// ADMIN_GUARD: block non-admin access (frontend demo)
(() => {
  const role = localStorage.getItem("session_role");
  const user = localStorage.getItem("current_user");
  if (!user || role !== "admin") {
    window.location.href = "../Auth/login.html?adminRequired=1";
  }
})()

const currentRole = localStorage.getItem("session_role") || "user";

document.addEventListener("DOMContentLoaded", () => {
  const role = currentRole;
  const pill = document.getElementById("rolePill");
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

;


// ---- API helpers ----
async function api(path, { method = "GET", body } = {}) {
  const token = localStorage.getItem("authToken");
  const headers = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(path, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const text = await res.text();
  let data;
  try { data = text ? JSON.parse(text) : null; } catch { data = text; }

  return { ok: res.ok, status: res.status, data };
}

// ---- Local user store (frontend demo) ----
function getUsersLocal(){
  try { return JSON.parse(localStorage.getItem("app_users") || "[]"); }
  catch { return []; }
}
function saveUsersLocal(users){
  localStorage.setItem("app_users", JSON.stringify(users));
}

// ---- Data ----
let users = [];
let selectedUser = null;

const tbody = document.getElementById("usersTbody");
const searchInput = document.getElementById("searchInput");
const roleFilter = document.getElementById("roleFilter");

function rolePill(r) {
  return r;
}

function render() {
  const q = (searchInput.value || "").toLowerCase().trim();
  const rf = roleFilter.value;

  const filtered = users.filter((u) => {
    const matchesQ = !q || `${u.name} ${u.email}`.toLowerCase().includes(q);
    const matchesRole =
      rf === "all" ? true :
      rf === "disabled" ? u.status === "disabled" :
      u.role === rf;
    return matchesQ && matchesRole;
  });

  tbody.innerHTML = filtered
    .map(
      (u) => `
      <tr>
        <td>${u.name}</td>
        <td>${u.email}</td>
        <td>${rolePill(u.role)}</td>
        <td>${u.status}</td>
        <td>
          <div class="actions">
            <button class="btn secondary" data-action="view" data-id="${u.id}">View</button>
            <button class="btn secondary" data-action="toggle" data-id="${u.id}">
              ${u.status === "disabled" ? "Enable" : "Disable"}
            </button>
          </div>
        </td>
      </tr>
    `
    )
    .join("");
}

function setDetail(u) {
  selectedUser = u;
  document.getElementById("detailEmpty").hidden = true;
  document.getElementById("detailPane").hidden = false;

  // Fill editable fields (pull from raw if available)
  const raw = u._raw || {};
  const first = raw.firstName ?? (u.name.split(" ")[0] || "");
  const last = raw.lastName ?? (u.name.split(" ").slice(1).join(" ") || "");

  document.getElementById("dFirst").value = first;
  document.getElementById("dLast").value = last;
  document.getElementById("dEmailInput").value = u.email;
  document.getElementById("dAge").value = raw.age ?? "";
  document.getElementById("dAddress").value = raw.address ?? "";
  document.getElementById("dStatus").value = u.status;

  document.getElementById("roleSelect").value = u.role;
  document.getElementById("detailMsg").textContent = "";

  // Power the "selected user" tools off the detail pane selection
  setSelectedUser(u.email);
  // Keep promo selector in sync with the current user
  populateDetailPromoSelect();
  updateDetailPromoHint();
}

function msg(t) {
  document.getElementById("detailMsg").textContent = t;
}

tbody.addEventListener("click", async (e) => {
  const btn = e.target.closest("button");
  if (!btn) return;

  const id = btn.getAttribute("data-id");
  const action = btn.getAttribute("data-action");
  const user = users.find((x) => x.id === id);
  if (!user) return;

  if (action === "view") setDetail(user);

  if (action === "toggle") {
    const next = user.status === "disabled" ? "active" : "disabled";
    await setStatus(user, next);
  }
});

searchInput.addEventListener("input", render);
roleFilter.addEventListener("change", render);

document.getElementById("saveRoleBtn").addEventListener("click", async () => {
  if (!selectedUser) return;
  const newRole = document.getElementById("roleSelect").value;

  // Optional policy: elevated cannot promote to admin
  if (currentRole !== "admin" && newRole === "admin") {
    msg("Denied: only admins can set admin role.");
    return;
  }

  // Persist locally (demo)
  selectedUser.role = newRole;
  users = users.map((u) => (u.id === selectedUser.id ? selectedUser : u));
  // write back to app_users
  const raw = getUsersLocal();
  const idx = raw.findIndex(x => String(x.email||"").toLowerCase() === String(selectedUser.email||"").toLowerCase());
  if (idx >= 0){
    raw[idx].role = newRole;
    saveUsersLocal(raw);
  }
  render();
  msg("Role updated.");
});

// Save basic user details (name/email/age/address) and refresh UI instantly
document.getElementById("saveUserBtn")?.addEventListener("click", () => {
  if (!selectedUser) return;

  const firstName = (document.getElementById("dFirst").value || "").trim();
  const lastName = (document.getElementById("dLast").value || "").trim();
  const nextEmail = (document.getElementById("dEmailInput").value || "").trim().toLowerCase();
  const ageRaw = document.getElementById("dAge").value;
  const address = (document.getElementById("dAddress").value || "").trim();

  if (!firstName || !lastName) {
    msg("First and last name are required.");
    return;
  }
  if (!nextEmail || !nextEmail.includes("@")) {
    msg("Enter a valid email.");
    return;
  }

  const raw = getUsersLocal();
  const oldEmail = String(selectedUser.email || "").toLowerCase();

  // Prevent collisions if email is being changed
  if (nextEmail !== oldEmail) {
    const already = raw.some(x => String(x.email||"").toLowerCase() === nextEmail);
    if (already) {
      msg("That email is already in use.");
      return;
    }
  }

  const idx = raw.findIndex(x => String(x.email||"").toLowerCase() === oldEmail);
  if (idx < 0) {
    msg("Could not find this user in storage.");
    return;
  }

  raw[idx].firstName = firstName;
  raw[idx].lastName = lastName;
  raw[idx].email = nextEmail;
  raw[idx].age = ageRaw === "" ? "" : Number(ageRaw);
  raw[idx].address = address;

  saveUsersLocal(raw);

  // Update in-memory user + UI instantly
  const updated = {
    ...selectedUser,
    name: `${firstName} ${lastName}`.trim(),
    email: nextEmail,
    _raw: raw[idx],
  };

  users = users.map(u => (u.id === selectedUser.id ? updated : u));
  render();
  setDetail(updated);
  msg("User saved.");
});


function setStatus(user, status){
  user.status = status;
  users = users.map((u) => (u.id === user.id ? user : u));
  const raw = getUsersLocal();
  const idx = raw.findIndex(x => String(x.email||"").toLowerCase() === String(user.email||"").toLowerCase());
  if (idx >= 0){
    raw[idx].status = status;
    saveUsersLocal(raw);
  }
  render();
  if (selectedUser?.id === user.id) setDetail(user);
  msg(`Status set to ${status}.`);
}

document.getElementById("disableBtn").addEventListener("click", () => {
  if (!selectedUser) return;
  setStatus(selectedUser, "disabled");
});

document.getElementById("enableBtn").addEventListener("click", () => {
  if (!selectedUser) return;
  setStatus(selectedUser, "active");
});

document.getElementById("forcePwResetBtn").addEventListener("click", async () => {
  if (!selectedUser) return;

  const res = await api(`/api/admin/users/${encodeURIComponent(selectedUser.id)}/force-password-reset`, {
    method: "POST",
  });

  msg(res.ok ? "Password reset will be required on next login." : "Failed. (Implement /api/admin/users/:id/force-password-reset)");
});

async function loadUsers(){
  const raw = getUsersLocal();
  users = raw.map(u => ({
    id: (u.id || u.email || crypto?.randomUUID?.() || String(Math.random())),
    name: `${u.firstName || ""} ${u.lastName || ""}`.trim() || u.name || "User",
    email: u.email || "",
    role: u.role || "user",
    status: u.status || "active",
    _raw: u
  }));
  render();
  msg(users.length ? "" : "No users found yet. (Create an account or add one here.)");
}

loadUsers();


/* ============================
   PROMO CODE MANAGEMENT (Admin)
   ============================ */

const PROMO_STORAGE_KEY = "promo_codes_v1";

function seedPromoCodesIfMissing(){
  const existing = localStorage.getItem(PROMO_STORAGE_KEY);
  if (existing) return;

  const seeded = [];
  // Percent codes 10%–90% in 10% increments
  for (let pct = 10; pct <= 90; pct += 10){
    seeded.push({
      id: crypto?.randomUUID?.() ?? String(Math.random()),
      code: `SAVE${pct}`,
      type: "percent",
      value: pct,
      active: true,
      createdAt: new Date().toISOString()
    });
  }
  seeded.push({
    id: crypto?.randomUUID?.() ?? String(Math.random()),
    code: "BOGO",
    type: "bogo",
    value: null,
    active: true,
    createdAt: new Date().toISOString()
  });
  seeded.push({
    id: crypto?.randomUUID?.() ?? String(Math.random()),
    code: "FREESHIP",
    type: "free_shipping",
    value: null,
    active: true,
    createdAt: new Date().toISOString()
  });

  localStorage.setItem(PROMO_STORAGE_KEY, JSON.stringify(seeded));
}

function getPromoCodes(){
  try { return JSON.parse(localStorage.getItem(PROMO_STORAGE_KEY) || "[]"); }
  catch { return []; }
}

function savePromoCodes(list){
  localStorage.setItem(PROMO_STORAGE_KEY, JSON.stringify(list));
}

function promoTypeLabel(t){
  if (t === "percent") return "Percent";
  if (t === "bogo") return "BOGO";
  if (t === "free_shipping") return "Free Shipping";
  return t;
}

function promoValueLabel(p){
  if (p.type === "percent") return `${p.value}%`;
  if (p.type === "bogo") return "Buy 1 Get 1";
  if (p.type === "free_shipping") return "Free";
  return "—";
}

function promoRulesLabel(p){
  const parts = [];

  if (p.startAt || p.endAt){
    const s = p.startAt ? new Date(p.startAt) : null;
    const e = p.endAt ? new Date(p.endAt) : null;
    const sTxt = (s && !isNaN(s)) ? s.toLocaleString() : "";
    const eTxt = (e && !isNaN(e)) ? e.toLocaleString() : "";
    if (sTxt && eTxt) parts.push(`Time: ${sTxt} → ${eTxt}`);
    else if (sTxt) parts.push(`Starts: ${sTxt}`);
    else if (eTxt) parts.push(`Ends: ${eTxt}`);
  }

  if (Array.isArray(p.productIds) && p.productIds.length){
    parts.push(`Products: ${p.productIds.join(",")}`);
  } else {
    parts.push("Products: All");
  }

  if (Number(p.maxTotalUses) > 0) parts.push(`Max total: ${Number(p.maxTotalUses)}`);
  if (Number(p.maxUsesPerCustomer) > 0) parts.push(`Per customer: ${Number(p.maxUsesPerCustomer)}`);

  return parts.join(" • ") || "—";
}

function renderPromos(){
  const tbody = document.getElementById("promoTbody");
  if (!tbody) return;

  const promos = getPromoCodes().sort((a,b)=>a.code.localeCompare(b.code));
  tbody.innerHTML = promos.map(p => `
    <tr>
      <td>${p.code}</td>
      <td>${promoTypeLabel(p.type)}</td>
      <td>${promoValueLabel(p)}</td>
      <td>${p.active ? "active" : "inactive"}</td>
      <td>${Array.isArray(p.allowedEmails) && p.allowedEmails.length ? "Restricted" : "All Users"}</td>
      <td>${promoRulesLabel(p)}</td>
      <td>
        <div class="actions">
          <button class="secondary" data-promo-action="toggle" data-id="${p.id}">
            ${p.active ? "Deactivate" : "Activate"}
          </button>
          <button class="secondary" data-promo-action="editRules" data-id="${p.id}">Rules</button>
          <button class="secondary" data-promo-action="editAccess" data-id="${p.id}">Access</button>
          <button class="secondary" data-promo-action="delete" data-id="${p.id}">Delete</button>
        </div>
      </td>
    </tr>
  `).join("");
}

function setPromoMsg(text){
  const el = document.getElementById("promoMsg");
  if (el) el.textContent = text || "";
}

function wirePromoUI(){
  const addBtn = document.getElementById("addPromoBtn");
  const codeInput = document.getElementById("promoCodeInput");
  const typeSelect = document.getElementById("promoTypeSelect");
  const valueSelect = document.getElementById("promoValueSelect");
  const startAtInput = document.getElementById("promoStartAt");
  const endAtInput = document.getElementById("promoEndAt");
  const productIdsInput = document.getElementById("promoProductIds");
  const maxTotalUsesInput = document.getElementById("promoMaxTotalUses");
  const maxUsesPerCustomerInput = document.getElementById("promoMaxUsesPerCustomer");

  const promoTbody = document.getElementById("promoTbody");

  if (!addBtn || !codeInput || !typeSelect || !valueSelect || !promoTbody) return;

  const syncValueVisibility = () => {
    const t = typeSelect.value;
    valueSelect.disabled = t !== "percent";
    valueSelect.style.opacity = (t === "percent") ? "1" : ".55";
  };
  typeSelect.addEventListener("change", syncValueVisibility);
  syncValueVisibility();

  addBtn.addEventListener("click", () => {
    const code = (codeInput.value || "").trim().toUpperCase().replace(/\s+/g, "");
    const type = typeSelect.value;
    const value = type === "percent" ? Number(valueSelect.value) : null;
    const startAt = startAtInput?.value ? new Date(startAtInput.value).toISOString() : null;
    const endAt = endAtInput?.value ? new Date(endAtInput.value).toISOString() : null;

    const productIds = (productIdsInput?.value || "")
      .split(",")
      .map(s => Number(String(s).trim()))
      .filter(n => Number.isFinite(n) && n > 0);

    const maxTotalUses = Number(maxTotalUsesInput?.value);
    const maxUsesPerCustomer = Number(maxUsesPerCustomerInput?.value);

    const maxTotal = (Number.isFinite(maxTotalUses) && maxTotalUses > 0) ? Math.trunc(maxTotalUses) : null;
    const maxPer = (Number.isFinite(maxUsesPerCustomer) && maxUsesPerCustomer > 0) ? Math.trunc(maxUsesPerCustomer) : null;


    if (!code || code.length < 3){
      setPromoMsg("Promo code must be at least 3 characters.");
      return;
    }
    if (type === "percent" && (![10,20,30,40,50,60,70,80,90].includes(value))){
      setPromoMsg("Percent promo must be 10–90 in 10% increments.");
      return;
    }

    const promos = getPromoCodes();
    if (promos.some(p => p.code === code)){
      setPromoMsg("That promo code already exists.");
      return;
    }

    promos.push({
      id: crypto?.randomUUID?.() ?? String(Math.random()),
      code,
      type,
      value,
      active: true,
      startAt: startAt || null,
      endAt: endAt || null,
      productIds: productIds.length ? productIds : undefined,
      maxTotalUses: maxTotal ?? undefined,
      maxUsesPerCustomer: maxPer ?? undefined,
      createdAt: new Date().toISOString()
    });
    savePromoCodes(promos);

    codeInput.value = "";
    if (startAtInput) startAtInput.value = "";
    if (endAtInput) endAtInput.value = "";
    if (productIdsInput) productIdsInput.value = "";
    if (maxTotalUsesInput) maxTotalUsesInput.value = "";
    if (maxUsesPerCustomerInput) maxUsesPerCustomerInput.value = "";
    setPromoMsg("Promo added.");
    renderPromos();
  });

  promoTbody.addEventListener("click", (e) => {
    const btn = e.target.closest("button");
    if (!btn) return;
    const id = btn.getAttribute("data-id");
    const action = btn.getAttribute("data-promo-action");
    if (!id || !action) return;

    const promos = getPromoCodes();
    const idx = promos.findIndex(p => p.id === id);
    if (idx < 0) return;

    if (action === "toggle"){
      promos[idx].active = !promos[idx].active;
      savePromoCodes(promos);
      setPromoMsg(promos[idx].active ? "Promo activated." : "Promo deactivated.");
      renderPromos();
    }

    if (action === "editRules"){
      const current = promos[idx];

      // datetime-local expects "YYYY-MM-DDTHH:MM"
      const toLocalInput = (iso) => {
        if (!iso) return "";
        const d = new Date(iso);
        if (isNaN(d)) return "";
        const pad = (n) => String(n).padStart(2,"0");
        return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
      };

      const startRaw = prompt("Start (optional) as YYYY-MM-DDTHH:MM (local). Leave blank for none.", toLocalInput(current.startAt));
      if (startRaw === null) return;

      const endRaw = prompt("End (optional) as YYYY-MM-DDTHH:MM (local). Leave blank for none.", toLocalInput(current.endAt));
      if (endRaw === null) return;

      const prodRaw = prompt("Product IDs (optional) comma-separated. Leave blank for ALL products.", Array.isArray(current.productIds) ? current.productIds.join(",") : "");
      if (prodRaw === null) return;

      const maxTotalRaw = prompt("Max TOTAL uses (optional). Leave blank for unlimited.", current.maxTotalUses ?? "");
      if (maxTotalRaw === null) return;

      const maxPerRaw = prompt("Max uses PER CUSTOMER (optional). Leave blank for unlimited.", current.maxUsesPerCustomer ?? "");
      if (maxPerRaw === null) return;

      const startAt = String(startRaw).trim() ? new Date(String(startRaw).trim()).toISOString() : null;
      const endAt = String(endRaw).trim() ? new Date(String(endRaw).trim()).toISOString() : null;

      const productIds = String(prodRaw).trim()
        ? String(prodRaw).split(",").map(s=>Number(String(s).trim())).filter(n=>Number.isFinite(n) && n>0)
        : [];

      const maxTotal = String(maxTotalRaw).trim() ? Math.trunc(Number(maxTotalRaw)) : null;
      const maxPer = String(maxPerRaw).trim() ? Math.trunc(Number(maxPerRaw)) : null;

      if (startAt && isNaN(new Date(startAt))) { setPromoMsg("Invalid start date/time."); return; }
      if (endAt && isNaN(new Date(endAt))) { setPromoMsg("Invalid end date/time."); return; }
      if (startAt && endAt && new Date(startAt) > new Date(endAt)) { setPromoMsg("Start must be before end."); return; }

      promos[idx].startAt = startAt || undefined;
      promos[idx].endAt = endAt || undefined;
      promos[idx].productIds = productIds.length ? productIds : undefined;
      promos[idx].maxTotalUses = (Number.isFinite(maxTotal) && maxTotal > 0) ? maxTotal : undefined;
      promos[idx].maxUsesPerCustomer = (Number.isFinite(maxPer) && maxPer > 0) ? maxPer : undefined;

      savePromoCodes(promos);
      setPromoMsg("Promo rules updated.");
      renderPromos();
      return;
    }

    if (action === "editAccess"){
      const current = promos[idx];
      const existing = Array.isArray(current.allowedEmails) ? current.allowedEmails.join(", ") : "";
      const input = prompt("Enter allowed user emails (comma-separated). Leave blank to allow ALL users.", existing);
      if (input === null) return; // cancelled
      const trimmed = input.trim();
      if (trimmed === ""){
        delete promos[idx].allowedEmails; // open to all
      } else {
        promos[idx].allowedEmails = trimmed.split(",").map(s=>s.trim().toLowerCase()).filter(Boolean);
      }
      savePromoCodes(promos);
      setPromoMsg("Promo access updated.");
      renderPromos();
      return;
    }

    if (action === "delete"){
      promos.splice(idx, 1);
      savePromoCodes(promos);
      setPromoMsg("Promo deleted.");
      renderPromos();
    }
  });
}

// init promo codes on dashboard load
seedPromoCodesIfMissing();
wirePromoUI();
renderPromos();

/* ============================
   REFERRAL SETTINGS + AWARDING
   ============================ */
const REFERRAL_SETTINGS_KEY = "referral_settings_v1";
const REFERRAL_RECORDS_KEY = "referral_records_v1";
// Keep in sync with /js/shipping.js (demo rule): 100 pts = $1 off
const REFERRAL_POINTS_PER_DOLLAR = 100;

function loadReferralSettings(){
  try { return JSON.parse(localStorage.getItem(REFERRAL_SETTINGS_KEY) || "null") || { rewardDollars: 10 }; }
  catch { return { rewardDollars: 10 }; }
}
function saveReferralSettings(s){
  localStorage.setItem(REFERRAL_SETTINGS_KEY, JSON.stringify(s || { rewardDollars: 10 }));
}

function loadReferralRecords(){
  try { return JSON.parse(localStorage.getItem(REFERRAL_RECORDS_KEY) || "[]"); }
  catch { return []; }
}
function saveReferralRecords(list){
  localStorage.setItem(REFERRAL_RECORDS_KEY, JSON.stringify(list || []));
}

function wireReferralSettingsUI(){
  const dollarsInput = document.getElementById("referralRewardDollars");
  const hint = document.getElementById("referralRewardHint");
  const btn = document.getElementById("saveReferralSettingsBtn");
  const msg = document.getElementById("referralMsg");

  if (!dollarsInput || !btn) return;

  const s = loadReferralSettings();
  dollarsInput.value = String(Number(s.rewardDollars ?? 10));

  const refreshHint = () => {
    const dollars = Math.max(0, Math.trunc(Number(dollarsInput.value) || 0));
    const pts = dollars * REFERRAL_POINTS_PER_DOLLAR;
    if (hint) hint.textContent = `${pts} point(s) per successful referral.`;
  };
  refreshHint();
  dollarsInput.addEventListener("input", refreshHint);

  btn.addEventListener("click", () => {
    const dollars = Math.max(0, Math.trunc(Number(dollarsInput.value) || 0));
    saveReferralSettings({ rewardDollars: dollars });
    refreshHint();
    if (msg) msg.textContent = "Referral settings saved.";
  });
}

function awardReferralBonus({ referrerEmail, referredEmail }) {
  const ref = normalizeEmail(referrerEmail);
  const referred = normalizeEmail(referredEmail);

  if (!ref || !referred) return { ok: false, message: "Missing referral emails." };
  if (ref === referred) return { ok: false, message: "Self-referrals are not allowed." };

  const users = getUsersLocal();
  if (!users.some(u => normalizeEmail(u.email) === ref)) {
    return { ok: false, message: "Referrer email is not a known user." };
  }

  const records = loadReferralRecords();
  const already = records.some(r => normalizeEmail(r.referredEmail) === referred);
  if (already) return { ok: false, message: "This new user already has a recorded referrer." };

  const settings = loadReferralSettings();
  const dollars = Math.max(0, Math.trunc(Number(settings.rewardDollars) || 10));
  const points = dollars * REFERRAL_POINTS_PER_DOLLAR;

  records.push({ referrerEmail: ref, referredEmail: referred, points, timestamp: new Date().toISOString() });
  saveReferralRecords(records);

  postPointsAdjustment({ email: ref, points, note: `Referral bonus for referring ${referred}` });

  return { ok: true, message: `Awarded ${points} points to ${ref}.` };
}

wireReferralSettingsUI();


/* ============================
   USER MANAGEMENT (Admin)
   ============================ */
const USER_MGMT_V1 = true;

function normalizeEmail(s){ return String(s||"").trim().toLowerCase(); }

function populatePromoAssignSelect(){
  // Legacy name kept so we don't have to touch a bunch of call sites.
  // Promo access UI now lives in the User Details pane.
  const sel = document.getElementById("detailPromoSelect");
  if (!sel) return;
  const promos = getPromoCodes().slice().sort((a,b)=>String(a.code).localeCompare(String(b.code)));
  sel.innerHTML = promos.map(p => `<option value="${p.id}">${p.code} (${promoTypeLabel(p.type)})</option>`).join("");
}

function populateDetailPromoSelect(){
  return populatePromoAssignSelect();
}

function promoUserHasAccess(promo, email){
  const e = normalizeEmail(email);
  // No restriction => everyone has access
  if (!Array.isArray(promo.allowedEmails) || promo.allowedEmails.length === 0) return true;
  return promo.allowedEmails.map(normalizeEmail).includes(e);
}

function updateDetailPromoHint(){
  const msgEl = document.getElementById("detailPromoMsg");
  const sel = document.getElementById("detailPromoSelect");
  if (!msgEl || !sel) return;
  if (!selectedUserEmail){ msgEl.textContent = "Select a user to manage promo access."; return; }
  const promoId = sel.value;
  const promos = getPromoCodes();
  const p = promos.find(x => x.id === promoId);
  if (!p){ msgEl.textContent = ""; return; }

  if (!Array.isArray(p.allowedEmails)){
    msgEl.textContent = "This promo is open to all users.";
    return;
  }
  msgEl.textContent = promoUserHasAccess(p, selectedUserEmail)
    ? "User is currently allowed for this promo."
    : "User is currently NOT allowed for this promo.";
}

let selectedUserEmail = null;

function renderUserPurchases(email){
  const tbody = document.getElementById("userPurchasesTbody");
  if (!tbody) return;

  const txKey = (typeof TX_KEY !== "undefined") ? TX_KEY : "rewards_transactions_v2";
  // We can't import TX_KEY easily here; read the known key directly:
  let txs = [];
  try { txs = JSON.parse(localStorage.getItem("rewards_transactions_v2") || "[]"); } catch {}
  const filtered = txs.filter(t => normalizeEmail(t.userEmail) === normalizeEmail(email));

  if (filtered.length === 0){
    tbody.innerHTML = `<tr><td colspan="5" class="muted">No transactions found for this user.</td></tr>`;
    return;
  }

  tbody.innerHTML = filtered
    .sort((a,b)=>new Date(b.timestamp)-new Date(a.timestamp))
    .map(tx => {
      const items = Array.isArray(tx.items) ? tx.items : [];
      const itemSummary = items.map(i => `${i.qty}× ${i.name}`).join(", ");
      return `
        <tr>
          <td>${tx.id}</td>
          <td>${new Date(tx.timestamp).toLocaleString()}</td>
          <td>${tx.status}</td>
          <td title="${itemSummary.replace(/"/g,'&quot;')}">${items.length} item(s)</td>
          <td>$${Number(tx.amount).toFixed(2)}</td>
        </tr>
      `;
    }).join("");
}

function setUserToolsMsg(msg){
  const el = document.getElementById("userToolsMsg");
  if (el) el.textContent = msg || "";
}

function wireUserTools(){
  const addBtn = document.getElementById("addUserBtn");
  const resetPwBtn = document.getElementById("resetPwBtn");
  const resetPwInput = document.getElementById("resetPwInput");
  // Promo access UI moved into the User Details pane.

  if (addBtn){
    addBtn.addEventListener("click", () => {
      const firstName = document.getElementById("newUserFirst").value.trim();
      const lastName  = document.getElementById("newUserLast").value.trim();
      const email     = normalizeEmail(document.getElementById("newUserEmail").value);
      const referrer  = normalizeEmail(document.getElementById("newUserReferrer")?.value);
      const password  = document.getElementById("newUserPassword").value;
      const role      = (document.getElementById("newUserRole")?.value || "user").trim();
      const age       = Number(document.getElementById("newUserAge").value || 0) || "";
      const address   = document.getElementById("newUserAddress").value.trim();

      if (!email || !email.includes("@")){
        setUserToolsMsg("Enter a valid email.");
        return;
      }
      if (!password || password.length < 4){
        setUserToolsMsg("Password must be at least 4 characters (demo rule).");
        return;
      }

      const usersRaw = getUsersLocal();
      const users = usersRaw;
      if (users.some(u => normalizeEmail(u.email) === email)){
        setUserToolsMsg("A user with that email already exists.");
        return;
      }

      users.push({
        firstName, lastName, email,
        password,
        role: (role === "admin" ? "admin" : "user"),
        status: "active",
        age,
        address,
        referredBy: referrer || undefined,
        securityQuestions: []
      });
      saveUsersLocal(users);

      let referralNote = "";
      if (referrer) {
        const r = awardReferralBonus({ referrerEmail: referrer, referredEmail: email });
        referralNote = r.ok ? ` ${r.message}` : ` Referral not applied: ${r.message}`;
      }

      setUserToolsMsg(`User added.${referralNote}`);
      // refresh user list UI
      loadUsers();
      populateDetailPromoSelect();
    });
  }

  if (resetPwBtn){
    resetPwBtn.addEventListener("click", () => {
      if (!selectedUserEmail){
        setUserToolsMsg("Select a user first.");
        return;
      }
      const newPw = resetPwInput ? resetPwInput.value : "";
      if (!newPw || newPw.length < 4){
        setUserToolsMsg("New password must be at least 4 characters (demo rule).");
        return;
      }

      const usersRaw = getUsersLocal();
      const users = usersRaw;
      const idx = users.findIndex(u => normalizeEmail(u.email) === normalizeEmail(selectedUserEmail));
      if (idx < 0){
        setUserToolsMsg("User not found.");
        return;
      }

      users[idx].password = newPw;
      saveUsersLocal(users);
      setUserToolsMsg("Password updated.");
      if (resetPwInput) resetPwInput.value = "";
      loadUsers();
    });
  }

  function updatePromoRestriction(promoId, email, makeAllowed){
    const promos = getPromoCodes();
    const idx = promos.findIndex(p => p.id === promoId);
    if (idx < 0) return { ok:false, msg:"Promo not found." };

    const e = normalizeEmail(email);
    if (!e) return { ok:false, msg:"Select a user first." };

    // allowedEmails: null/undefined => open to all. If restricting, convert to []
    if (!Array.isArray(promos[idx].allowedEmails)){
      promos[idx].allowedEmails = [];
    }

    const list = promos[idx].allowedEmails;

    if (makeAllowed){
      if (!list.includes(e)) list.push(e);
    } else {
      const pos = list.indexOf(e);
      if (pos >= 0) list.splice(pos, 1);
    }

    // If empty list, treat as "restricted but currently nobody"? We'll keep empty list as restricted-none.
    savePromoCodes(promos);
    renderPromos();
    return { ok:true, msg: makeAllowed ? "Promo granted to user." : "Promo revoked from user." };
  }

  // Promo access is handled in wireDetailPromoUI()
}

/* Extend existing user selection to power user tools */
function setSelectedUser(email){
  selectedUserEmail = email;
  renderUserPurchases(email);
}

function wireDetailPromoUI(){
  const sel = document.getElementById("detailPromoSelect");
  const grantBtn = document.getElementById("detailGrantPromoBtn");
  const revokeBtn = document.getElementById("detailRevokePromoBtn");
  const msgEl = document.getElementById("detailPromoMsg");

  if (!sel || !grantBtn || !revokeBtn) return;

  sel.addEventListener("change", updateDetailPromoHint);

  const setMsg = (t) => { if (msgEl) msgEl.textContent = t || ""; };

  function updatePromoRestriction(promoId, email, makeAllowed){
    const promos = getPromoCodes();
    const idx = promos.findIndex(p => p.id === promoId);
    if (idx < 0) return { ok:false, msg:"Promo not found." };

    const e = normalizeEmail(email);
    if (!e) return { ok:false, msg:"Select a user first." };

    // allowedEmails: null/undefined => open to all. If restricting, convert to []
    if (!Array.isArray(promos[idx].allowedEmails)){
      promos[idx].allowedEmails = [];
    }

    const list = promos[idx].allowedEmails;

    if (makeAllowed){
      if (!list.includes(e)) list.push(e);
    } else {
      const pos = list.indexOf(e);
      if (pos >= 0) list.splice(pos, 1);
    }

    savePromoCodes(promos);
    renderPromos();
    return { ok:true, msg: makeAllowed ? "Promo granted to user." : "Promo revoked from user." };
  }

  grantBtn.addEventListener("click", () => {
    if (!selectedUserEmail){ setMsg("Select a user first."); return; }
    const res = updatePromoRestriction(sel.value, selectedUserEmail, true);
    setMsg(res.msg);
    updateDetailPromoHint();
  });

  revokeBtn.addEventListener("click", () => {
    if (!selectedUserEmail){ setMsg("Select a user first."); return; }
    const res = updatePromoRestriction(sel.value, selectedUserEmail, false);
    setMsg(res.msg);
    updateDetailPromoHint();
  });
}

populatePromoAssignSelect();
wireUserTools();
wireDetailPromoUI();

// ----- Rewards points admin adjustments (ledger-based, per-user) -----
const REWARDS_LEDGER_KEY = "rewards_points_ledger_v2";

function loadRewardsLedger() {
  try { return JSON.parse(localStorage.getItem(REWARDS_LEDGER_KEY) || "[]"); }
  catch { return []; }
}

function saveRewardsLedger(ledger) {
  localStorage.setItem(REWARDS_LEDGER_KEY, JSON.stringify(ledger));
}

function newLedgerId(ledger) {
  const n = ledger.length + 1;
  return `PL-${String(n).padStart(5, "0")}`;
}

function postPointsAdjustment({ email, points, note }) {
  const ledger = loadRewardsLedger();
  ledger.push({
    id: newLedgerId(ledger),
    timestamp: new Date().toISOString(),
    userEmail: normalizeEmail(email),
    type: "ADJUST_AVAILABLE",
    txId: null,
    points: Number(points),
    note: note || "Admin adjustment",
  });
  saveRewardsLedger(ledger);
}

function getFilteredUserEmails() {
  // Mirror the current filter UI (role filter + search) so "Apply to filtered" does what it says.
  const users = getUsersLocal();
  const q = (document.getElementById("searchInput")?.value || "").trim().toLowerCase();
  const roleFilter = (document.getElementById("roleFilter")?.value || "all").trim();

  return users
    .filter(u => {
      const text = `${u.firstName || ""} ${u.lastName || ""} ${u.email || ""}`.toLowerCase();
      const matchesQ = !q || text.includes(q);
      const r = String(u.role || "user");
      const matchesRole = roleFilter === "all" || r === roleFilter;
      return matchesQ && matchesRole;
    })
    .map(u => u.email)
    .filter(Boolean);
}

function wirePointsAdjustUI() {
  const input = document.getElementById("pointsAdjustInput");
  const btn = document.getElementById("addPointsBtn");
  const btnFiltered = document.getElementById("addPointsFilteredBtn");
  const msg = document.getElementById("pointsAdjustMsg");

  const say = (t) => { if (msg) msg.textContent = t || ""; };

  if (!input || !btn) return;

  btn.addEventListener("click", () => {
    if (!selectedUserEmail) { say("Select a user first."); return; }
    const n = Number(input.value);
    if (!Number.isFinite(n) || n === 0) { say("Enter a non-zero number of points."); return; }

    postPointsAdjustment({ email: selectedUserEmail, points: Math.trunc(n), note: "Admin points adjustment" });
    say(`Applied ${Math.trunc(n)} point(s) to ${selectedUserEmail}.`);
    input.value = "";
  });

  if (btnFiltered) {
    btnFiltered.addEventListener("click", () => {
      const n = Number(input.value);
      if (!Number.isFinite(n) || n === 0) { say("Enter a non-zero number of points."); return; }

      const emails = getFilteredUserEmails();
      if (emails.length === 0) { say("No users match the current filters."); return; }

      emails.forEach(email => postPointsAdjustment({ email, points: Math.trunc(n), note: "Admin bulk points adjustment" }));
      say(`Applied ${Math.trunc(n)} point(s) to ${emails.length} user(s).`);
      input.value = "";
    });
  }
}

wirePointsAdjustUI();
