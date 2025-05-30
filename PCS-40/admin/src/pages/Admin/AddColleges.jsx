import { useContext, useState } from "react";
import { assets } from "../../assets/assets";
import { toast } from "react-toastify";
import axios from "axios";
import { AdminContext } from "../../context/AdminContext";
import { AppContext } from "../../context/AppContext";

const AddCollege = () => {

    const [docImg, setDocImg] = useState(false);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [experience, setExperience] = useState("");
    const [star, setStar] = useState("1 Stars");
    const [fees, setFees] = useState("");
    const [appFees, setAppFees] = useState("");
    const [about, setAbout] = useState("");
    const [speciality, setSpeciality] = useState("Law");
    const [state, setState] = useState("Haryana");
    const [city, setCity] = useState("Gurgaoan");
    const [studentFacultyRatio, setStudentFacultyRatio] = useState("10");
    const [address1, setAddress1] = useState("");
    const [address2, setAddress2] = useState("");

    const { backendUrl } = useContext(AppContext);
    const { aToken } = useContext(AdminContext);

    const onSubmitHandler = async (event) => {
        event.preventDefault()

        try {

            if (!docImg) {
                return toast.error("Image Not Selected");
            }

            const formData = new FormData();

            // Appending existing form data
            formData.append("image", docImg);
            formData.append("name", name);
            formData.append("email", email);
            formData.append("experience", experience);
            formData.append("fees", Number(fees));
            formData.append("appFees", Number(appFees));
            formData.append("about", about);
            formData.append("speciality", speciality);
            formData.append("address", JSON.stringify({ line1: address1, line2: address2 }));
            formData.append("star", star);
            formData.append("state", state);
            formData.append("city", city);
            formData.append("studentFacultyRatio", studentFacultyRatio);
            // console log formData            
            formData.forEach((value, key) => {
                console.log(`${key}: ${value}`);
            });

            // Sending POST request
            const { data } = await axios.post(backendUrl + "/api/admin/add-College", formData, { headers: { aToken } });

            if (data.success) {
                toast.success(data.message);
                setDocImg(false);
                setName("");
                setEmail("");
                setStar("1 Stars");
                setFees("");
                setAppFees("");
                setAbout("");
                setSpeciality("Law");
                setState("Haryana");
                setCity("Gurgaon");
                setStudentFacultyRatio("10");
                setAddress1("");
                setAddress2("");
            } else {
                toast.error(data.message);
            }

        } catch (error) {
            toast.error(error.message);
            console.log(error);
        }
    }

    return (
        <form onSubmit={onSubmitHandler} className="m-5 w-full">

            <p className="mb-3 text-lg font-medium">Add College</p>

            <div className="bg-white px-8 py-8 border rounded w-full max-w-4xl max-h-[80vh] overflow-y-scroll">
                <div className="flex items-center gap-4 mb-8 text-gray-500">
                    <label htmlFor="doc-img">
                        <img className="w-16 bg-gray-100 rounded-full cursor-pointer" src={docImg ? URL.createObjectURL(docImg) : assets.upload_area} alt="" />
                    </label>
                    <input onChange={(e) => setDocImg(e.target.files[0])} type="file" name="" id="doc-img" hidden />
                    <p>Upload College <br /> picture</p>
                </div>

                <div className="flex flex-col lg:flex-row items-start gap-10 text-gray-600">

                    <div className="w-full lg:flex-1 flex flex-col gap-4">

                        <div className="flex-1 flex flex-col gap-1">
                            <p>College name</p>
                            <input onChange={e => setName(e.target.value)} value={name} className="border rounded px-3 py-2" type="text" placeholder="Name" required />
                        </div>

                        <div className="flex-1 flex flex-col gap-1">
                            <p>College Email</p>
                            <input onChange={e => setEmail(e.target.value)} value={email} className="border rounded px-3 py-2" type="email" placeholder="Email" required />
                        </div>

                        <div className="flex-1 flex flex-col gap-1">
                            <p>Established </p>
                            <input onChange={e => setExperience(e.target.value)} value={experience} className="border rounded px-3 py-2" type="number" placeholder="Year" required />
                        </div>

                        <div className="flex-1 flex flex-col gap-1">
                            <p>Rating</p>
                            <select onChange={e => setStar(e.target.value)} value={star} className="border rounded px-2 py-2" >
                                <option value="">Select Star Rating</option>
                                <option value="1 Star">1 Stars</option>
                                <option value="2 Star">2 Stars</option>
                                <option value="3 Star">3 Stars</option>
                                <option value="4 Star">4 Stars</option>
                                <option value="5 Star">5 Stars</option>
                                <option value="6 Star">6 Stars</option>
                                <option value="8 Star">8 Stars</option>
                                <option value="9 Star">9 Stars</option>
                                <option value="10 Star">10 Stars</option>
                            </select>
                        </div>

                        <div className="flex-1 flex flex-col gap-1">
                            <p>Application Fees</p>
                            <input onChange={e => setAppFees(e.target.value)} value={appFees} className="border rounded px-3 py-2" type="number" placeholder="Application fees" required />
                        </div>

                        <div className="flex-1 flex flex-col gap-1">
                            <p>Course Fees</p>
                            <input onChange={e => setFees(e.target.value)} value={fees} className="border rounded px-3 py-2" type="number" placeholder="College fees" required />
                        </div>

                    </div>

                    <div className="w-full lg:flex-1 flex flex-col gap-4">

                        <div className="flex-1 flex flex-col gap-1">
                            <p>Speciality</p>
                            <select onChange={e => setSpeciality(e.target.value)} value={speciality} className="border rounded px-2 py-2">
                                <option value="">Select Speciality</option>
                                <option value="Engineering">Engineering</option>
                                <option value="Medical">Medical</option>
                                <option value="Business/Management">Business & Management</option>
                                <option value="Law">Law</option>
                                <option value="Arts & Humanities">Arts & Humanities</option>
                                <option value="Science & Technology">Science & Technology</option>
                                <option value="Design & Architecture">Design & Architecture</option>
                            </select>
                        </div>


                        <div className="flex-1 flex flex-col gap-1">
                            <p>State</p>
                            <select onChange={e => setState(e.target.value)} value={state} className="border rounded px-2 py-2">
                                <option value="">Select State</option>
                                <option value="Andhra Pradesh">Andhra Pradesh</option>
                                <option value="Telangana">Telangana</option>
                                <option value="Punjab">Punjab</option>
                                <option value="Gujarat">Gujarat</option>
                                <option value="Tamil Nadu">Tamil Nadu</option>
                                <option value="West Bengal">West Bengal</option>
                                <option value="Kerala">Kerala</option>
                                <option value="Uttar Pradesh">Uttar Pradesh</option>
                                <option value="Karnataka">Karnataka</option>
                                <option value="Bihar">Bihar</option>
                                <option value="Assam">Assam</option>
                                <option value="Madhya Pradesh">Madhya Pradesh</option>
                                <option value="Chhatisgarh">Chhatisgarh</option>
                                <option value="Himachal Pradesh">Himachal Pradesh</option>
                                <option value="Odisha">Odisha</option>
                                <option value="Haryana">Haryana</option>
                                <option value="Maharashtra">Maharashtra</option>
                                <option value="Delhi">Delhi</option>
                                <option value="Jharkhand">Jharkhand</option>
                                <option value="Rajasthan">Rajasthan</option>
                                <option value="Lakshadweep">Lakshadweep</option>
                                <option value="Sikkim">Sikkim</option>
                                <option value="Manipur">Manipur</option>
                                <option value="Tripura">Tripura</option>
                                <option value="Meghalaya">Meghalaya</option>
                                <option value="Arunachal Pradesh">Arunachal Pradesh</option>
                                <option value="Mizoram">Mizoram</option>
                                <option value="Uttrakhand">Uttrakhand</option>
                                <option value="Goa">Goa</option>
                                <option value="Dadra & Nagar Haveli">Dadra & Nagar Haveli</option>
                                <option value="Daman & Diu">Daman & Diu</option>
                                <option value="Chandigarh">Chandigarh</option>
                                <option value="Nagaland">Nagaland</option>
                                <option value="Jammu and Kashmir">Jammu and Kashmir</option>
                                <option value="Puducherry">Puducherry</option>
                                <option value="Andaman & Nicobar Islands">Andaman & Nicobar Islands</option>
                            </select>
                        </div>

                        <div className="flex-1 flex flex-col gap-1">
                            <p>City</p>
                            <input onChange={e => setCity(e.target.value)} value={city} className="border rounded px-3 py-2" type="text" placeholder="City" required />
                        </div>

                        <div className="flex-1 flex flex-col gap-1">
                            <p>Student-Faculty Ratio</p>
                            <select onChange={e => setStudentFacultyRatio(e.target.value)} value={studentFacultyRatio} className="border rounded px-2 py-2">
                                <option value="">Select Ratio</option>
                                <option value="10">10</option>
                                <option value="20">20</option>
                                <option value="30">30</option>
                                <option value="40">40</option>
                                <option value="50">50</option>
                                <option value="60">60</option>
                                <option value="70">70</option>
                            </select>
                        </div>

                        <div className="flex-1 flex flex-col gap-1">
                            <p>Address</p>
                            <input onChange={e => setAddress1(e.target.value)} value={address1} className="border rounded px-3 py-2" type="text" placeholder="Address 1" required />
                            <input onChange={e => setAddress2(e.target.value)} value={address2} className="border rounded px-3 py-2" type="text" placeholder="Address 2" required />
                        </div>

                    </div>

                </div>

                <div>
                    <p className="mt-4 mb-2">About College</p>
                    <textarea onChange={e => setAbout(e.target.value)} value={about} className="w-full px-4 pt-2 border rounded" rows={5} placeholder="write about College"></textarea>
                </div>

                <button type="submit" className="bg-primary px-10 py-3 mt-4 text-white rounded-full">Add College</button>

            </div>


        </form>
    )
}

export default AddCollege;
