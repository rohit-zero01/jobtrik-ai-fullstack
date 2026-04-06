require("dotenv").config();

const path = require("path");
const cors = require("cors"); 

const app = require("./src/app");
const connectToDB = require("./src/config/database");

connectToDB();


app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// Serve frontend
app.use(require("express").static(path.join(__dirname, "dist")));

// Fallback
app.use((req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});