import express from 'express';
import { loginUser, registerUser, getProfile, updateProfile, bookMeeting, listMeeting, cancelMeeting, verifyEmail, forgetPassword, resetPassword, paymentRazorpay, verifyRazorpay } from '../controllers/userController.js';
import upload from '../middleware/multer.js';
import { isResetTokenValid } from "../middleware/user.js";
import authUser from '../middleware/authUser.js';
const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);

userRouter.get("/get-profile", authUser, getProfile);
userRouter.post("/update-profile", upload.single('image'), authUser, updateProfile);
userRouter.post("/book-Meeting", authUser, bookMeeting);
userRouter.get("/Meetings", authUser, listMeeting);
userRouter.post("/cancel-Meeting", authUser, cancelMeeting);
userRouter.post("/payment-razorpay", authUser, paymentRazorpay);
userRouter.post("/verifyRazorpay", authUser, verifyRazorpay);
// userRouter.post("/payment-stripe", authUser, paymentStripe)
// userRouter.post("/verifyStripe", authUser, verifyStripe)
userRouter.route("/verifyEmail").post(verifyEmail);
userRouter.route("/forgetPassword").post(forgetPassword);
userRouter.route("/resetPassword").post(isResetTokenValid, resetPassword);
userRouter.route("/verifyToken").get(isResetTokenValid, (req, res) => {
    res.json({ success: true });
});

export default userRouter;
