import { isValidObjectId } from "mongoose";
import userModel from "../models/userModel.js";
import ResetToken from "../models/resetToken.js";

const isResetTokenValid = async (req, res, next) => {
    const { token, id } = req.query;

    if (!token || !id) {
        return res.status(404).json({ message: "Invalid request" });
    }

    if (!isValidObjectId(id)) {
        return res.status(404).json({ message: "Invalid user" });
    }

    const user = await userModel.findById(id);
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    const resetToken = await ResetToken.findOne({ owner: user._id });
    if (!resetToken) {
        return res.status(404).json({ message: "Reset Token not found" });
    }

    const isValid = await resetToken.matchToken(token);
    if (!isValid) {
        return res.status(404).json({ message: "Reset Token is invalid" });
    }

    req.user = user;
    next();
};

export { isResetTokenValid };