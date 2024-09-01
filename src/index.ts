import express from "express";

const app = express();

const PORT = 3001;

app.use(express.json());

const authRoutes = require("./routes/authRoutes");

app.get("/", async (req, res) => {
  res.send({ message: "Welcome to Expense Tracker APIs!" });
});

app.use("/api", authRoutes);

app.listen(PORT, () => {
  console.log(`Server is running at port ${PORT}`);
});
