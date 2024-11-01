import express from "express";
import { extractUser } from "../middlewares/extractUser";
const expenseController = require("../controllers/expenseController");
const router = express.Router();

router.post("/expenses/add", extractUser, expenseController.addNewExpense);

export default router;
