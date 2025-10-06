const spinner = document.getElementById("user-spinner");
const authBtns = document.getElementById("auth-btns");
const userBtn = document.getElementById("user-btn");
const welcomeMessage = document.getElementById("welcome-message");

async function checkAuthStatus() {
  // Show spinner while checking
  spinner.style.display = "inline-block";
  authBtns.style.display = "none";
  userBtn.style.display = "none";

  // Get current session
  const { data: sessionData, error } = await supabase.auth.getSession();

  // Hide spinner after check
  spinner.style.display = "none";

  if (error) {
    console.error("Error checking session:", error.message);
    authBtns.style.display = "flex"; // fallback to show auth buttons
    return;
  }

  const session = sessionData.session;

  if (session) {
    // ✅ User is logged in
    userBtn.style.display = "flex";

    // Fetch username from your custom users table
    const { data: profile, error: profileError } = await supabase
      .from("users")
      .select("username")
      .eq("id", session.user.id)
      .single();

    if (profileError) {
      console.warn("Could not fetch username:", profileError.message);
      welcomeMessage.textContent = "Welcome back!";
    } else {
      welcomeMessage.textContent = `Welcome back, ${profile.username}!`;
    }
  } else {
    // ❌ Not logged in
    authBtns.style.display = "flex";
    welcomeMessage.textContent = "Welcome to Salam Books!";
  }
}

window.addEventListener("DOMContentLoaded", checkAuthStatus);
