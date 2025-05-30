import { useEffect, useRef, useState, useContext } from "react";
import Loading from "./Loading.jsx";
import { AppContext } from "../context/AppContext.jsx";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function OtpInput() {
    const [otp, setOtp] = useState("");

    const navigate = useNavigate();

    const { otpSent, loading, userData, verifyOtp, verfied } = useContext(AppContext);
    console.log(userData);
    console.log(otpSent);

    const inputRefs = useRef([]);

    const handleChange = (index, e) => {
        const input = e.target;
        const value = input.value;

        let newOtp = otp;
        newOtp = newOtp.substr(0, index) + value + newOtp.substr(index + 1);
        setOtp(newOtp);

        // Move to the next input field if current input is filled
        if (value && index < inputRefs.current.length - 1) {
            inputRefs.current[index + 1].focus();
        }
    };

    const handleKeyDown = (index, e) => {
        const input = e.target;
        const value = input.value;

        // Move to the previous input field if Backspace is pressed on an empty input
        if (e.key === 'Backspace' && !value && index > 0) {
            inputRefs.current[index - 1].focus();
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (otp.length !== 4) {
            toast.error("Invalid request, missing parameters!");
        } else {
            await verifyOtp(userData._id, otp);
        }
    };

    useEffect(() => {
        if (!otpSent) navigate("/");
    }, [otpSent]);

    useEffect(() => {
        if (verfied) {
            navigate("/");
        }
    }, [verfied]);

    return (
        otpSent ?
            <section className="relative flex min-h-screen flex-col justify-center overflow-hidden  py-12">
                <div className="relative bg-white px-6 pt-10 pb-9 shadow-xl mx-auto w-full max-w-lg rounded-2xl">
                    <div className="mx-auto flex w-full max-w-md flex-col space-y-16">
                        <div className="flex flex-col items-center justify-center text-center space-y-2">
                            <div className="font-semibold text-3xl">
                                <p>Email Verification</p>
                            </div>
                            <div className="flex flex-row text-sm font-medium text-gray-400">
                                <p>We have sent a code to your email <span className="font-bold">{userData.email}</span></p>
                            </div>
                        </div>

                        <div>
                            {loading && <Loading />}
                            <form onSubmit={handleSubmit}>
                                <div className="flex flex-col space-y-16">
                                    <div className="flex flex-row items-center justify-between mx-auto w-full max-w-xs">
                                        {[...Array(4)].map((_, index) => (
                                            <div className="w-16 h-16" key={index}>
                                                <input
                                                    ref={el => (inputRefs.current[index] = el)}
                                                    className="w-full h-full flex flex-col items-center justify-center text-center px-5 outline-none rounded-xl border border-gray-200 text-lg bg-white focus:bg-gray-50 focus:ring-1 ring-blue-700"
                                                    type="text"
                                                    maxLength={1}
                                                    onChange={e => handleChange(index, e)}
                                                    onKeyDown={e => handleKeyDown(index, e)}
                                                />
                                            </div>
                                        ))}
                                    </div>

                                    <div className="flex flex-col space-y-5">
                                        <div>
                                            <button className="flex flex-row items-center justify-center text-center w-full border rounded-xl outline-none py-5 bg-blue-700 border-none text-white text-sm shadow-sm">
                                                Verify Account
                                            </button>
                                        </div>

                                        <div className="flex flex-row items-center justify-center text-center text-sm font-medium space-x-1 text-gray-500">
                                            <p>Didn't recieve code?</p> <a className="flex flex-row items-center text-blue-600" href="http://" target="_blank" rel="noopener noreferrer">Resend</a>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
            : <Loading />
    )
}
