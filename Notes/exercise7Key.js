/* =========================================================
   ANSWER KEY — break/continue, nested loops, array methods
   (NO functions)
   ========================================================= */


/* =========================
   SECTION 1: break (STOP EARLY)
   ========================= */

// 1
for (let i = 0; i < 10; i++) {
  if (i === 6) break;
  console.log(i);
}

// 2
let commands = ["RUN", "JUMP", "STOP", "WAIT", "END"];
for (let i = 0; i < commands.length; i++) {
  if (commands[i] === "STOP") break;
  console.log(commands[i]);
}

// 3
let people = ["Alice", "Sam", "Bob", "Jordan", "Taylor"];
for (let i = 0; i < people.length; i++) {
  if (people[i] === "Bob") {
    console.log("Found Bob!");
    break;
  }
}



/* =========================
   SECTION 2: continue (SKIP ITEMS)
   ========================= */

// 4
for (let i = 1; i <= 10; i++) {
  if (i === 4 || i === 7) continue;
  console.log(i);
}

// 5
let foods = ["eggs", "spam", "bacon", "spam", "toast"];
for (let i = 0; i < foods.length; i++) {
  if (foods[i] === "spam") continue;
  console.log(foods[i]);
}

// 6
let scores = [100, 45, 67, 20, 88, 49, 50];
for (let i = 0; i < scores.length; i++) {
  if (scores[i] < 50) continue;
  console.log(scores[i]);
}



/* =========================
   SECTION 3: NESTED LOOPS (BASIC)
   ========================= */

// 7
for (let i = 1; i <= 2; i++) {
  for (let j = 1; j <= 3; j++) {
    console.log(i, j);
  }
}

// 8
const students = [
  { name: "Ava", grades: [91, 72, 88] },
  { name: "Noah", grades: [60, 85, 79] },
  { name: "Mia", grades: [100, 94, 97] }
];

for (let student of students) {
  for (let g of student.grades) {
    console.log(student.name, "->", g);
  }
}

// 9
for (let student of students) {
  for (let g of student.grades) {
    if (g < 80) continue;
    console.log(student.name, "->", g);
  }
}



/* =========================
   SECTION 4: ARRAY METHODS
   ========================= */

// 10
let group1 = ["A", "B"];
let group2 = ["C", "D"];
let combined = group1.concat(group2);
console.log(combined);

// 11
let letters = ["a", "b", "c", "d", "e"];
let middleThree = letters.slice(1, 4);
console.log(middleThree);

// 12
let colors = ["red", "blue", "green", "yellow"];
colors.splice(1, 2);
console.log(colors);

// 13
let fruits = ["apple", "banana", "cherry", "banana"];
console.log(fruits.indexOf("banana"));

// 14
let steps = ["Start", "Middle"];
steps.push("Done");
console.log(steps);
steps.pop();
console.log(steps);

// 15
let line = ["second", "third"];
line.unshift("FIRST");
console.log(line);
line.shift();
console.log(line);
