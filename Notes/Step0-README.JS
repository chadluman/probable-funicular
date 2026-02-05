/*
======================================================
WEEK 1 TYPE-ALONG — READ ME FIRST
======================================================

📁 PROJECT STRUCTURE
--------------------
Project/
 ├─ App/
 │   ├─ index2.html
 │   └─ style2.css
 ├─ Auth/
 │   ├─ register.html
 │   ├─ login.html
 │   ├─ styles.css
 │   ├─ mockDb.js     ← you'll create this
 │   └─ auth.js       ← you'll create this
 └─ Notes/
     ├─ STEP0_README.js
     └─ STEP1_Additions.js


🎯 GOAL
-------
You will:
1. Add links and buttons to the homepage that lead to the Register and Login pages.
2. Create a simple "mock database" with localStorage.
3. Add basic registration and login logic.
4. See your saved user data persist in localStorage.

Everything runs **locally** using VS Code and Live Server.


🪜 STEPS
---------
1️⃣ Open Notes/STEP1_Additions.js  
   Follow the step-by-step instructions inside.  
   Copy only the parts inside the comment blocks into your project.

2️⃣ In the Auth folder, create TWO new files:
   - mockDb.js
   - auth.js

   Then, at the BOTTOM of BOTH register.html and login.html,
   right before </body>, add:

   -------------------------------------------------------
   <script type="module" src="./mockDb.js"></script>
   <script type="module" src="./auth.js"></script>
   -------------------------------------------------------

3️⃣ Open Live Server on App/index2.html and test:
   - Click Register → create a new account.
   - Log in using that account.
   - (Optional) You’ll see a “Signed in as” bar on the homepage.

4️⃣ Open DevTools → Application → Local Storage:
   - You should see “app_users” and “current_user” stored.


💡 REMEMBER
-----------
- localStorage saves data on your own computer.
- You can clear it anytime from DevTools or code.

🔥 You’ll finish Week 1 with a working registration + login flow!
*/
