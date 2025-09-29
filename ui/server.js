const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 5000;


app.use(cors()); 
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Welcome to the backend server!");
});


app.post("/", (req, res) => {
  const { name, dob, email, password, phone } = req.body;

  console.log("Received Form Data:");
  console.log("Name:", name);
  console.log("DOB:", dob);
  console.log("Email:", email);
  console.log("Password:", password);
  console.log("Phone Number:", phone);

  res.status(200).send("Form data received successfully!");
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
