// 1) Declare a variable called city and assign it the string "Chicago".
// Log the variable to the console.
let city = "Chicago";
console.log(city);

// 2) Create a boolean variable named isLoggedIn and set it to false.
// Log the type of this variable.
let isLoggedIn = false;
console.log(typeof isLoggedIn); // "boolean"

// 3) Create a variable bigNum with the value 12345678901234567890n
// and log its type to the console.
let bigNum = 12345678901234567890n;
console.log(typeof bigNum); // "bigint"

// 4) Convert the string "42" into a number using Number().
// Log the type and value.
let n1 = Number("42");
console.log(typeof n1, n1); // "number", 42

// 5) Convert the string "Hello" into a number using Number().
// What gets logged?
let n2 = Number("Hello");
console.log(n2); // NaN (Not a Number)

// 6) Test the following with Boolean():
// Boolean(0), Boolean("text"), Boolean(undefined), Boolean(null)
// Log each result.
console.log(Boolean(0));         // false
console.log(Boolean("text"));    // true
console.log(Boolean(undefined)); // false
console.log(Boolean(null));      // false

// 7) Create an object called student with keys: name, age, email.
// Give it any values you like and log the entire object.
let student = {
  name: "Avery",
  age: 20,
  email: "avery@example.com"
};
console.log(student);

// 8) Add a new property grade to the student object.
// Then log just the grade.
student.grade = "A";
console.log(student.grade);

// 9) Access and log the value of the name property using dot notation
// and the age property using bracket notation.
console.log(student.name);
console.log(student["age"]);

// 10) Create a nested object inside student called address
// with keys: city and zip. Log just the city.
student.address = {
  city: "Chicago",
  zip: "60601"
};
console.log(student.address.city);

// 11) Declare an array fruits with elements "apple", "banana", "pear".
// Log the first element.
let fruits = ["apple", "banana", "pear"];
console.log(fruits[0]); // "apple"

// 12) Change the second element of the fruits array to "strawberry".
// Log the entire array.
fruits[1] = "strawberry";
console.log(fruits);

// 13) Create an array numbers with elements [1, 2, 3, 4].
// Log the length of the array.
let numbers = [1, 2, 3, 4];
console.log(numbers.length); // 4

// 14) Add a nested array [10, 20, 30] as the last element of numbers.
// Log the first element of the nested array.
numbers.push([10, 20, 30]);
console.log(numbers[numbers.length - 1][0]); // 10

// 15) Check if numbers is an array using instanceof.
// Log the result.
console.log(numbers instanceof Array); // true
