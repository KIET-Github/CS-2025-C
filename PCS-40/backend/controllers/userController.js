import validator from "validator";
import userModel from "../models/userModel.js";
import MentorModel from "../models/mentorModel.js";
import MeetingModel from "../models/MeetingModel.js";
import { v2 as cloudinary } from 'cloudinary';
import { generateToken } from "../utils/generateToken.js";
import { generateOTP, transporter, generateEmailTemplate, plainEmailTemplate, generatePasswordResetTemplate } from "../utils/mail.js";
import VerificationToken from "../models/verificationTokenschema.js";
import ResetToken from "../models/resetToken.js";
import razorpay from 'razorpay';
import mongoose from "mongoose";
// import ImageKit from "imagekit";

// import stripe from "stripe";
// const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY)

// Gateway Initialize
const razorpayInstance = new razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});
// console.log(cloudinary.uploader.upload);
// API to register user

// const imagekit = new ImageKit({
//     publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
//     privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
//     urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT
// });

const registerUser = async (req, res) => {

    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ success: false, message: 'Missing Details' })
        }

        const userExist = await userModel.findOne({ email });

        if (userExist) {
            return res.status(400).json({ success: false, message: "User already exists" });
        };

        if (name.length < 3 || name.length > 20) {
            return res.status(400).json({ success: false, message: "Name must be 3 to 20 characters long!" })
        }

        if (!validator.isEmail(email)) {
            return res.status(400).json({ success: false, message: "Please enter a valid email" })
        }

        if (password.length < 8 || password.length > 20) {
            return res.status(400).json({ success: false, message: "Password must be 8 to 20 characters long!" })
        }

        const newUser = new userModel({
            name,
            email,
            password,
        });

        const OTP = generateOTP();
        const verificationToken = new VerificationToken({
            owner: newUser._id,
            token: OTP,
        })

        await verificationToken.save();
        await newUser.save();

        transporter().sendMail({
            from: 'prabhatsahrawat010203@gmail.com',
            to: newUser.email,
            subject: "Verify your email account",
            html: generateEmailTemplate(OTP),
        });

        // const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)

        // res.json({ success: true, token })

        if (newUser) {
            res.status(201).json({
                success: true,
                _id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                token: generateToken(newUser._id)
            });
        } else {
            res.status(400).json({ success: false, message: "Error occoured" })
        }

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to login user
const loginUser = async (req, res) => {

    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, message: "Provide All Details" });
        };

        const user = await userModel.findOne({ email })

        if (!user) {
            return res.json({ success: false, message: "User does not exist" })
        }

        const isMatch = await user.matchPassword(password);

        if (!isMatch) {
            return res.status(404).json({ success: false, message: "Password Is Wrong" });
        }

        // if (isMatch) {
        //     const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)
        //     res.json({ success: true, token })
        // }
        // else {
        //     res.json({ success: false, message: "Invalid credentials" })
        // }

        if (user && isMatch) {
            res.status(201).json({
                success: true,
                _id: user._id,
                name: user.name,
                email: user.email,
                token: generateToken(user._id)
            });
        }
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// API to get user profile data
const getProfile = async (req, res) => {

    try {
        const { userId } = req.body;
        const userData = await userModel.findById(userId).select('-password');

        res.json({ success: true, userData });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

const verifyEmail = async (req, res) => {
    const { userId, otp } = req.body;

    if (!userId || !otp.trim()) {
        return res.status(400).json({ message: "Invalid request, missing parameters!" });
    };

    const user = await userModel.findById(userId).select('-password');

    if (!user) {
        return res.status(404).json({ success: false, message: "User Not Found" });
    }

    if (user.verified) {
        return res.status(400).json({ message: "This Account is Already verified" });
    }

    const token = await VerificationToken.findOne({ owner: user._id });

    if (!token) {
        return res.status(404).json({ success: false, message: "User Not Found" });
    }

    const isMatched = await token.matchToken(otp);

    if (!isMatched) {
        return res.status(404).json({ success: false, message: "OTP Is Wrong" });
    }

    user.verified = true;

    await VerificationToken.findByIdAndDelete(token._id);

    await user.save();

    transporter().sendMail({
        from: 'prabhatsahrawat010203@gmail.com',
        to: user.email,
        subject: "Verify your email account",
        html: plainEmailTemplate("Email Verified Succesfully", "Thanks for connecting with us "),
    });

    res.status(201).json({ success: true, message: "Your Email is Verified" })

};

const forgetPassword = async (req, res) => {

    const { email } = req.body;
    if (!email || !validator.isEmail(email)) {
        return res.status(404).json({ success: false, message: "Please Provide a valid email!" });
    };

    const user = await userModel.findOne({ email });

    if (!user) {
        return res.status(404).json({ success: false, message: "User not found, Invalid request" });
    };

    const token = await ResetToken.findOne({ owner: user._id });

    if (token) {
        return res.status(400).json({ success: false, message: "Only after one hour you can request for another token!" });
    };

    const generateToken = () => {
        return new Promise((resolve, reject) => {
            crypto.randomBytes(30, (err, buff) => {
                if (err) {
                    reject(err);
                    return;
                }

                const newToken = buff.toString('hex');
                resolve(newToken);
            });
        });
    };

    const newToken = await generateToken();
    const resetToken = new ResetToken({ owner: user._id, token: newToken });

    await resetToken.save();

    transporter().sendMail({
        from: 'prabhatsahrawat010203@gmail.com',
        to: user.email,
        subject: "Password Reset",
        html: generatePasswordResetTemplate(`http://localhost:3000/resetPassword?token=${newToken}&id=${user._id}`),
    });

    res.status(200).json({ success: true, message: "Password reset link is sent to your email" });

};

const resetPassword = async (req, res) => {
    const { password } = req.body;

    const user = await userModel.findById(req.user._id);
    if (!user) {
        return res.status(404).json({ success: false, message: "User not found, Invalid request" });
    };

    const isSamePassword = await user.matchPassword(password);
    if (isSamePassword) {
        return res.status(400).json({ success: false, message: "New password must be different" });
    };

    if (password.trim().length < 8 || password.trim().length > 20) {
        return res.status(400).json({ message: "Password must be 8 to 20 characters long!" });
    }

    user.password = password.trim();
    await user.save();

    await ResetToken.findOneAndDelete({ owner: user._id });

    transporter().sendMail({
        from: 'prabhatsahrawat010203@gmail.com',
        to: user.email,
        subject: "Password Reset Successfully",
        html: plainEmailTemplate("Password Reset Successfully", "Now you can login with new password"),
    });

    res.json({ success: true, message: "Password Reset Successfully" });
};

// API to update user profile
const updateProfile = async (req, res) => {

    try {

        const { userId, name, phone, address, dob, gender } = req.body
        const imageFile = req.file

        if (!name || !phone || !dob || !gender) {
            return res.json({ success: false, message: "Data Missing" })
        }

        const streamUpload = (fileBuffer) => {
            return new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(
                    { resource_type: "image" },
                    (error, result) => {
                        if (error) reject(error);
                        else resolve(result);
                    }
                );
                stream.end(fileBuffer); // Use buffer instead of pipe()
            });
        };

        if (imageFile) {
            console.log(imageFile.path);
            const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: "image" });
            // const imageUpload = await streamUpload(req.file.buffer);
            const imageURL = imageUpload.secure_url

            await userModel.findByIdAndUpdate(userId, { image: imageURL, name, phone, address: JSON.parse(address), dob, gender });

        } else {
            await userModel.findByIdAndUpdate(userId, { name, phone, address: JSON.parse(address), dob, gender });
        }

        res.json({ success: true, message: 'Profile Updated' })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to book Meeting 
