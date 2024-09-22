import express from "express";
import { extractToken } from "../middlewares/extractToken";
import { checkAdmin } from "../middlewares/checkAdminRole";
const expenseController = require("../controllers/expenseController");
const router = express.Router();

router.post(
  "/expense-categories",
  extractToken,
  checkAdmin,
  expenseController.addExpenseCategory
);

router.get(
  "/expense-categories",
  extractToken,
  expenseController.getAllExpenseCategories
);

router.put(
  "/expense-categories",
  extractToken,
  checkAdmin,
  expenseController.updateExpenseCategory
);

router.delete(
  "/expense-categories",
  extractToken,
  checkAdmin,
  expenseController.deleteExpenseCategory
);

export default router;
