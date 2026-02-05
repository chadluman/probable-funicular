/* =========================================================
   EXERCISES — SCOPE & CONDITIONALS (EXTENDED + MINI PROJECT)
   ========================================================= */


/* =========================
   SECTION 1: SCOPE (WARM-UP)
   ========================= */

// 1) What will be logged?
let count = 5;
{
  console.log(_____); // fill in variable name
}


// 2) What happens when this runs?
{
  let secret = "hidden";
}
// console.log(secret); // logs ___ OR throws ___


// 3) Fill in the blank so BOTH values log correctly
var total = 10;
{
  _____ bonus = 5;
}
console.log(total, bonus);


// 4) True or False:
//    Variables declared with var ignore block scope.
__________


// 5) What will be logged?
let points = 100;
{
  let points = 50;
  console.log(points);
}
console.log(points);



/* =========================
   SECTION 2: BASIC IF STATEMENTS
   ========================= */

// 6) Write an if statement:
//    If isOnline is true, log "User is online"

let isOnline = true;
// write code below



// 7) Write an if statement:
//    If temperature is greater than 75, log "Warm day"

let temperature = 80;
// write code below



// 8) Write an if / else:
//    If passwordLength is at least 8 → log "Strong password"
//    Otherwise → log "Weak password"

let passwordLength = 6;
// write code below



/* =========================
   SECTION 3: IF / ELSE IF / ELSE
   ========================= */

// 9) Write grading logic:
//    90+ → "A"
//    80+ → "B"
//    70+ → "C"
//    Otherwise → "F"

let examScore = 73;
// write code below



// 10) Write login role logic:
//     "admin" → "Full access"
//     "editor" → "Edit access"
//     "viewer" → "Read-only access"
//     Anything else → "Guest access"

let role = "editor";
// write code below



/* =========================
   SECTION 4: SCOPE + CONDITIONALS
   ========================= */

// 11) What will this log?
let status = "active";

if (status === "active") {
  let message = "Account active";
  console.log(message);
}

// console.log(message); // does this work? YES or NO


// 12) Fix the code so it does NOT throw an error
let loggedIn = true;

if (loggedIn) {
  _____ greeting = "Welcome!";
  console.log(greeting);
}

// console.log(greeting); // should NOT work



// 13) What will be logged?
let score2 = 85;

if (score2 > 90) {
  console.log("Excellent");
} else if (score2 > 80) {
  console.log("Good");
} else {
  console.log("Needs improvement");
}



/* =========================
   SECTION 5: REAL-WORLD THINKING
   ========================= */

// 14) True or False:
//     A variable declared with let inside an if block
//     can be accessed outside the block.
__________


// 15) What happens here?
var level = 1;

if (true) {
  var level = 2;
}

console.log(level); // logs ___


// 16) Predict the output:
let price = 20;

if (price > 25) {
  console.log("Expensive");
} else {
  console.log("Affordable");
}



// 17) Write an if / else:
//     If age is 18 or older → log "Can sign up"
//     Otherwise → log "Too young"

let userAge = 16;
// write code below



/* =========================
   MINI PROJECT (END)
   =========================
   GOAL: Build a small "Checkout + Access" program using ONLY:
   - variables
   - if / else if / else
   - block scope (let)
   - console.log

   REQUIREMENTS:
   You are given:
   - userAge
   - cartTotal
   - isMember (true/false)
   - couponCode (string)

   RULES:
   1) If userAge is less than 18:
        log "Access denied: must be 18+"
      and do NOT calculate totals.

   2) Otherwise (18+):
      - Start with shippingCost = 9.99
      - If cartTotal is 100 or more:
          shippingCost becomes 0
      - If isMember is true:
          discountPercent becomes 0.10
        else:
          discountPercent becomes 0

      - If couponCode is "SAVE5":
          couponAmount becomes 5
        else:
          couponAmount becomes 0

   3) Calculate:
      discountedTotal = cartTotal - (cartTotal * discountPercent)
      finalTotal = discountedTotal + shippingCost - couponAmount

   4) Log all of these (each on its own line):
      shippingCost
      discountPercent
      couponAmount
      finalTotal

   STARTER VARIABLES (do not change values):
*/

let mp_userAge = 19;
let mp_cartTotal = 120;
let mp_isMember = true;
let mp_couponCode = "SAVE5";

// Write your mini project code below
