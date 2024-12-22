import express from "express";
import { extractUser } from "../middlewares/extractUser";
const incomeController = require("../controllers/incomeController");
const router = express.Router();

router.post("/income/add", extractUser, incomeController.addNewIncome);

router.get("/income", extractUser, incomeController.getAllIncomeOfUser);

router.get("/income/:id", extractUser, incomeController.getSingleIncome);

router.put("/income/update", extractUser, incomeController.updateIncome);

router.delete("/income/delete", extractUser, incomeController.deleteIncome);

export default router;
