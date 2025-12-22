const express = require("express");
const app = express();
app.use(express.json());

const PORT = 3000;

/* ===== KEY DATABASE ===== */
/* expires = timestamp (Date.now()) */
const keys = {
  "25_29381_79833_0": {
    project: "MyGame",
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000 // 7 days
  },
  "18_99231_44120_3": {
    project: "MyGame",
    expires: Date.now() + 30 * 24 * 60 * 60 * 1000 // 30 days
  }
};

/* ===== VALIDATION ===== */
app.post("/validate", (req, res) => {
  const { license, project } = req.body;

  if (!keys[license]) {
    return res.json({ valid: false, reason: "Invalid key" });
  }

  const keyData = keys[license];

  if (keyData.project !== project) {
    return res.json({ valid: false, reason: "Project mismatch" });
  }

  if (Date.now() > keyData.expires) {
    return res.json({ valid: false, reason: "Key expired" });
  }

  return res.json({
    valid: true,
    message: "Key valid & active"
  });
});

/* ===== START SERVER ===== */
app.listen(PORT, () => {
  console.log("Key expiration server running on port " + PORT);
});
