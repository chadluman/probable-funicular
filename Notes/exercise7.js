/* =========================================================
   EXERCISES — break/continue, nested loops, array methods
   RULES:
   - Use console.log() to test
   ========================================================= */


/* =========================
   SECTION 1: break (STOP EARLY)
   ========================= */

// 1) Use a for loop to log numbers 0 to 9.
//    Stop the loop when the number is 6 using break.



// 2) Given the array below, loop through it and stop when you reach "STOP".
//    Log each item BEFORE you stop.
let commands = ["RUN", "JUMP", "STOP", "WAIT", "END"];




// 3) Given the array below, search for "Bob".
//    Loop through and when you find "Bob", log "Found Bob!" then break.
let people = ["Alice", "Sam", "Bob", "Jordan", "Taylor"];



/* =========================
   SECTION 2: continue (SKIP ITEMS)
   ========================= */

// 4) Use a for loop to log numbers 1 to 10.
//    Skip logging 4 and 7 using continue.



// 5) Given the array below, log every item except "spam".
let foods = ["eggs", "spam", "bacon", "spam", "toast"];




// 6) Given the array below, log only numbers that are >= 50.
//    Use continue to skip numbers less than 50.
let scores = [100, 45, 67, 20, 88, 49, 50];



/* =========================
   SECTION 3: NESTED LOOPS (BASIC)
   ========================= */

// 7) Create a nested loop that logs coordinate pairs (i, j)
//    i should go from 1 to 2
//    j should go from 1 to 3
//    Example output: 1 1, 1 2, 1 3, 2 1, 2 2, 2 3




// 8) Given the students array below, use nested loops to log:
//    "<student name> -> <grade>"
const students = [
  { name: "Ava", grades: [91, 72, 88] },
  { name: "Noah", grades: [60, 85, 79] },
  { name: "Mia", grades: [100, 94, 97] }
];




// 9) Using the same students array,
//    log ONLY the grades that are 80 or higher.
//    Use continue to skip grades below 80.




/* =========================
   SECTION 4: ARRAY METHODS (NO ADVANCED METHODS)
   ========================= */

// 10) concat
// Create two arrays and combine them using concat.
// Log the combined array.
let group1 = ["A", "B"];
let group2 = ["C", "D"];




// 11) slice
// Using slice, create a new array that contains the middle 3 items.
// Log the new array.
let letters = ["a", "b", "c", "d", "e"];




// 12) splice
// Remove 2 items starting at index 1.
// Log the updated array.
let colors = ["red", "blue", "green", "yellow"];




// 13) indexOf
// Log the index of "banana".
let fruits = ["apple", "banana", "cherry", "banana"];




// 14) push / pop
// Add "Done" to the end, then remove the last item.
// Log the array after each step.
let steps = ["Start", "Middle"];




// 15) unshift / shift
// Add "FIRST" to the start, then remove the first item.
// Log the array after each step.
let line = ["second", "third"];
