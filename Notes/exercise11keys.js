/* =========================================================
   ANSWER KEY — setTimeout / setInterval (BEGINNER)
   ========================================================= */


/* =========================
   SECTION 1: FILL IN THE BLANK
   ========================= */

// 1
setTimeout(() => {
  console.log("Hello after 1 second");
}, 1000);

// 2
let pingId = setInterval(() => {
  console.log("Ping");
}, 500);

// 3
setTimeout(() => {
  clearInterval(pingId);
}, 2000);



/* =========================
   SECTION 2: ORDER OF OUTPUT
   ========================= */

// 4
// Order: A, C, B
console.log("A");
setTimeout(() => {
  console.log("B");
}, 0);
console.log("C");


// 5
// Order: Start, End, Later 2, Later 1
console.log("Start");

setTimeout(() => {
  console.log("Later 1");
}, 1000);

setTimeout(() => {
  console.log("Later 2");
}, 500);

console.log("End");



/* =========================
   SECTION 3: SIMPLE COUNTERS
   ========================= */

// 6
let count = 0;
let id1 = setInterval(() => {
  count++;
  console.log("Count:", count);
  if (count >= 3) {
    clearInterval(id1);
  }
}, 1000);

// 7
let countdown = 3;
let id2 = setInterval(() => {
  console.log(countdown);
  countdown--;
  if (countdown === 0) {
    clearInterval(id2);
  }
}, 1000);



/* =========================
   SECTION 4: STOPPING INTERVALS
   ========================= */

// 8
let reminderCount = 0;
let reminderId = setInterval(() => {
  reminderCount++;
  console.log("Reminder!");
  if (reminderCount >= 3) {
    clearInterval(reminderId);
  }
}, 2000);

// 9
let workId = setInterval(() => {
  console.log("Working...");
}, 300);

setTimeout(() => {
  clearInterval(workId);
}, 1500);



/* =========================
   SECTION 5: MINI CHALLENGE
   ========================= */

console.log("Loading...");

setTimeout(() => {
  console.log("Done!");
}, 2000);

console.log("Still running");
