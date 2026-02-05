# Standard Transaction Model (single source of truth)

Use this structure for **every** purchase, refund, points issuance, and redemption event.

Why: your rewards engine, account history page, and sales dashboard should not each invent their own half-compatible format.

---

## Transaction JSON

```json
{
  "id": "tx_123",
  "createdAt": "2026-01-20T23:12:34.567Z",

  "type": "PURCHASE", 
  "status": "PENDING",

  "amount": 119.50,
  "currency": "USD",

  "orderId": "ORD-45678",

  "user": {
    "id": "user_abc",
    "email": "vip@test.com",
    "name": "VIP User"
  },

  "payment": {
    "provider": "stripe",
    "methodId": "pm_...",
    "brand": "VISA",
    "last4": "4242"
  },

  "rewards": {
    "tierAtPurchase": "silver",
    "pointsDelta": 24,
    "pointsStatus": "PENDING",
    "roundedSpend": 120
  },

  "settlement": {
    "clearsAt": "2026-01-21T23:12:34.567Z",
    "clearedAt": null
  }
}
```

---

## Field rules

### `type`
- `PURCHASE` (money paid)
- `REFUND` (money returned)
- `POINTS_REDEEM` (points spent, `pointsDelta` negative)
- `POINTS_ADJUST` (manual correction)

### `status`
- `PENDING` (authorized, not cleared)
- `CLEARED` (settled)
- `REFUNDED` (refunded)
- `FAILED` (payment failed)

### `rewards.pointsDelta`
- Positive: points granted
- Negative: points redeemed

### `rewards.pointsStatus`
- `PENDING` until the transaction is cleared
- `AVAILABLE` when cleared
- `REVERSED` if refunded/chargeback

### `rewards.roundedSpend`
You said:
- Round **up** to nearest 10
- No partials

So on the backend you compute:
- `roundedSpend = ceil(amount / 10) * 10`

Then points:
- bronze: `roundedSpend / 10 * 1`
- silver: `roundedSpend / 10 * 2`
- gold: `roundedSpend / 10 * 3`

(Keep *all* that logic server-side.)

---

## Admin sales dashboard expectations
To power KPIs cleanly:
- Gross sales = sum(amount) where status != FAILED
- Net sales = gross - sum(amount where status == REFUNDED)
- Pending revenue = sum(amount where status == PENDING)
- Points issued = sum(pointsDelta where pointsDelta > 0)
- Points redeemed = sum(abs(pointsDelta) where pointsDelta < 0)

---

## Storage
- Store `createdAt` in UTC ISO 8601.
- Store money as integer cents in DB if possible.

