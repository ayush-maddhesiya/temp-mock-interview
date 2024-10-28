// route/route.js
import { Router } from "express";
import { registerUser, getUser } from "../controller/user.js";
import { createQuestion, getUserQuestions } from '../controller/question.js';

const router = Router();

// User routes
router.post("/user/register", registerUser);
router.get("/user", getUser);

// Question routes
router.post("/question", createQuestion);
router.get("/user/questions", getUserQuestions);
router.get("/user/listofAvaibleuserforMeeting", listofAvaibleuserforMeeting);

export default router;