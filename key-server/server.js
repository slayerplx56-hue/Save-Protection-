const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Load keys from file
const keysFile = path.join(__dirname, "keys.json");

function loadKeys() {
  if (!fs.existsSync(keysFile)) return {};
  return JSON.parse(fs.readFileSync(keysFile, "utf8"));
}

function saveKeys(keys) {
  fs.writeFileSync(keysFile, JSON.stringify(keys, null, 2));
}

// Health check
app.get("/", (req, res) => {
  res.send("Key server is running");
});

// Validate key (ONE-TIME USE)
app.post("/validate", (req, res) => {
  const { key } = req.body;
  if (!key) return res.status(400).json({ error: "No key provided" });

  const keys = loadKeys();

  if (!keys[key]) {
    return res.status(403).json({ valid: false });
  }

  // Delete key after use
  delete keys[key];
  saveKeys(keys);

  console.log("Key used:", key, "IP:", req.ip);
  res.json({ valid: true });
});

app.listen(PORT, () => {
  console.log(`Key server running on port ${PORT}`);
});
