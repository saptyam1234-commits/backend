const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {

  res.setHeader("Content-Type", "application/javascript");

  res.send(`
(function () {

  const API_BASE = "https://backend-cyvm.onrender.com/api";

  /* CHAT BUTTON */
  const btn = document.createElement("button");
  btn.innerText = "🤖";

  Object.assign(btn.style,{
    position:"fixed",
    bottom:"20px",
    right:"20px",
    width:"60px",
    height:"60px",
    borderRadius:"50%",
    border:"none",
    background:"#000",
    color:"#fff",
    fontSize:"24px",
    cursor:"pointer",
    zIndex:"999999"
  });

  document.body.appendChild(btn);

  /* CHAT BOX */
  const box = document.createElement("div");

  Object.assign(box.style,{
    position:"fixed",
    bottom:"90px",
    right:"20px",
    width:"320px",
    height:"450px",
    background:"#fff",
    borderRadius:"12px",
    display:"none",
    flexDirection:"column",
    boxShadow:"0 10px 30px rgba(0,0,0,.2)",
    overflow:"hidden",
    zIndex:"999999"
  });

  document.body.appendChild(box);

  /* MESSAGE AREA */
  const messages = document.createElement("div");
  Object.assign(messages.style,{
    flex:"1",
    padding:"10px",
    overflowY:"auto",
    fontSize:"13px"
  });
  box.appendChild(messages);

  /* INPUT */
  const inputContainer = document.createElement("div");
  inputContainer.style.display = "flex";

  const input = document.createElement("input");
  input.placeholder = "Type message...";
  input.style.flex = "1";
  input.style.padding = "10px";
  input.style.border = "none";

  const sendBtn = document.createElement("button");
  sendBtn.innerText = "Send";
  sendBtn.style.background = "#000";
  sendBtn.style.color = "#fff";
  sendBtn.style.border = "none";
  sendBtn.style.padding = "10px";
  sendBtn.style.cursor = "pointer";

  inputContainer.appendChild(input);
  inputContainer.appendChild(sendBtn);
  box.appendChild(inputContainer);

  btn.onclick = () => box.style.display = "flex";

  async function sendMessage() {

    if(!input.value.trim()) return;

    const userMessage = input.value;
    input.value = "";

    const userDiv = document.createElement("div");
    userDiv.innerText = userMessage;
    userDiv.style.textAlign = "right";
    userDiv.style.marginBottom = "5px";
    messages.appendChild(userDiv);

    try {

      const res = await fetch(API_BASE + "/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage })
      });

      const data = await res.json();

      const botDiv = document.createElement("div");
      botDiv.innerText = data.reply || "No response";
      botDiv.style.textAlign = "left";
      botDiv.style.marginBottom = "5px";
      messages.appendChild(botDiv);

      messages.scrollTop = messages.scrollHeight;

    } catch(err) {
      console.error(err);
    }
  }

  sendBtn.onclick = sendMessage;

})();
  `);

});

module.exports = router;
