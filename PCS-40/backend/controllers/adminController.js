import jwt from "jsonwebtoken";
import MeetingModel from "../models/MeetingModel.js";
import MentorModel from "../models/mentorModel.js";
import CollegeModel from "../models/collegeModel.js";
import bcrypt from "bcrypt";
import validator from "validator";
import { v2 as cloudinary } from "cloudinary";
import userModel from "../models/userModel.js";

// API for admin login
const loginAdmin = async (req, res) => {
    try {

        const { email, password } = req.body

        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
            const token = jwt.sign(email + password, process.env.JWT_SECRET)
            res.json({ success: true, token })
        } else {
            res.json({ success: false, message: "Invalid credentials" })
        }

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }

}

// API to get all Meetings list
const MeetingsAdmin = async (req, res) => {
    try {

        const Meetings = await MeetingModel.find({});

        await Promise.all(Meetings.map(async (item, index) => {
            const userData = await userModel.findById(item.userId).select(['-password', '-email']);
            Meetings[index].userData = userData;
        }));  
        
        res.json({ success: true, Meetings })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }

}

const MeetingCancel = async (req, res) => {
    try {

        const { MeetingId } = req.body
        await MeetingModel.findByIdAndUpdate(MeetingId, { cancelled: true })

        res.json({ success: true, message: 'Meeting Cancelled' })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }

}

const addMentor = async (req, res) => {

    try {

        const { name, email, password, speciality, degree, experience, about, fees, address } = req.body
        const imageFile = req.file

        // checking for all data to add Mentor
        if (!name || !email || !password || !speciality || !degree || !experience || !about || !fees || !address) {
            return res.json({ success: false, message: "Missing Details" })
        }

        // validating email format
        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Please enter a valid email" })
        }

        if (password.length < 8) {
            return res.json({ success: false, message: "Please enter a strong password" })
        }

        // hashing user password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt)

        // upload image to cloudinary
        console.log(imageFile.path)
        // console.log( await cloudinary.uploader.upload(imageFile.path));
        const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: "image" } );
        const imageUrl = imageUpload.secure_url;
        // const imageUrl = "hahuhauah"

        const MentorData = {
            name,
            email,
            image: imageUrl,
            password: hashedPassword,
            speciality,
            degree,
            experience,
            about,
            fees,
            address: JSON.parse(address),
            date: Date.now()
        }

        const newMentor = new MentorModel(MentorData)
        await newMentor.save()
        res.json({ success: true, message: 'Mentor Added' })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

const addCollege = async (req, res) => {
    try {
        const { name, email, experience, fees, appFees, about, speciality, address, star, state, city, studentFacultyRatio } = req.body;

        const imageFile = req.file;

        // Checking for missing fields
        if (!name || !email || !speciality || !experience || !about || !fees || !appFees || !address || !star || !state || !city || !studentFacultyRatio) {
            return res.json({ success: false, message: "Missing Details" });
        }

        // Upload image to Cloudinary
        const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: "image" });
        const imageUrl = imageUpload.secure_url;
        // const imageUrl = "kjbsksxbKZx";

        // Create new college entry
        const CollegeData = new CollegeModel({
            name,
            email,
            image: imageUrl,
            experience,
            fees,
            appFees,
            about,
            speciality,
            address: JSON.parse(address),
            star,
            state,
            city,
            studentFacultyRatio,
            date: Date.now()
        });

        await CollegeData.save();
        res.json({ success: true, message: "College Added Successfully" });

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to get all Mentors list for admin panel
const allMentors = async (req, res) => {
    try {

        const Mentors = await MentorModel.find({}).select('-password')
        res.json({ success: true, Mentors })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
};

// API to get dashboard data for admin panel
const adminDashboard = async (req, res) => {
    try {

        const Mentors = await MentorModel.find({});
        const users = await userModel.find({});
        const Meetings = await MeetingModel.find({});
        const College = await CollegeModel.find({});

        const dashData = {
            Mentors: Mentors.length,
            Meetings: Meetings.length,
            user: users.length,
            collegeList: College.length,
            latestMeetings: Meetings.reverse()
        }

        res.json({ success: true, dashData })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
};

const deleteMentor = async (req, res) => {

    try {

        const { email } = req.body;

        const menti = await MentorModel.findOne({ email });

        // res.json({menti});

        if (!menti) {
            return res.json({ success: false, message: "Mentor does't exist" });
        }

        const leftMeetings = await MeetingModel.find({ menId: menti._id, isCompleted: false, cancelled: false });

        if (leftMeetings.length !== 0) {
            return res.json({ success: false, message: "Mentor has existing Meetings left" });
        }

        await MentorModel.findByIdAndDelete(menti._id);

        res.json({ success: true, message: 'Mentor deleted' });
        // res.json({leftMeetings});

    } catch (error) {
        console.error(error)
        res.json({ success: false, message: error.message })
    }
};

export {
    loginAdmin,
    MeetingsAdmin,
    MeetingCancel,
    addMentor,
    allMentors,
    adminDashboard,
    addCollege,
    deleteMentor
};
