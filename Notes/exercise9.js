/* =========================================================
   EXERCISES — Arrow Functions, Hoisting, Callbacks (BEGINNER)
   =========================================================
   RULES:
   - Use arrow functions when asked
   - Remember: arrow functions are NOT hoisted
   - Callbacks must be functions (not booleans / strings)
   - If starter code has blanks, fill ONLY the blanks
========================================================= */


/* =========================
   SECTION 1: ARROW FUNCTION BASICS
   ========================= */

// 1) Write an arrow function called triple that returns a number * 3.
//    Test it with 4.


// 2) Write an arrow function called fullName that takes (first, last)
//    and returns "first last" (use a template literal).
//    Test it with ("Alex", "Johnson").


// 3) Write an arrow function called isOdd that returns true if a number is odd.
//    Test it with 5 and 8.



/* =========================
   SECTION 2: ARROW FUNCTIONS (BLOCK BODY)
   ========================= */

// 4) Write an arrow function called calcTotal that takes (price, qty)
//    and returns price * qty.
//    Use a block body { } and an explicit return.
//    Test it with (9.99, 3).


// 5) Starter code (fill in blanks):
//    Finish this arrow function so it returns the LAST letter of the string.

const lastLetter = (word) => {
  // return the last character in word
  return word[__________ - 1];
};

// Test: console.log(lastLetter("hello")) should be "o"



/* =========================
   SECTION 3: HOISTING (PREDICT + FIX)
   ========================= */

// 6) Predict: Will this work or throw an error?
//    Then FIX it so it works without changing the function into a statement.

console.log(double(5));

const double = (n) => n * 2;

// Fix it below (write the corrected code version)


// 7) Predict: What happens here? (works or error?)
sayHi();

const sayHi = () => console.log("Hi");

// Fix it below so it works (still keep it an arrow function)



/* =========================
   SECTION 4: CALLBACKS (BASIC)
   ========================= */

// 8) Starter code (fill in blanks):
//    Make doTwice call the callback two times.

function doTwice(cb) {
  __________;
  __________;
}

// Create a callback named shoutHi that logs "HI!"
// Then pass shoutHi into doTwice



// 9) Write a function named runWithMessage that takes:
//    - message (string)
//    - cb (function)
//    It should call cb(message)


// Create a callback that logs: "Message: <message>"
// Call runWithMessage with "Welcome" and your callback



/* =========================
   SECTION 5: CALLBACK + LOOP (STARTER CODE)
   ========================= */

// 10) Fill in the blanks:
//     loopThrough should call cb on every item in arr

function loopThrough(arr, cb) {
  for (let i = 0; i < __________; i++) {
    cb(__________);
  }
}

let nums = [2, 4, 6];

// Create a callback that logs each number doubled
// Pass nums and your callback into loopThrough



/* =========================
   SECTION 6: MINI PROJECT (NO STARTER CODE)
   =========================
   Build a "Simple Timer Helper"

   Requirements:
   - Create a function named repeatMessage
   - It takes 3 parameters:
       message (string)
       times (number)
       cb (function)

   Behavior:
   - Use a loop to run cb(message) exactly "times" times
   - Test it by calling repeatMessage("Drink Water", 3, callback)

   Notes:
   - Your callback should console.log the message.
   - No setTimeout needed (keep it synchronous).
*/
