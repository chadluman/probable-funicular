import { getUsers, addUser, getCurrentUser, setCurrentUser } from "./mockDb.js";

// --- REGISTER LOGIC ---
const registerForm = document.querySelector('form[action="/register"]');
if (registerForm) {
  registerForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const firstName = document.querySelector("#firstName").value.trim();
    const lastName = document.querySelector("#lastName").value.trim();
    const email = document.querySelector("#email").value.trim().toLowerCase();
    const password = document.querySelector("#password").value.trim();
    const confirm = document.querySelector("#confirm").value.trim();

    if (!firstName || !lastName || !email || !password || !confirm) {
      alert("Please fill out all fields.");
      return;
    }

    if (password !== confirm) {
      alert("Passwords do not match.");
      return;
    }

    const users = getUsers();
    const exists = users.find((u) => u.email === email);
    if (exists) {
      alert("An account with that email already exists.");
      return;
    }

    addUser({ firstName, lastName, email, password });
    alert("Account created successfully! Redirecting to login...");
    window.location.href = "login.html";
  });
}
// nice push
// --- LOGIN LOGIC ---
const loginForm = document.querySelector('form[action="/login"]');
if (loginForm) {
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const email = document.querySelector("#email").value.trim().toLowerCase();
    const password = document.querySelector("#password").value.trim();

    const users = getUsers();
    const user = users.find((u) => u.email === email && u.password === password);

    if (!user) {
      alert("Invalid email or password.");
      return;
    }

    // role + token enforcement (frontend demo)
    const requestedRoleEl = document.querySelector("#requestedRole");
    const tokenEl = document.querySelector("#adminToken");
    const requestedRole = requestedRoleEl ? requestedRoleEl.value : "user";

    // Default session role
    localStorage.setItem("session_role", "user");

    if (requestedRole === "admin") {
      const token = tokenEl ? tokenEl.value : "";
      if (token !== "AdminT0ken") {
        alert("Invalid admin token. Elevated access denied.");
        localStorage.setItem("session_role", "user");
      } else {
        localStorage.setItem("session_role", requestedRole);
      }
    }

    setCurrentUser(user);
    alert("Login successful! Redirecting to homepage...");
    window.location.href = (localStorage.getItem("session_role")==="admin") ? "../App/admin-dashboard.html" : "../App/index2.html";
  });
}

// --- Session refresh + role helpers added ---

function logout(){
  localStorage.removeItem("current_user");
  localStorage.removeItem("session_role");
  window.location.href = "login.html";
}


// (Session timeout popup removed)


// --- Login page role/token UI ---
const roleSelect = document.querySelector("#requestedRole");
const tokenWrap = document.querySelector("#tokenWrap");
if (roleSelect && tokenWrap) {
  const sync = () => {
    const v = roleSelect.value;
    tokenWrap.hidden = !(v === "admin" || v === "elevated");
  };
  roleSelect.addEventListener("change", sync);
  sync();
}
