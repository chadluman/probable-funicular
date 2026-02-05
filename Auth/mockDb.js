export function getUsers() {
  return JSON.parse(localStorage.getItem("app_users")) || [];
}

export function saveUsers(users) {
  localStorage.setItem("app_users", JSON.stringify(users));
}

export function addUser(user) {
  const users = getUsers();
  users.push(user);
  saveUsers(users);
}

export function getCurrentUser() {
  return JSON.parse(localStorage.getItem("current_user"));
}

export function setCurrentUser(user) {
  localStorage.setItem("current_user", JSON.stringify(user));
}

export function clearCurrentUser() {
  localStorage.removeItem("current_user");
}