const bookMeeting = async (req, res) => {

    try {

        const { userId, menId, slotDate, slotTime } = req.body
        const menData = await MentorModel.findById(menId).select("-password")

        if (!menData.available) {
            return res.json({ success: false, message: 'Mentor Not Available' })
        }

        let slots_booked = menData.slots_booked

        // checking for slot availablity 
        if (slots_booked[slotDate]) {
            if (slots_booked[slotDate].includes(slotTime)) {
                return res.json({ success: false, message: 'Slot Not Available' })
            }
            else {
                slots_booked[slotDate].push(slotTime)
            }
        } else {
            slots_booked[slotDate] = []
            slots_booked[slotDate].push(slotTime)
        }

        delete menData.slots_booked

        const MeetingData = {
            userId,
            menId,
            menData,
            amount: menData.fees,
            slotTime,
            slotDate,
            date: Date.now()
        }

        const newMeeting = new MeetingModel(MeetingData);
        await newMeeting.save();

        await MentorModel.findByIdAndUpdate(menId, { slots_booked })

        res.json({ success: true, message: 'Meeting Booked' })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }

}

// API to cancel Meeting
const cancelMeeting = async (req, res) => {
    try {

        const { userId, MeetingId } = req.body
        const MeetingData = await MeetingModel.findById(MeetingId)

        // verify Meeting user 
        if (MeetingData.userId !== userId) {
            return res.json({ success: false, message: 'Unauthorized action' })
        }

        await MeetingModel.findByIdAndUpdate(MeetingId, { cancelled: true })

        // releasing Mentor slot 
        const { menId, slotDate, slotTime } = MeetingData

        const MentorData = await MentorModel.findById(menId)

        let slots_booked = MentorData.slots_booked

        slots_booked[slotDate] = slots_booked[slotDate].filter(e => e !== slotTime)

        await MentorModel.findByIdAndUpdate(menId, { slots_booked })

        res.json({ success: true, message: 'Meeting Cancelled' })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to get user Meetings for frontend my-Meetings page
const listMeeting = async (req, res) => {
    try {

        const { userId } = req.body;
        const Meetings = await MeetingModel.find({
            userId,
        });

        console.log(Meetings)
        res.json({ success: true, Meetings })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to make payment of Meeting using razorpay
const paymentRazorpay = async (req, res) => {
    try {

        const { MeetingId } = req.body
        const MeetingData = await MeetingModel.findById(MeetingId)

        if (!MeetingData || MeetingData.cancelled) {
            return res.json({ success: false, message: 'Meeting Cancelled or not found' })
        }

        // creating options for razorpay payment
        const options = {
            amount: MeetingData.amount * 100,
            currency: process.env.CURRENCY,
            receipt: MeetingId,
        }

        // creation of an order
        const order = await razorpayInstance.orders.create(options)

        res.json({ success: true, order })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// // API to verify payment of razorpay
const verifyRazorpay = async (req, res) => {
    try {
        const { razorpay_order_id } = req.body
        const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id)

        if (orderInfo.status === 'paid') {
            await MeetingModel.findByIdAndUpdate(orderInfo.receipt, { payment: true })
            res.json({ success: true, message: "Payment Successful" })
        }
        else {
            res.json({ success: false, message: 'Payment Failed' })
        }
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// // API to make payment of Meeting using Stripe
// const paymentStripe = async (req, res) => {
//     try {

//         const { MeetingId } = req.body
//         const { origin } = req.headers

//         const MeetingData = await MeetingModel.findById(MeetingId)

//         if (!MeetingData || MeetingData.cancelled) {
//             return res.json({ success: false, message: 'Meeting Cancelled or not found' })
//         }

//         const currency = process.env.CURRENCY.toLocaleLowerCase()

//         const line_items = [{
//             price_data: {
//                 currency,
//                 product_data: {
//                     name: "Meeting Fees"
//                 },
//                 unit_amount: MeetingData.amount * 100
//             },
//             quantity: 1
//         }]

//         const session = await stripeInstance.checkout.sessions.create({
//             success_url: `${origin}/verify?success=true&MeetingId=${MeetingData._id}`,
//             cancel_url: `${origin}/verify?success=false&MeetingId=${MeetingData._id}`,
//             line_items: line_items,
//             mode: 'payment',
//         })

//         res.json({ success: true, session_url: session.url });

//     } catch (error) {
//         console.log(error)
//         res.json({ success: false, message: error.message })
//     }
// }

// const verifyStripe = async (req, res) => {
//     try {

//         const { MeetingId, success } = req.body

//         if (success === "true") {
//             await MeetingModel.findByIdAndUpdate(MeetingId, { payment: true })
//             return res.json({ success: true, message: 'Payment Successful' })
//         }

//         res.json({ success: false, message: 'Payment Failed' })

//     } catch (error) {
//         console.log(error)
//         res.json({ success: false, message: error.message })
//     }

// }

export {
    loginUser,
    registerUser,
    getProfile,
    updateProfile,
    bookMeeting,
    listMeeting,
    cancelMeeting,
    forgetPassword,
    verifyEmail,
    resetPassword,
    paymentRazorpay,
    verifyRazorpay,
    // paymentStripe,
    // verifyStripe
}