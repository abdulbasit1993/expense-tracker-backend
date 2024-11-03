import express from "express";
import { extractUser } from "../middlewares/extractUser";
const expenseController = require("../controllers/expenseController");
const router = express.Router();

router.post("/expenses/add", extractUser, expenseController.addNewExpense);

router.get("/expenses", extractUser, expenseController.getAllExpensesOfUser);

router.put("/expenses/update", extractUser, expenseController.updateExpense);

router.delete("/expenses/delete", extractUser, expenseController.deleteExpense);

export default router;
