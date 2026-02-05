console.log(12 > 9);     // true
console.log(5 >= 5);    // true
console.log(7 < 3);     // false
console.log(10 === 10); // true
console.log(10 !== 8);  // true

console.log("5" == 5);      // true
console.log("5" === 5);     // false
console.log("cat" !== "dog"); // true

console.log("b" > "a"); // true
console.log("A" < "a"); // true
console.log("Z" > "z"); // false

console.log(nums instanceof Array); // true
console.log(data instanceof Array); // false

delete user.age;
console.log(user.age); // undefined

let passFail = score >= 60 ? "Pass" : "Fail";
console.log(passFail);

console.log(temperature > 75 ? "Hot" : "Cool");

let displayName = usernameInput ? usernameInput : "Guest";
console.log(displayName);

"10" == 10   // JS converts "10" → 10
"10" === 10  // string !== number → false

/* when should you use == vs === ?
    Always prefer === unless you specifically want type coercion.
*/

let loginMessage =
  userUsername === correctUsername && userPassword === correctPassword
    ? "Login successful"
    : "Login failed";

console.log(loginMessage);

let result = grade >= 60 ? "Pass" : "Fail";
console.log(result);

