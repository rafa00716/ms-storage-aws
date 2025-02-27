const fs = require("fs");

const clients = JSON.parse(fs.readFileSync("clients.json", "utf8"));

function authenticate(req, res, next) {
  const apiKey = req.headers["x-api-key"];
  if (!apiKey || !clients[apiKey]) {
    return res.status(403).json({ error: "Invalid API Key" });
  }
  req.projectFolder = clients[apiKey];
  next();
}

module.exports = authenticate;
