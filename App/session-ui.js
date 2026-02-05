// session-ui.js
// Handles: (1) Login -> My Account link swap, (2) Elevated border, (3) Admin button visibility
(function () {
  const currentUserRaw = localStorage.getItem("current_user");
  const sessionRole = localStorage.getItem("session_role") || "user";
  const isPrivileged = currentUserRaw && (sessionRole === "admin" || sessionRole === "elevated");

  // Elevated border for elevated/admin
  if (sessionRole === "admin" || sessionRole === "elevated") {
    document.body.classList.add("elevated");
  } else {
    document.body.classList.remove("elevated");
  }

  // Swap "Login" to "My Account" and inject/remove Admin Dashboard button
  const accountLink = document.getElementById("accountLink");
  const registerLink = document.getElementById("registerLink");
  if (!accountLink) return;

  let adminBtn = document.getElementById("adminDashboardBtn");

  if (isPrivileged) {
    if (!adminBtn) {
      adminBtn = document.createElement("a");
      adminBtn.id = "adminDashboardBtn";
      adminBtn.href = "./admin-dashboard.html";
      adminBtn.textContent = "Admin Dashboard";
      adminBtn.className = "btn btn--sm btn--outline admin-pill";
      accountLink.parentElement.insertBefore(adminBtn, accountLink.nextSibling);
    }
  } else {
    if (adminBtn) adminBtn.remove(); // vanish on logout / non-admin session
  }

  if (currentUserRaw) {
    accountLink.textContent = "My Account";
    accountLink.setAttribute("href", "./account.html");

    // Optional: hide register link when logged in
    if (registerLink) registerLink.style.display = "none";
  } else {
    accountLink.textContent = accountLink.dataset.loggedOutText || "Login";
    accountLink.setAttribute("href", "../Auth/login.html");
    if (registerLink) registerLink.style.display = "";
  }
})();
