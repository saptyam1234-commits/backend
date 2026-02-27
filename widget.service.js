const admin = require("firebase-admin");

/*
=====================================
Widget Snippet Generator (Production)
=====================================
*/
function getWidgetSnippet(apiKey, websiteData) {

return `
(function(){

const API_BASE = "https://backend-cyvm.onrender.com/api";
const BUSINESS_ID = "${websiteData?.businessId || ""}";
const API_KEY = "${apiKey}";

/* ===== ROBOT BUTTON ===== */
const button = document.createElement("div");
button.innerHTML = "🤖";

Object.assign(button.style,{
position:"fixed",
bottom:"20px",
right:"20px",
width:"65px",
height:"65px",
background:"linear-gradient(135deg,#4F46E5,#7C3AED)",
borderRadius:"50%",
display:"flex",
alignItems:"center",
justifyContent:"center",
fontSize:"28px",
cursor:"pointer",
boxShadow:"0 8px 20px rgba(0,0,0,0.3)",
zIndex:"9999",
transition:"0.3s"
});

document.body.appendChild(button);

/* ===== CHAT BOX ===== */
const chatBox = document.createElement("div");

Object.assign(chatBox.style,{
position:"fixed",
bottom:"100px",
right:"20px",
width:"320px",
height:"450px",
background:"#fff",
borderRadius:"15px",
boxShadow:"0 15px 35px rgba(0,0,0,0.2)",
display:"none",
flexDirection:"column",
overflow:"hidden",
zIndex:"9999",
fontFamily:"Arial, sans-serif"
});

document.body.appendChild(chatBox);

/* ===== HEADER ===== */
const header = document.createElement("div");
header.innerHTML = "🤖 Chat Support";

Object.assign(header.style,{
background:"#4F46E5",
color:"#fff",
padding:"12px",
fontWeight:"bold",
textAlign:"center"
});

chatBox.appendChild(header);

/* ===== MESSAGE AREA ===== */
const messages = document.createElement("div");

Object.assign(messages.style,{
flex:"1",
padding:"10px",
overflowY:"auto",
fontSize:"14px",
background:"#f9fafb"
});

chatBox.appendChild(messages);

/* ===== INPUT AREA ===== */
const inputContainer = document.createElement("div");

Object.assign(inputContainer.style,{
display:"flex",
padding:"8px",
borderTop:"1px solid #eee"
});

const input = document.createElement("input");
input.placeholder="Type message...";

Object.assign(input.style,{
flex:"1",
padding:"8px",
border:"1px solid #ddd",
borderRadius:"5px"
});

const sendBtn = document.createElement("button");
sendBtn.innerText="Send";

Object.assign(sendBtn.style,{
marginLeft:"5px",
background:"#4F46E5",
color:"#fff",
border:"none",
padding:"8px 10px",
borderRadius:"5px",
cursor:"pointer"
});

inputContainer.appendChild(input);
inputContainer.appendChild(sendBtn);
chatBox.appendChild(inputContainer);

/* ===== TOGGLE ===== */
button.addEventListener("click",()=>{
chatBox.style.display =
chatBox.style.display==="none" ? "flex" : "none";
});

/* ===== APPEND MESSAGE ===== */
function appendMessage(sender,text,isUser){

const msg = document.createElement("div");
msg.style.marginBottom="8px";
msg.style.textAlign = isUser ? "right" : "left";

msg.innerHTML =
\`<span style="
display:inline-block;
padding:6px 10px;
border-radius:10px;
background:\${isUser ? "#4F46E5" : "#e5e7eb"};
color:\${isUser ? "#fff" : "#000"};
font-size:13px;
">
\${text}
</span>\`;

messages.appendChild(msg);
messages.scrollTop = messages.scrollHeight;
}

/* ===== SEND MESSAGE ===== */
async function sendMessage(){

const text = input.value.trim();
if(!text) return;

appendMessage("You",text,true);
input.value="";

try{

const res = await fetch(\`\${API_BASE}/chat\`,{
method:"POST",
headers:{
"Content-Type":"application/json",
"x-api-key":API_KEY
},
body:JSON.stringify({
message:text,
businessId:BUSINESS_ID
})
});

const data = await res.json();

appendMessage("Bot",data.reply || "No response",false);

}catch(err){
appendMessage("Bot","Server error",false);
}

}

sendBtn.addEventListener("click",sendMessage);
input.addEventListener("keypress",(e)=>{
if(e.key==="Enter") sendMessage();
});

})();
`;
}

module.exports = { getWidgetSnippet };
