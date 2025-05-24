import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import MentorModel from "../models/mentorModel.js";
import MeetingModel from "../models/MeetingModel.js";
import CollegeModel from "../models/collegeModel.js";
import userModel from "../models/userModel.js";

// API for Mentor Login 
const loginMentor = async (req, res) => {

    try {

        const { email, password } = req.body;
        const user = await MentorModel.findOne({ email });

        if (!user) {
            return res.json({ success: false, message: "Invalid credentials" });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (isMatch) {
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
            res.json({ success: true, token });
        } else {
            res.json({ success: false, message: "Invalid credentials" });
        }
        ;

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// API to get Mentor Meetings for Mentor panel
const MeetingsMentor = async (req, res) => {
    try {

        const { menId } = req.body;
        const Meetings = await MeetingModel.find({ menId });

        // console.log(Meetings, 'Meetings-1');

        await Promise.all(Meetings.map(async (item, index) => {
            const userData = await userModel.findById(item.userId).select(['-password', '-email']);
            Meetings[index].userData = userData;
        }));        

        // console.log(Meetings, 'Meetings-2');

        res.json({ success: true, Meetings });
        // console.log(Meetings);

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// API to cancel Meeting for Mentor panel
const MeetingCancel = async (req, res) => {
    try {

        const { menId, MeetingId } = req.body;

        const MeetingData = await MeetingModel.findById(MeetingId);
        if (MeetingData && MeetingData.menId === menId) {
            await MeetingModel.findByIdAndUpdate(MeetingId, { cancelled: true });
            return res.json({ success: true, message: 'Meeting Cancelled' });
        }

        res.json({ success: false, message: 'Meeting Cancelled' });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }

}

// API to mark Meeting completed for Mentor panel
const MeetingComplete = async (req, res) => {
    try {

        const { menId, MeetingId } = req.body;

        const MeetingData = await MeetingModel.findById(MeetingId);
        if (MeetingData && MeetingData.menId === menId) {
            await MeetingModel.findByIdAndUpdate(MeetingId, { isCompleted: true });
            return res.json({ success: true, message: 'Meeting Completed' });
        }

        res.json({ success: true, message: 'Meeting Completed' });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }

}

// API to get all Mentors list for Frontend
const MentorList = async (req, res) => {
    try {

        const Mentors = await MentorModel.find({}).select(['-password', '-email']);
        res.json({ success: true, Mentors });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }

}

const CollegeList = async (req, res) => {
    try {

        const Colleges = await CollegeModel.find();
        res.json({ success: true, Colleges });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// API to change Mentor availablity for Admin and Mentor Panel
const changeAvailablity = async (req, res) => {
    try {

        const { menId } = req.body

        const menData = await MentorModel.findById(menId)
        await MentorModel.findByIdAndUpdate(menId, { available: !menData.available })
        res.json({ success: true, message: 'Availablity Changed' })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to get Mentor profile for  Mentor Panel
const MentorProfile = async (req, res) => {
    try {

        const { menId } = req.body
        const profileData = await MentorModel.findById(menId).select('-password')

        res.json({ success: true, profileData })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to update Mentor profile data from  Mentor Panel
const updateMentorProfile = async (req, res) => {
    try {

        const { menId, fees, address, available } = req.body

        await MentorModel.findByIdAndUpdate(menId, { fees, address, available })

        res.json({ success: true, message: 'Profile Updated' })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to get dashboard data for Mentor panel
const MentorDashboard = async (req, res) => {
    try {

        const { menId } = req.body
        // console.log(menId);

        const Meetings = await MeetingModel.find({ menId });
        // console.log(Meetings);

        let earnings = 0

        Meetings.map((item) => {
            if (item.isCompleted || item.payment) {
                earnings += item.amount
            }
        })

        let patients = [];

        Meetings.map((item) => {
            if (!patients.includes(item.userId)) {
                patients.push(item.userId)
            }
        })

        const dashData = {
            earnings,
            Meetings: Meetings.length,
            patients: patients.length,
            latestMeetings: Meetings.reverse()
        }

        res.json({ success: true, dashData })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

export {
    loginMentor,
    MeetingsMentor,
    MeetingCancel,
    MentorList,
    changeAvailablity,
    MeetingComplete,
    MentorDashboard,
    MentorProfile,
    updateMentorProfile,
    CollegeList,
};
