import express from 'express';
import { loginAdmin, MeetingsAdmin, MeetingCancel, addMentor, allMentors, adminDashboard, addCollege, deleteMentor } from '../controllers/adminController.js';
import { changeAvailablity } from '../controllers/mentorController.js';
import authAdmin from '../middleware/authAdmin.js';
import upload from '../middleware/multer.js';
const adminRouter = express.Router();

adminRouter.post("/login", loginAdmin);
adminRouter.post("/add-Mentor", authAdmin, upload.single('image'), addMentor);
adminRouter.post("/add-College", authAdmin, upload.single('image'), addCollege);
adminRouter.get("/Meetings", authAdmin, MeetingsAdmin);
adminRouter.post("/deleteMentor", authAdmin, deleteMentor);
adminRouter.post("/cancel-Meeting", authAdmin, MeetingCancel);
adminRouter.get("/all-Mentors", authAdmin, allMentors);
adminRouter.post("/change-availability", authAdmin, changeAvailablity);
adminRouter.get("/dashboard", authAdmin, adminDashboard);

export default adminRouter;
