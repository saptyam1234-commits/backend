function getWidgetSnippet() {
return `
(function () {

  const API_BASE = "https://backend-cyvm.onrender.com/api";

  /* ---------- CHAT BUTTON ---------- */
  const btn = document.createElement("button");
  btn.innerText = "🤖";
  Object.assign(btn.style, {
    position: "fixed",
    bottom: "20px",
    right: "20px",
    width: "60px",
    height: "60px",
    borderRadius: "50%",
    border: "none",
    background: "#000",
    color: "#fff",
    fontSize: "24px",
    cursor: "pointer",
    zIndex: "9999",
    boxShadow: "0 10px 25px rgba(0,0,0,.3)"
  });
  document.body.appendChild(btn);

  /* ---------- CHAT BOX ---------- */
  const box = document.createElement("div");
  Object.assign(box.style, {
    position: "fixed",
    bottom: "90px",
    right: "20px",
    width: "350px",
    height: "480px",
    background: "#ffffff",
    borderRadius: "16px",
    display: "none",
    flexDirection: "column",
    zIndex: "9999",
    boxShadow: "0 20px 50px rgba(0,0,0,.25)",
    overflow: "hidden",
    fontFamily: "Arial, sans-serif"
  });
  document.body.appendChild(box);

  /* ---------- HEADER ---------- */
  const header = document.createElement("div");
  header.innerHTML = `
    <span>🤖 ChatWidgetPro</span>
    <span style="cursor:pointer;font-size:18px;">✕</span>
  `;
  Object.assign(header.style, {
    background: "#ffffff",
    color: "#000",
    padding: "15px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    fontSize: "14px",
    fontWeight: "bold",
    borderBottom: "1px solid #eee"
  });
  box.appendChild(header);

  /* ---------- MESSAGE AREA ---------- */
  const messages = document.createElement("div");
  Object.assign(messages.style, {
    flex: "1",
    padding: "12px",
    overflowY: "auto",
    background: "#f9f9f9",
    fontSize: "13px"
  });
  box.appendChild(messages);

  /* ---------- MOBILE INPUT ---------- */
  const mobileInput = document.createElement("input");
  mobileInput.placeholder = "Enter your mobile number...";
  Object.assign(mobileInput.style, {
    width: "100%",
    padding: "10px",
    border: "none",
    borderTop: "1px solid #eee",
    outline: "none"
  });
  box.appendChild(mobileInput);

  /* ---------- CHAT INPUT ---------- */
  const input = document.createElement("input");
  input.placeholder = "Type your message...";
  Object.assign(input.style, {
    width: "100%",
    padding: "12px",
    border: "none",
    borderTop: "1px solid #eee",
    outline: "none"
  });
  box.appendChild(input);

  /* ---------- SAVE LEAD ---------- */
  mobileInput.addEventListener("keypress", async function (e) {
    if (e.key === "Enter" && mobileInput.value.trim() !== "") {
      await fetch(`${API_BASE}/lead`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobile: mobileInput.value })
      });
      mobileInput.placeholder = "Mobile saved ✅";
      mobileInput.disabled = true;
    }
  });

  /* ---------- CHAT SEND ---------- */
  input.addEventListener("keypress", async function (e) {
    if (e.key === "Enter" && input.value.trim() !== "") {
      const userMessage = input.value;
      input.value = "";

      const userDiv = document.createElement("div");
      userDiv.innerHTML = `<strong>You:</strong> ${userMessage}`;
      messages.appendChild(userDiv);

      const res = await fetch(`${API_BASE}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage })
      });

      const data = await res.json();

      const botDiv = document.createElement("div");
      botDiv.innerHTML = `<strong>Bot:</strong> ${data.reply}`;
      botDiv.style.marginTop = "8px";
      messages.appendChild(botDiv);

      messages.scrollTop = messages.scrollHeight;
    }
  });

  /* ---------- TOGGLE ---------- */
  btn.onclick = () => box.style.display = "flex";
  header.children[1].onclick = () => box.style.display = "none";

})();
`;
}

module.exports = { getWidgetSnippet };
