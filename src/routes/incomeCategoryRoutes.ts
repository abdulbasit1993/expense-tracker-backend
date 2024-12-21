import express from "express";
import { extractToken } from "../middlewares/extractToken";
const incomeCategoryController = require("../controllers/incomeCategoryController");
const router = express.Router();

router.get(
  "/income-categories",
  extractToken,
  incomeCategoryController.getAllIncomeCategories
);

export default router;
