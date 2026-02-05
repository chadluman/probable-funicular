/* =========================================================
   ANSWER KEY — ARRAY METHODS (BEGINNER)
   ========================================================= */


/* =========================
   SECTION 1: FILL IN THE BLANK (ANSWERS)
   ========================= */

// 1
let nums1 = [1, 2, 3];
nums1.forEach(n => console.log(n));

// 2
let nums2 = [2, 4, 6];
let doubled = nums2.map(n => n * 2);
console.log(doubled);

// 3
let nums3 = [5, 12, 8, 20];
let big = nums3.filter(n => n > 10);
console.log(big);

// 4
let nums4 = [3, 6, 9];
let sum = nums4.reduce((acc, n) => acc + n, 0);
console.log(sum);

// 5
let nums5 = [9, 1, 5, 2];
nums5.sort((a, b) => a - b);
console.log(nums5);



/* =========================
   SECTION 2: forEach
   ========================= */

// 6
let values = [10, 20, 30];
values.forEach(n => console.log(`Value: ${n}`));

// 7
let items = ["a", "b", "c", "d"];
let count = 0;
items.forEach(() => count++);
console.log(count);

// 8
let words1 = ["hi", "bye", "ok"];
words1.forEach(w => console.log(w.toUpperCase()));



/* =========================
   SECTION 3: map
   ========================= */

// 9
let nums6 = [4, 7, 1, 0];
let plusOne = nums6.map(n => n + 1);
console.log(plusOne);

// 10
let scores = [88, 92, 75];
let labels = scores.map(s => `Score: ${s}`);
console.log(labels);

// 11
let products = [
  { name: "TV", price: 800 },
  { name: "Cable", price: 10 },
  { name: "PS5", price: 600 }
];
let prices = products.map(p => p.price);
console.log(prices);



/* =========================
   SECTION 4: filter
   ========================= */

// 12
let nums7 = [1, 2, 3, 4, 5, 6];
let evens = nums7.filter(n => n % 2 === 0);
console.log(evens);

// 13
let mixed = ["hello", 42, true, "world", null, "JS"];
let onlyStrings = mixed.filter(v => typeof v === "string");
console.log(onlyStrings);

// 14
let store = [
  { name: "Laptop", price: 1200 },
  { name: "Mouse", price: 25 },
  { name: "Monitor", price: 200 }
];
let expensive = store.filter(item => item.price >= 100);
console.log(expensive);



/* =========================
   SECTION 5: reduce
   ========================= */

// 15
let cart = [19.99, 9.99, 4.99];
let cartTotal = cart.reduce((acc, price) => acc + price, 0);
console.log(cartTotal);

// 16
let checks = [true, false, true, true, false];
let trueCount = checks.reduce((acc, v) => (v === true ? acc + 1 : acc), 0);
console.log(trueCount);

// 17
let letters = ["J", "S", "!"];
let combined = letters.reduce((acc, ch) => acc + ch, "");
console.log(combined);



/* =========================
   SECTION 6: sort
   ========================= */

// 18
let nums8 = [3, 10, 1, 7];
nums8.sort((a, b) => b - a);
console.log(nums8);

// 19
let words2 = ["banana", "apple", "cherry"];
words2.sort();
console.log(words2);

// 20
let users = [
  { name: "Martin", age: 33 },
  { name: "Bob", age: 44 },
  { name: "Stacy", age: 24 }
];
users.sort((a, b) => a.age - b.age);
console.log(users);



/* =========================
   SECTION 7: MINI CHALLENGE
   ========================= */

let testScores = [95, 60, 72, 88, 45, 70];

let passing = testScores.filter(s => s >= 70);
let passingTotal = passing.reduce((acc, s) => acc + s, 0);

console.log(passing);
console.log(passingTotal);
