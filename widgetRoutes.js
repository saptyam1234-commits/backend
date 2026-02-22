const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {

  res.setHeader("Content-Type", "application/javascript");

  res.send(`
    (function () {

      const API_BASE = "https://backend-cyvm.onrender.com/api";

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

      btn.onclick = function(){
        alert("Widget Working ✅");
      };

    })();
  `);

});

module.exports = router;
