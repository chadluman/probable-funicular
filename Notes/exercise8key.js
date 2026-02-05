/* =========================================================
   ANSWER KEY — FUNCTION STATEMENTS
   ========================================================= */


/* =========================
   SECTION 1
   ========================= */

function multiply(a, b) {
  return a * b;
}
console.log(multiply(3, 4));

function sayHello() {
  console.log("Hello!");
}
sayHello();

function makeFullName(first, last) {
  return first + " " + last;
}
console.log(makeFullName("Martin", "Maldonado"));

function isAdult(age) {
  return age >= 18;
}
console.log(isAdult(16));
console.log(isAdult(21));

function getLast(arr) {
  return arr[arr.length - 1];
}
console.log(getLast(["a", "b", "c"]));



/* =========================
   SECTION 2
   ========================= */

function shout(word) {
  return word.toUpperCase();
}
console.log(shout("hello"));

function addTax(price) {
  return price * 1.10;
}
console.log(addTax(10));

function between(num, min, max) {
  return num >= min && num <= max;
}
console.log(between(5, 1, 10));



/* =========================
   SECTION 3
   ========================= */

function sumArray(arr) {
  let sum = 0;

  for (let i = 0; i < arr.length; i++) {
    sum = sum + arr[i];
  }

  return sum;
}
console.log(sumArray([10, 20, 30]));

function countStrings(arr) {
  let count = 0;

  for (let i = 0; i < arr.length; i++) {
    if (typeof arr[i] === "string") {
      count++;
    }
  }

  return count;
}
console.log(countStrings(["hi", 2, "bye", true, "ok"]));

function findMax(arr) {
  let max = arr[0];

  for (let i = 1; i < arr.length; i++) {
    if (arr[i] > max) {
      max = arr[i];
    }
  }

  return max;
}
console.log(findMax([7, 2, 19, 4, 10]));

function reversePrint(arr) {
  for (let i = arr.length - 1; i >= 0; i--) {
    console.log(arr[i]);
  }
}
reversePrint(["a", "b", "c", "d"]);



/* =========================
   SECTION 4
   ========================= */

function getEmail(user) {
  return user.email;
}
console.log(getEmail({ name: "Alex", email: "a@a.com" }));

function hasKey(obj, keyName) {
  return obj[keyName] !== undefined;
}
console.log(hasKey({ a: 1 }, "a"));
console.log(hasKey({ a: 1 }, "b"));



/* =========================
   SECTION 5
   ========================= */

function average(arr) {
  let sum = 0;

  for (let i = 0; i < arr.length; i++) {
    sum += arr[i];
  }

  return sum / arr.length;
}
console.log(average([2, 4, 6, 8]));

function removeFalsy(arr) {
  let result = [];

  for (let i = 0; i < arr.length; i++) {
    if (arr[i]) {
      result.push(arr[i]);
    }
  }

  return result;
}
console.log(removeFalsy([0, "hi", "", 10, null, "ok"]));
