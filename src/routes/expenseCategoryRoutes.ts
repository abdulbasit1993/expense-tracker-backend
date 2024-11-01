import express from "express";
import { extractToken } from "../middlewares/extractToken";
import { checkAdmin } from "../middlewares/checkAdminRole";
const expenseCategoryController = require("../controllers/expenseCategoryController");
const router = express.Router();

router.post(
  "/expense-categories",
  extractToken,
  checkAdmin,
  expenseCategoryController.addExpenseCategory
);

router.get(
  "/expense-categories",
  extractToken,
  expenseCategoryController.getAllExpenseCategories
);

router.put(
  "/expense-categories",
  extractToken,
  checkAdmin,
  expenseCategoryController.updateExpenseCategory
);

router.delete(
  "/expense-categories",
  extractToken,
  checkAdmin,
  expenseCategoryController.deleteExpenseCategory
);

export default router;
