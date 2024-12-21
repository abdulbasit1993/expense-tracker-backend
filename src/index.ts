import express from "express";
import swaggerUi from "swagger-ui-express";
const swaggerDocument = require("./swagger.json");

const app = express();

const PORT = process.env.PORT || 3001;

app.use(express.json());

import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes";
import expenseCategoryRoutes from "./routes/expenseCategoryRoutes";
import expenseRoutes from "./routes/expenseRoutes";
import incomeCategoryRoutes from "./routes/incomeCategoryRoutes";

app.get("/api", async (req, res) => {
  res.send({ message: "Welcome to Expense Tracker APIs!" });
});

app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use("/api", authRoutes);
app.use("/api", userRoutes);
app.use("/api", expenseCategoryRoutes);
app.use("/api", expenseRoutes);
app.use("/api", incomeCategoryRoutes);

app.listen(PORT, () => {
  console.log(`Server is running at port ${PORT}`);
});
