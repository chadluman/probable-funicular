# Admin + Sales Dashboard + Security Questions Pack

This pack gives you a working front-end skeleton for:

1. **Admin Dashboard → Sales Dashboard** link
2. A **standardized transaction model** (so rewards + analytics use the same fields)
3. **Security questions** in the Account page + a **Forgot password** flow using those questions

It’s written in plain HTML/CSS/JS and assumes you store:
- `authToken` (access token) in `localStorage`
- `userRole` in `localStorage` (`user` | `elevated` | `admin`)

If your app uses sessions/cookies instead, the UI still works. You’ll just tweak the fetch headers.

---

## Files

### Admin + sales
- `App/admin-dashboard.html`
- `App/admin-dashboard.js`
- `App/admin-sales.html`
- `App/admin-sales.js`
- `App/admin-ui.css` (includes the **baby-blue diamond border** for elevated/admin)

### Account recovery
- `App/account-security-snippet.html` (paste this block into your existing `account.html`)
- `App/account-security.js` (attach it on account page)
- `Auth/forgot-password.html`
- `Auth/forgot-password.js`

### Docs
- `docs/transaction-model.md`

---

## How to integrate (fast)

### 1) Put files in your project
Copy `App/` and `Auth/` files into your project’s matching folders.

### 2) Add the Account security block
Paste `App/account-security-snippet.html` into your `account.html` and add this script tag near the bottom:

```html
<script src="/App/account-security.js"></script>
```

### 3) Add Admin link(s)
- Admin dashboard: `App/admin-dashboard.html`
- Sales dashboard: `App/admin-sales.html`

Your footer "Admin / Elevated Access" link can point to your admin login page. Once logged in, route admins to `admin-dashboard.html`.

---

## Required backend routes

You can keep these names or change them, just update the fetch URLs in the JS.

### Users + roles
- `GET /api/admin/users`
- `POST /api/admin/users/:id/role` body `{ role }`
- `POST /api/admin/users/:id/status` body `{ status }`
- `POST /api/admin/users/:id/force-password-reset`

### Sales
- `GET /api/admin/sales?start=YYYY-MM-DD&end=YYYY-MM-DD&status=...&q=...`
  - returns `{ transactions, pointsIssued, pointsRedeemed }`

### Security questions
- `POST /api/user/security-questions` body `{ password, questions: [{questionId, answer}] }`

### Password reset using security questions
- `POST /api/auth/reset/start` body `{ email }`
  - returns `{ resetToken, questionIds }`
- `POST /api/auth/reset/finish` body `{ resetToken, answers, newPassword }`

---

## Security notes (because humans)
- Do **not** store security answers in plain text.
- Hash answers using a per-user salt, compare hashes server-side.
- Make `resetToken` short-lived (5–10 minutes) and single-use.
- Don’t leak whether an email exists (user enumeration). `reset/start` should look “successful” even when the account doesn’t exist.

