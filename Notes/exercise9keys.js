/* =========================================================
   ANSWER KEY — Arrow Functions, Hoisting, Callbacks (BEGINNER)
   ========================================================= */


/* =========================
   SECTION 1: ARROW FUNCTION BASICS
   ========================= */

// 1
const triple = n => n * 3;
console.log(triple(4));

// 2
const fullName = (first, last) => `${first} ${last}`;
console.log(fullName("Alex", "Johnson"));

// 3
const isOdd = n => n % 2 !== 0;
console.log(isOdd(5));
console.log(isOdd(8));



/* =========================
   SECTION 2: ARROW FUNCTIONS (BLOCK BODY)
   ========================= */

// 4
const calcTotal = (price, qty) => {
  return price * qty;
};
console.log(calcTotal(9.99, 3));

// 5
const lastLetter = (word) => {
  return word[word.length - 1];
};
console.log(lastLetter("hello")); // "o"



/* =========================
   SECTION 3: HOISTING (FIXED)
   ========================= */

// 6) Fix: move the call BELOW the arrow function
const double = (n) => n * 2;
console.log(double(5));

// 7) Fix: move the call BELOW the arrow function
const sayHi = () => console.log("Hi");
sayHi();



/* =========================
   SECTION 4: CALLBACKS
   ========================= */

// 8
function doTwice(cb) {
  cb();
  cb();
}

const shoutHi = () => console.log("HI!");
doTwice(shoutHi);

// 9
function runWithMessage(message, cb) {
  cb(message);
}

const logMessage = msg => console.log("Message: " + msg);
runWithMessage("Welcome", logMessage);



/* =========================
   SECTION 5: CALLBACK + LOOP
   ========================= */

// 10
function loopThrough(arr, cb) {
  for (let i = 0; i < arr.length; i++) {
    cb(arr[i]);
  }
}

let nums = [2, 4, 6];

const logDoubled = n => console.log(n * 2);
loopThrough(nums, logDoubled);



/* =========================
   SECTION 6: MINI PROJECT
   ========================= */

function repeatMessage(message, times, cb) {
  for (let i = 0; i < times; i++) {
    cb(message);
  }
}

const printMsg = msg => console.log(msg);

repeatMessage("Drink Water", 3, printMsg);
