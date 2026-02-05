async function saveSecurityQuestions() {
  const token = localStorage.getItem("authToken");
  if (!token) {
    window.location.href = "../Auth/login.html";
    return;
  }

  const password = document.getElementById("sqConfirmPassword").value;
  const q1 = document.getElementById("sq1").value;
  const a1 = document.getElementById("sa1").value;
  const q2 = document.getElementById("sq2").value;
  const a2 = document.getElementById("sa2").value;

  const msgEl = document.getElementById("sqMsg");
  msgEl.textContent = "";

  if (!password) { msgEl.textContent = "Password required to save."; return; }
  if (!a1 || !a2) { msgEl.textContent = "Both answers are required."; return; }
  if (q1 === q2) { msgEl.textContent = "Pick two different questions."; return; }

  try {
    const res = await fetch("/api/user/security-questions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({
        password,
        questions: [
          { questionId: q1, answer: a1 },
          { questionId: q2, answer: a2 }
        ]
      })
    });

    msgEl.textContent = res.ok
      ? "Security questions saved."
      : "Failed to save. Check your password.";

    if (res.ok) {
      document.getElementById("sa1").value = "";
      document.getElementById("sa2").value = "";
      document.getElementById("sqConfirmPassword").value = "";
    }
  } catch {
    msgEl.textContent = "Network error saving security questions.";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("saveSQ");
  if (btn) btn.addEventListener("click", saveSecurityQuestions);
});
