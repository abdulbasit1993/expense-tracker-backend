import express from "express";
import { extractToken } from "../middlewares/extractToken";
const router = express.Router();
const userController = require("../controllers/userController");

router.get("/user/profile", extractToken, userController.getUserProfile);

export default router;
