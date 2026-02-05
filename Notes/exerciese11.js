/* =========================================================
   EXERCISES — setTimeout / setInterval (BEGINNER)
   =========================================================
   RULES:
   - Use console.log to observe execution order
   - Use clearInterval to stop intervals
   - Keep timers simple (no async/await required here)
========================================================= */


/* =========================
   SECTION 1: FILL IN THE BLANK (WARM-UP)
   ========================= */

// 1) Use setTimeout to log "Hello after 1 second"
setTimeout(() => {
  console.log("________________________");
}, ________);


// 2) Use setInterval to log "Ping" every 500ms
let pingId = setInterval(() => {
  console.log("________");
}, ________);


// 3) Stop the interval above after 2 seconds
setTimeout(() => {
  __________________(pingId);
}, ________);



/* =========================
   SECTION 2: ORDER OF OUTPUT (PREDICT)
   ========================= */

// 4) Predict what logs first, second, and last.
// Write your prediction as comments above the code.

console.log("A");

setTimeout(() => {
  console.log("B");
}, 0);

console.log("C");



// 5) Predict the output order.
// (Hint: time delays matter)

console.log("Start");

setTimeout(() => {
  console.log("Later 1");
}, 1000);

setTimeout(() => {
  console.log("Later 2");
}, 500);

console.log("End");



/* =========================
   SECTION 3: SIMPLE COUNTERS WITH setInterval
   ========================= */

// 6) Create a counter that logs:
// "Count: 1", "Count: 2", "Count: 3"
// every 1 second, then stops.


// 7) Create a countdown that logs:
// "3", "2", "1"
// every 1 second, then stops.



/* =========================
   SECTION 4: STOPPING INTERVALS (VARIETY)
   ========================= */

// 8) Log "Reminder!" every 2 seconds.
// Stop it after it runs 3 times.
// (Hint: use a counter variable)


// 9) Log "Working..." every 300ms.
// Stop it after 1.5 seconds.



/* =========================
   SECTION 5: MINI CHALLENGE (BASIC)
   =========================
   Create a simple "loading simulation":

   Requirements:
   - Immediately log: "Loading..."
   - After 2 seconds, log: "Done!"
   - Also log: "Still running" immediately after setTimeout
*/
