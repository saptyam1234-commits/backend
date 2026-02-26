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
fontSize:"13px",
background:"#f9f9f9"
});

box.appendChild(messages);

/* INPUT */
const input = document.createElement("input");
input.placeholder="Type message...";

Object.assign(input.style,{
width:"100%",
padding:"10px",
border:"none",
borderTop:"1px solid #eee"
});

box.appendChild(input);

/* SEND MESSAGE */
input.addEventListener("keypress", async function(e){

if(e.key==="Enter" && input.value.trim()!==""){

const userMessage = input.value;
input.value="";

messages.innerHTML += '<div style="text-align:right;margin:5px">' +
'You: ' + userMessage +
'</div>';

try{

const res = await fetch(\`\${API_BASE}/chat\`,{
method:"POST",
headers:{
"Content-Type":"application/json",
"x-api-key":API_KEY
},
body:JSON.stringify({
message:userMessage,
businessId:BUSINESS_ID
})
});

const data = await res.json();

messages.innerHTML += `<div style="margin:5px">
Bot: ${data.reply || "No response"}
</div>`;

messages.scrollTop = messages.scrollHeight;

}catch(err){
console.error(err);
}

}
});

/* Toggle */
btn.onclick=()=>box.style.display="flex";

})();
`;

}

module.exports = { getWidgetSnippet };
