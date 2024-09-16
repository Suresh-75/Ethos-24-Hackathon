const express = require("express");
const app = express();
//login
app.get("/auth/login", (req, res) => {
  res.json({
    Status: "working on it",
  });
});

app.get("/auth/register", (req, res) => {
  res.json({
    Status: "working on it",
  });
});
// E2EE
app.get("/keys/exchange", (req, res) => {
  res.json({
    Status: "working on it",
  });
});

app.get("/keys/:userID", (req, res) => {
  res.json({
    Status: "working on it",
  });
});

module.exports = app;
