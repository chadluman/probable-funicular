/* =========================================================
   FUNCTION STATEMENTS — PRACTICE (BEGINNER)
   =========================================================
   RULES:
   - Use ONLY function statements
   - Follow the comments carefully
   - From #9 onward, FILL IN THE BLANKS ONLY
   ========================================================= */


/* =========================
   SECTION 1: WARM-UP
   ========================= */

// 1) Write a function named multiply that returns a * b.
//    Call it with (3, 4).


// 2) Write a function named sayHello that logs "Hello!".
//    Call it.


// 3) Write a function named makeFullName that returns
//    "first last" using the given parameters.


// 4) Write a function named isAdult that returns true
//    if age is 18 or older.


// 5) Write a function named getLast that returns
//    the last item of an array.



/* =========================
   SECTION 2: STRINGS & NUMBERS
   ========================= */

// 6) Write a function named shout that returns the
//    word in uppercase.


// 7) Write a function named addTax that returns
//    price * 1.10.


// 8) Write a function named between that returns true
//    if num is between min and max (inclusive).



/* =========================
   SECTION 3: ARRAYS + LOOPS
   ========================= */

// 9) COMPLETE THE FUNCTION
//    This function should return the sum of all numbers in the array.

function sumArray(arr) {
  let sum = ____;               // start sum at 0

  for (let i = ____; i < ____; i++) {
    sum = sum + ____;           // add each number to sum
  }

  return ____;                  // return the final sum
}

// Test with: [10, 20, 30]



// 10) COMPLETE THE FUNCTION
//     This function should count how many strings are in the array.

function countStrings(arr) {
  let count = ____;             // start count at 0

  for (let i = ____; i < ____; i++) {
    if (____ === "string") {
      count++;
    }
  }

  return ____;
}

// Test with: ["hi", 2, "bye", true, "ok"]



// 11) COMPLETE THE FUNCTION
//     This function should return the largest number in the array.

function findMax(arr) {
  let max = ____;               // start with first element

  for (let i = ____; i < ____; i++) {
    if (____ > max) {
      max = ____;
    }
  }

  return ____;
}

// Test with: [7, 2, 19, 4, 10]



// 12) COMPLETE THE FUNCTION
//     This function should console.log the array
//     from LAST element to FIRST element.

function reversePrint(arr) {
  for (let i = ____; i >= ____; i--) {
    console.log(____);
  }
}

// Test with: ["a", "b", "c", "d"]



/* =========================
   SECTION 4: OBJECTS
   ========================= */

// 13) COMPLETE THE FUNCTION
//     This function should return the email from the user object.

function getEmail(user) {
  return ____;
}

// Test with: { name: "Alex", email: "a@a.com" }



// 14) COMPLETE THE FUNCTION
//     This function should return true if the key exists on the object.

function hasKey(obj, keyName) {
  return ____ !== ____;
}

// Test with:
// hasKey({ a: 1 }, "a")
// hasKey({ a: 1 }, "b")



/* =========================
   SECTION 5: MINI CHALLENGES
   ========================= */

// 15) COMPLETE THE FUNCTION
//     This function should return the average of the numbers.

function average(arr) {
  let sum = ____;

  for (let i = ____; i < ____; i++) {
    sum += ____;
  }

  return ____ / ____;
}

// Test with: [2, 4, 6, 8]



// 16) COMPLETE THE FUNCTION
//     This function should return a NEW array
//     containing only truthy values.
//     You MUST use .push()

function removeFalsy(arr) {
  let result = ____;

  for (let i = ____; i < ____; i++) {
    if (____) {
      result.push(____);
    }
  }

  return ____;
}

// Test with: [0, "hi", "", 10, null, "ok"]
