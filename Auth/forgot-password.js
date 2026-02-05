const Q_TEXT = {
  pet: "What was the name of your first pet?",
  street: "What street did you grow up on?",
  school: "What was your first school?",
  car: "What was your first car make/model?",
};

let resetToken = null;
let questionIds = [];

function setMsg(t) {
  document.getElementById("msg").textContent = t;
}

function renderQuestions(ids) {
  const wrap = document.getElementById("questions");
  wrap.innerHTML = ids
    .map((id, i) => `
      <label>
        <div class="muted">${Q_TEXT[id] || "Security question"}</div>
        <input id="ans${i}" type="password" placeholder="Answer" autocomplete="off"/>
      </label>
    `)
    .join("");
}

async function startReset() {
  const email = document.getElementById("email").value.trim();
  if (!email) return;

  setMsg("");

  const res = await fetch("/api/auth/reset/start", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });

  // Important: don’t leak whether the user exists.
  if (!res.ok) {
    setMsg("If the account exists, you’ll be prompted for security questions.");
    return;
  }

  const data = await res.json();
  resetToken = data.resetToken;
  questionIds = data.questionIds || [];

  if (!resetToken || questionIds.length === 0) {
    setMsg("Account recovery isn’t set up for this account.");
    return;
  }

  renderQuestions(questionIds);
  document.getElementById("step1").hidden = true;
  document.getElementById("step2").hidden = false;
}

async function finishReset() {
  const pw1 = document.getElementById("newPw").value;
  const pw2 = document.getElementById("newPw2").value;

  if (!pw1 || pw1.length < 8) {
    setMsg("Password must be at least 8 characters.");
    return;
  }
  if (pw1 !== pw2) {
    setMsg("Passwords do not match.");
    return;
  }

  const answers = questionIds.map((_, i) => document.getElementById(`ans${i}`).value);
  if (answers.some((a) => !a)) {
    setMsg("Answer all security questions.");
    return;
  }

  const res = await fetch("/api/auth/reset/finish", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ resetToken, answers, newPassword: pw1 }),
  });

  setMsg(res.ok ? "Password reset. You can log in now." : "Incorrect answers or expired reset.");
}

document.getElementById("startBtn").addEventListener("click", startReset);
document.getElementById("finishBtn").addEventListener("click", finishReset);
