/* =========================================================
   COMPARISON & TERNARY PRACTICE
   ========================================================= */


/* =========================
   PART 1: COMPARISON OPERATORS
   ========================= */

// 1) Predict the result, then test with console.log
// a) 12 > 9
// b) 5 >= 5
// c) 7 < 3
// d) 10 === 10
// e) 10 !== 8


// 2) Predict the result, then test with console.log
// a) "5" == 5
// b) "5" === 5
// c) "cat" !== "dog"


// 3) String comparisons (lexicographic order)
// Predict the result, then test
// a) "b" > "a"
// b) "A" < "a"
// c) "Z" > "z"



/* =========================
   PART 2: instanceof
   ========================= */

let nums = [1, 2, 3];
let name = "Alex";
let data = { id: 1 };

// 4) Use instanceof to check if nums is an Array
// Log the result


// 5) Use instanceof to check if data is an Array
// Log the result



/* =========================
   PART 3: delete OPERATOR
   ========================= */

let user = {
  username: "sam123",
  email: "sam@email.com",
  age: 22
};

// 6) Delete the age property from user


// 7) Log user.age after deletion



/* =========================
   PART 4: TERNARY OPERATOR (BASIC)
   ========================= */

let score = 85;

// 8) Use a ternary operator:
// If score is 60 or higher → "Pass"
// Otherwise → "Fail"
// Save it to a variable and log it



let temperature = 72;

// 9) Use a ternary operator:
// If temperature is greater than 75 → "Hot"
// Otherwise → "Cool"
// Log the result



/* =========================
   PART 5: TERNARY WITH STRINGS
   ========================= */

let usernameInput = "";

// 10) Use a ternary operator:
// If usernameInput has a value → use it
// Otherwise → use "Guest"
// Save to displayName and log it



/* =========================
   PART 6: THINKING QUESTIONS
   ========================= */

// 11) Why does "10" == 10 return true, but "10" === 10 return false?


// 12) When should you prefer === over ==?





/* =========================================================
   MINI CHALLENGES — TERNARY ONLY (BEGINNER)
   =========================================================
   RULES:
   - Use ONLY comparison operators and ONE ternary per statement
   - No if / else
   - No nested ternary operators
   - Use console.log() for output
*/


/* =========================
   CHALLENGE 1: MINI LOGIN
   =========================
   Requirements:
   - If username AND password match → "Login successful"
   - Otherwise → "Login failed"
*/

let correctUsername = "mmaldo017";
let correctPassword = "123Felix";

let userUsername = "mmaldo017";
let userPassword = "123Felix";

// Write a ternary expression and store the result in loginMessage
// Then log loginMessage



/* =========================
   CHALLENGE 2: SIMPLE GRADING
   =========================
   Requirements:
   - If grade is 60 or higher → "Pass"
   - Otherwise → "Fail"
*/

let grade = 77;

// Write a ternary expression and store the result in result
// Then log result
