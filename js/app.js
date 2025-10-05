// console.log("JS initialized successfully");

const authBtns = document.getElementById("auth-btns");
const userBtn = document.getElementById("user-btn");

// Check if user is logged in
if (localStorage.getItem("isLoggedIn") === "true") {
  authBtns.style.display = "none";
  userBtn.style.display = "block";
}
