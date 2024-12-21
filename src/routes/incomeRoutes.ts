import express from "express";
import { extractUser } from "../middlewares/extractUser";
const incomeController = require("../controllers/incomeController");
const router = express.Router();

router.post("/income/add", extractUser, incomeController.addNewIncome);

router.get("/income", extractUser, incomeController.getAllIncomeOfUser);

export default router;
