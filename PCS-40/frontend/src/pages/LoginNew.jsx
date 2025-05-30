import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import Loading from "../../components/Loading.js";
import ErrorMessage from "../../components/ErrorMessage.js";
import { login as logIn, register, forgotPassword } from "../../actions/userAction.js";


const Login = () => {

    const [login, setLogin] = useState(false);
    const [forgot, setforgot] = useState(false);
    const [error, setError] = useState("");

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [name, setName] = useState("");

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const userRegister = useSelector(state => state.userRegister);
    const { loading: registerLoading, error: registerError, userInfo: registerUserInfo } = userRegister;

    const userLogin = useSelector(state => state.userLogin);
    const { loading: loginLoading, error: loginError, userInfo: loginUserInfo } = userLogin;


    const userOtp = useSelector(state => state.userOtp);
    const { userInfo: otpUserInfo } = userOtp;

    const loading = loginLoading || registerLoading;

    // Use useEffect hook to update the error state when loginError or registerError changes
    useEffect(() => {
        if (loginError || registerError) {
            setError(loginError || registerError);
        } else {
            setError(""); // Clear the error state if both loginError and registerError are empty
        }
    }, [loginError, registerError]); // Dependencies array ensures that the effect runs when these values change

    const handleClose = () => {
        // Close the error message by setting errorMessage to null
        setError(null);
    };

    const userInfo = loginUserInfo || otpUserInfo;

    // console.log(registerUserInfo);

    useEffect(() => {
        if (userInfo) {
            navigate("/");
        } else if (registerUserInfo) {
            navigate("/verifyOtp");
        }
    }, [userInfo, navigate,registerUserInfo]);

    const postDetails = async (pics) => {

        if (!pics) {
            return setPicMessage("Please select a Image ")
        }
        setPicMessage(null);

        if (pics) {
            const data = new FormData();
            data.append("file", pics);
            data.append("upload_preset", "collegeSearch");
            data.append("cloud_name", "prabhat021");
            await fetch("https://api.cloudinary.com/v1_1/prabhat021/image/upload", {
                method: "post",
                body: data,
            }).then((res) => res.json())
                .then((data) => {
                    setPic(data.url.toString());
                    // console.log(pic);
                })
                .catch((err) => {
                    console.log(err);
                });
        } else {
            return setPicMessage("Please Select an Image");
        }
    }


    async function submitHandler(e) {
        e.preventDefault();

        if (login) {
            if (!email || !password) {
                setError("Please Provide All Details");
            } else {
                await dispatch(logIn(email, password));
            }
        } else if (forgot) {
            if (!email) {
                setError("Please Provide Email");
            } else {
                await dispatch(forgotPassword(email));
            }
        } else {
            if (!name || !email || !password) {
                setError("Please Provide All Details");
            } else if (password !== confirmPassword) {
                setError("Password dosen't Match");
            } else {
                await dispatch(register(name, email, password, pic))
            }
        }
    }

    return (
        <section className="bg-gray-50 dark:bg-gray-900">
            <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
                <a href="#" className="flex items-center mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
                    <img className="w-8 h-8 mr-2" src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/logo.svg" alt="logo" />
                    CollegeSearch
                </a>
                <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                    <div className="p-6 space-y-2 md:space-y-4 sm:p-8">
                        <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                            {login ? "" : forgot ? "" : registerUserInfo ? "Verify You Otp" : "Create your account"}
                        </h1>
                        {error && <ErrorMessage onClose={handleClose}>{error}</ErrorMessage>}
                        {loading && <Loading />}
                        {/* {registerUserInfo ? <OtpInput /> : */}
                        <form className="space-y-4 md:space-y-4" onSubmit={submitHandler}>
                            {(!login && !forgot) && (
                                <div>
                                    <label for="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your Name</label>
                                    <input type="name" name="name" id="name" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Enter name" required=""
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                    />
                                </div>
                            )}
                            <div>
                                <label for="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your email</label>
                                <input type="email" name="email" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="name@company.com" required=""
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            {(!forgot || login) && (
                                <div>
                                    <label for="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                                    <input type="password" name="password" id="password" placeholder="••••••••" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required=""
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>
                            )}
                            {(!login && !forgot) && (
                                <>
                                    <div>
                                        <label for="confirm-password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Confirm password</label>
                                        <input type="confirm-password" name="confirm-password" id="confirm-password" placeholder="••••••••" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required=""
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                        />
                                    </div>
                                    {picMessage && (
                                        <ErrorMessage variant="danger">{picMessage}</ErrorMessage>
                                    )}
                                    <div className="">
                                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white" for="file_input">Upload Profile Photo Or Default Pic</label>
                                        <input className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400" id="file_input" type="file"
                                            onChange={(e) => postDetails(e.target.files[0])}
                                        />
                                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-300" id="file_input_help">SVG, PNG, JPG or GIF (MAX. 800x400px).</p>

                                    </div>
                                </>
                            )}
                            {login && (
                                <div className="flex items-center justify-between">
                                    <a onClick={() => {
                                        setforgot(true);
                                        setLogin(false);
                                        setError(null);
                                    }} href="#" className="text-sm font-medium text-primary-600 hover:underline dark:text-primary-500">Forgot password?</a>
                                </div>
                            )}
                            <button type="submit" className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">{login ? "Login" : forgot ? "Submit" : "Create an account"}</button>
                            <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                                {login ? "Don't" : "Already"} have an account?
                                {login ?
                                    <a onClick={() => {
                                        setforgot(false);
                                        setLogin(false);
                                        setError(null);
                                    }} href="#" className="font-medium text-primary-600 hover:underline dark:text-primary-500">  Register here</a> :
                                    <a onClick={() => {
                                        setforgot(false);
                                        setLogin(true);
                                        setError(null);
                                    }} href="#" className="font-medium text-primary-600 hover:underline dark:text-primary-500">  Login here</a>}

                            </p>
                        </form>
                        {/* } */}
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Login;
