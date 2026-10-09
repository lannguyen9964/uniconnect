import express from "express";
import { getMe, findUserByUsername } from "../controllers/userController.js";

const router = express.Router();

router.get("/me", getMe);

router.get("/search", findUserByUsername);

export default router;