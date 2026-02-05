/* =========================================================
   ARRAY METHODS (ESSENTIAL 5) — EXERCISES (BEGINNER)
   forEach / map / filter / reduce / sort
   =========================================================
   RULES:
   - Use the method named in each question
   - Use arrow functions for callbacks
   - FIRST SECTION is fill-in-the-blank
========================================================= */


/* =========================
   SECTION 1: FILL IN THE BLANK (WARM-UP)
   ========================= */

// 1) forEach: log each number
let nums1 = [1, 2, 3];
nums1.________(n => console.log(n));


// 2) map: create a new array where each number is doubled
let nums2 = [2, 4, 6];
let doubled = nums2.________(n => n * ____ );
console.log(doubled);


// 3) filter: keep only numbers greater than 10
let nums3 = [5, 12, 8, 20];
let big = nums3.________(n => n > ____ );
console.log(big);


// 4) reduce: sum all numbers (start accumulator at 0)
let nums4 = [3, 6, 9];
let sum = nums4.________((acc, n) => acc + n, ____ );
console.log(sum);


// 5) sort: sort numbers from smallest to largest (ascending)
let nums5 = [9, 1, 5, 2];
nums5.________((a, b) => a - b);
console.log(nums5);



/* =========================
   SECTION 2: forEach (NO RETURN)
   ========================= */

// 6) Use forEach to log: "Value: <number>"
let values = [10, 20, 30];


// 7) Use forEach to count how many items are in the array
//    (Hint: use a counter variable)
let items = ["a", "b", "c", "d"];


// 8) Use forEach to log each word in uppercase
let words1 = ["hi", "bye", "ok"];



/* =========================
   SECTION 3: map (NEW ARRAY)
   ========================= */

// 9) Use map to add 1 to each number
let nums6 = [4, 7, 1, 0];


// 10) Use map to convert numbers to strings like "Score: 88"
let scores = [88, 92, 75];


// 11) Use map to extract just the prices
let products = [
  { name: "TV", price: 800 },
  { name: "Cable", price: 10 },
  { name: "PS5", price: 600 }
];



/* =========================
   SECTION 4: filter (KEEP SOME ITEMS)
   ========================= */

// 12) Use filter to keep only even numbers
let nums7 = [1, 2, 3, 4, 5, 6];


// 13) Use filter to keep only strings
let mixed = ["hello", 42, true, "world", null, "JS"];


// 14) Use filter to keep products that cost 100 or more
let store = [
  { name: "Laptop", price: 1200 },
  { name: "Mouse", price: 25 },
  { name: "Monitor", price: 200 }
];



/* =========================
   SECTION 5: reduce (ONE VALUE)
   ========================= */

// 15) Use reduce to find the total cart cost
let cart = [19.99, 9.99, 4.99];


// 16) Use reduce to count how many true values are in the array
let checks = [true, false, true, true, false];


// 17) Use reduce to combine letters into ONE string
let letters = ["J", "S", "!"];



/* =========================
   SECTION 6: sort (ORDER ITEMS)
   ========================= */

// 18) Sort numbers descending (largest → smallest)
let nums8 = [3, 10, 1, 7];


// 19) Sort words alphabetically
let words2 = ["banana", "apple", "cherry"];


// 20) Sort objects by age (youngest → oldest)
let users = [
  { name: "Martin", age: 33 },
  { name: "Bob", age: 44 },
  { name: "Stacy", age: 24 }
];



/* =========================
   SECTION 7: MINI CHALLENGE (BEGINNER)
   =========================
   You have test scores:
   1) Use filter to keep scores >= 70
   2) Use reduce to get the total of passing scores
   3) Log the passing array and the total
*/
let testScores = [95, 60, 72, 88, 45, 70];
