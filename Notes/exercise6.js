/* =========================================================
   LOOPS PRACTICE — BASIC (NO NESTED LOOPS)
   Topics:
   - for loops
   - while loops
   - for...of loops
   - for...in loops
   =========================================================
   NOTE ABOUT .push():
   - Use .push(value) to add a value to the END of an array.
========================================================= */


/* =========================
   SECTION 1: FILL IN THE BLANK (WARM-UP)
   ========================= */

// 1) for loop counting up (Goal: 1, 2, 3, 4, 5)
for (let i = ___; i <= ___; i___) {
  console.log(i);
}

// 2) for loop counting down (Goal: 5, 4, 3, 2, 1)
for (let i = ___; i >= ___; i___) {
  console.log(i);
}

// 3) while loop counting up (Goal: 0, 1, 2)
let w = ___;
while (w < ___) {
  console.log(w);
  w___;
}

// 4) do...while runs at least once (Goal: logs "Hello" once)
let runOnce = false;
do {
  console.log("Hello");
} while (_____);

// 5) for...of loop (Goal: logs each fruit)
let fruits = ["apple", "banana", "mango"];
for (let fruit ___ fruits) {
  console.log(fruit);
}

// 6) for...in loop (Goal: logs each key)
let user = { name: "Calvin", age: 33, email: "x@y.com" };
for (let key ___ user) {
  console.log(key);
}



/* =========================
   SECTION 2: BASIC FOR LOOPS
   ========================= */

// 7) Use a for loop to log numbers from 0 to 6


// 8) Use a for loop to log only even numbers from 2 to 10
// (Hint: increase by 2)


// 9) Use a for loop to log the numbers 10 to 1 (count down)


// 10) Given the array, use a for loop to log each item
let pets = ["dog", "cat", "fish"];




/* =========================
   SECTION 3: BASIC WHILE LOOPS
   ========================= */

// 11) Use a while loop to log numbers from 3 to 7


// 12) Use a while loop to log numbers from 12 down to 8


// 13) Given the array, use a while loop to log each item
let colors = ["red", "blue", "green", "yellow"];




/* =========================
   SECTION 4: LOOPING ARRAYS + TOTALS
   ========================= */

// 14) Sum the numbers in the array using a for loop
let values = [10, 30, 50, 100];
// Create sum = 0, add each element, log sum at the end


// 15) Sum the numbers in the array using a for...of loop
let cart = [19.99, 9.99, 4.99];
// Create total = 0, add each number, log total


// 16) Count how many strings are in this array using typeof + for loop
let mixed = ["hi", 12, true, "bye", 99, "ok"];



/* =========================
   SECTION 5: BUILDING NEW ARRAYS (USING .push)
   ========================= */

// 17) Build a new array called bigNums with numbers >= 10
let nums = [3, 10, 25, 1, 9, 12];
let bigNums = [];
// Use a loop and bigNums.push(...)


// 18) Build a new array called longWords with words length >= 5
let words = ["cat", "tiger", "lion", "elephant", "dog"];
let longWords = [];
// Use a loop and longWords.push(...)



/* =========================
   SECTION 6: REVERSE LOOPING
   ========================= */

// 19) Use a for loop to log the array backwards
let letters = ["a", "b", "c", "d"];


// 20) Use a while loop to log the array backwards
let numbers2 = [5, 10, 15, 20];



/* =========================
   SECTION 7: for...in (OBJECTS)
   ========================= */

// 21) Use for...in to log the VALUES of this object
let movie = {
  title: "LOTR",
  year: 2001,
  rating: "PG-13"
};


// 22) Use for...in to log: "key: value"
let settings = {
  theme: "dark",
  language: "en",
  notifications: "on"
};



/* =========================
   SECTION 8: MINI PROJECT (SINGLE LOOP)
   =========================
   Given test scores:
   - Create passingScores (>= 70)
   - Create failingScores (< 70)
   Use ONE loop and .push()
*/
let scores = [95, 60, 72, 88, 45, 70];
let passingScores = [];
let failingScores = [];
