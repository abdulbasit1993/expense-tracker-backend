import express from "express";

const app = express();

const PORT = process.env.PORT || 3001;

app.use(express.json());

import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes";
import expenseRoutes from "./routes/expenseRoutes";

app.get("/api", async (req, res) => {
  res.send({ message: "Welcome to Expense Tracker APIs!" });
});

app.use("/api", authRoutes);
app.use("/api", userRoutes);
app.use("/api", expenseRoutes);

app.listen(PORT, () => {
  console.log(`Server is running at port ${PORT}`);
});
