require("dotenv").config();

const path = require("path");
const app = require("./src/app");
const connectToDB = require("./src/config/database");

connectToDB();

//  Serve frontend
app.use(require("express").static(path.join(__dirname, "dist")));

// Fallback route
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

// Start server
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});