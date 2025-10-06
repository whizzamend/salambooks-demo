// ================================
// Redirect if already logged in
// ================================
window.addEventListener("DOMContentLoaded", async () => {
  const { data, error } = await supabase.auth.getSession();

  if (error) {
    console.error("Session check error:", error.message);
    return;
  }

  if (data.session) {
    // Already logged in → redirect to profile
    window.location.href = "../../page/user/profile.html";
  }
});

// ================================
// Sign Up
// ================================
async function signUp() {
  const email = document.getElementById("signup-email").value.trim();
  const password = document.getElementById("signup-password").value.trim();
  const username = document.getElementById("signup-username").value.trim();
  const message = document.getElementById("message");

  if (!email || !password || !username) {
    message.textContent = "Please enter email, username and password.";
    message.style.display = "flex";
    message.style.backgroundColor = "var(--danger-color)";
    return;
  }

  // ✅ Sign up and include username in user_metadata
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { username }, // <-- this stores username in auth.users.user_metadata
    },
  });

  if (error) {
    console.error("Sign up failed:", error.message);
    message.style.display = "flex";
    message.style.backgroundColor = "var(--danger-color)";
    message.textContent = error.message;
    return;
  }

  message.style.display = "flex";
  message.style.backgroundColor = "var(--success-color)";
  message.textContent = "Sign up successful! Check your email to confirm.";

  console.log("Sign up successful:", data);
}

// ================================
// Sign In
// ================================
async function signIn() {
  const email = document.getElementById("signin-email").value.trim();
  const password = document.getElementById("signin-password").value.trim();
  const message = document.getElementById("message");

  if (!email || !password) {
    message.textContent = "Please enter your email and password.";
    message.style.display = "flex";
    message.style.backgroundColor = "var(--danger-color)";
    return;
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.error("Sign in failed:", error.message);
    message.style.display = "flex";
    message.style.backgroundColor = "var(--danger-color)";
    message.textContent = "Invalid email or password.";
    return;
  }

  // Show the username if available
  message.style.display = "flex";
  message.style.backgroundColor = "var(--success-color)";
  message.textContent = `Welcome back, ${
    data.user.user_metadata?.username || data.user.email
  }!`;

  // Redirect after a short delay
  setTimeout(() => {
    window.location.href = "../../page/user/profile.html";
  }, 1000);
}

// ================================
// Create a user row in your own table AFTER login
// ================================
supabase.auth.onAuthStateChange(async (event, session) => {
  if (event === "SIGNED_IN" && session?.user) {
    const { id, email, user_metadata } = session.user;

    // Check if user already exists
    const { data: existing, error: checkError } = await supabase
      .from("users")
      .select("id")
      .eq("id", id)
      .maybeSingle();

    if (checkError) {
      console.error("Check user error:", checkError.message);
      return;
    }

    if (!existing) {
      const { error: insertError } = await supabase.from("users").insert({
        id: id,
        email: email,
        username: user_metadata?.username || "New User",
      });

      if (insertError) {
        console.error("Error inserting user data:", insertError.message);
      } else {
        console.log("Profile row created successfully.");
      }
    }
  }
});
