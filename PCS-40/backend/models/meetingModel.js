import mongoose from "mongoose";

const MeetingSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    menId: { type: String, required: true },
    slotDate: { type: String, required: true },
    slotTime: { type: String, required: true },
    userData: { type: Object, required: true },
    menData: { type: Object, required: true },
    amount: { type: Number, required: true },
    date: { type: Number, required: true },
    cancelled: { type: Boolean, default: false },
    payment: { type: Boolean, default: false },
    isCompleted: { type: Boolean, default: false }
})

const MeetingModel = mongoose.models.Meeting || mongoose.model("Meeting", MeetingSchema);
export default MeetingModel;