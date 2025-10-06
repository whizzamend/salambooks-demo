const emailSpan = document.getElementById("profile-email");
const idSpan = document.getElementById("profile-id");
const createdAtSpan = document.getElementById("profile-member-since");
const usernameSpan = document.getElementById("profile-username");

document.addEventListener("DOMContentLoaded", async () => {
  const { data } = await supabase.auth.getSession();

  if (data.session) {
    const user = data.session.user;

    const createdDate = new Date(user.created_at);
    const options = { year: "numeric", month: "long", day: "numeric" };
    const memberSince = createdDate.toLocaleDateString(undefined, options);

    emailSpan.textContent = user.email;
    idSpan.textContent = user.id;
    createdAtSpan.textContent = memberSince;
    usernameSpan.textContent = user.user_metadata.username || "N/A";
  } else {
    window.location.href = "../../page/auth/sign-in.html";
  }
});

async function signOut() {
  await supabase.auth.signOut();
  window.location.href = "../../page/auth/sign-in.html";
}
