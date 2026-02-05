/*
======================================================
STEP 1 — ADD THESE SNIPPETS INTO YOUR PROJECT
======================================================
Follow the instructions carefully.
You only need to Type the code inside the comment boxes below.
======================================================
*/



/*
-------------------------------------------------------
1️⃣  ADD REGISTER & LOGIN LINKS TO NAVIGATION
-------------------------------------------------------
FILE: App/index2.html
LOCATION: Inside the <ul id="navMenu" class="nav__list"> ... </ul>

Type and paste the lines below:
-------------------------------------------------------
<li><a href="../Auth/register.html" class="nav__link">Register</a></li>
<li><a href="../Auth/login.html" class="btn btn--sm btn--primary">Log In</a></li>
-------------------------------------------------------
*/



/*
-------------------------------------------------------
2️⃣  ADD REGISTER & LOGIN BUTTONS TO HERO SECTION
-------------------------------------------------------
FILE: App/index2.html
LOCATION: Inside the <div class="hero__actions"> ... </div>

Type and paste the lines below:
-------------------------------------------------------
<a href="../Auth/register.html" class="btn btn--primary">Create Account</a>
<a href="../Auth/login.html" class="btn btn--outline">Log In</a>
-------------------------------------------------------
*/



/*
-------------------------------------------------------
3️⃣  OPTIONAL — SHOW SIGNED-IN USER ON HOMEPAGE
-------------------------------------------------------
FILE: App/index2.html
LOCATION: At the very bottom, just before </body>

Type and paste this entire <script> block:
-------------------------------------------------------
<script type="module">
  import { getCurrentUser, clearCurrentUser } from "../Auth/mockDb.js";

  const who = getCurrentUser();
  if (who) {
    const chip = document.createElement("div");
    chip.style.cssText =
      "position:fixed;bottom:14px;right:14px;background:#0b1220;color:white;border:1px solid rgba(255,255,255,.15);padding:10px 14px;border-radius:10px;z-index:9999;font-size:14px";
    chip.innerHTML = `
      Signed in as <strong>${who.firstName} ${who.lastName}</strong>
      <button id="logoutBtn"
        style="margin-left:10px;padding:4px 8px;border:none;
        border-radius:6px;background:#6366f1;color:white;cursor:pointer;">
        Log out
      </button>
    `;
    document.body.appendChild(chip);
    document.querySelector("#logoutBtn").addEventListener("click", () => {
      clearCurrentUser();
      location.reload();
    });
  }
</script>
-------------------------------------------------------
*/



/*
-------------------------------------------------------
4️⃣  CREATE FILE: Auth/mockDb.js
-------------------------------------------------------
Type this full code into that file:
-------------------------------------------------------
export function getUsers() {
  return JSON.parse(localStorage.getItem("app_users")) || [];
}

export function saveUsers(users) {
  localStorage.setItem("app_users", JSON.stringify(users));
}

export function addUser(user) {
  const users = getUsers();
  users.push(user);
  saveUsers(users);
}

export function getCurrentUser() {
  return JSON.parse(localStorage.getItem("current_user"));
}

export function setCurrentUser(user) {
  localStorage.setItem("current_user", JSON.stringify(user));
}

export function clearCurrentUser() {
  localStorage.removeItem("current_user");
}
-------------------------------------------------------
*/



/*
-------------------------------------------------------
5️⃣  CREATE FILE: Auth/auth.js
-------------------------------------------------------
Type this full code into that file:
-------------------------------------------------------
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

    setCurrentUser(user);
    alert("Login successful! Redirecting to homepage...");
    window.location.href = "../App/index2.html";
  });
}
-------------------------------------------------------
*/



/*
-------------------------------------------------------
6️⃣  ADD THESE SCRIPTS TO BOTH AUTH PAGES
-------------------------------------------------------
FILE: Auth/register.html
FILE: Auth/login.html
LOCATION: Just before the closing </body> tag

Type and paste this:
-------------------------------------------------------
<script type="module" src="./mockDb.js"></script>
<script type="module" src="./auth.js"></script>
-------------------------------------------------------
*/



/*
🎉 DONE!
-------------------------------------------------------
You now have:
✅ Working Register and Login pages
✅ Saved users in localStorage
✅ Automatic redirect on login
✅ Optional “Signed in as” display on homepage
✅ All powered by basic JavaScript

Test everything using Live Server in VS Code!
*/
