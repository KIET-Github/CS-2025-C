import { useContext, useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { AppContext } from "../context/AppContext"
import { assets } from "../assets/assets"
import RelatedMentors from "../components/RelatedMentors"
import axios from "axios"
import { toast } from "react-toastify"

const Meeting = () => {

    const { menId } = useParams();
    // console.log(menId);

    const { mentors, currencySymbol, backendUrl, token, getMentorData } = useContext(AppContext);
    const daysOfWeek = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

    const [menInfo, setMenInfo] = useState(false);
    const [menSlots, setMenSlots] = useState([]);
    const [slotIndex, setSlotIndex] = useState(0);
    const [slotTime, setSlotTime] = useState("");

    const navigate = useNavigate();

    const fetchMenInfo = async () => {
        const menInfo = mentors.find((men) => men._id === menId);
        setMenInfo(menInfo);
    }

    const getAvailableSolts = async () => {

        setMenSlots([])

        // getting current date
        let today = new Date()

        for (let i = 0; i < 7; i++) {

            // getting date with index 
            let currentDate = new Date(today)
            currentDate.setDate(today.getDate() + i)

            // setting end time of the date with index
            let endTime = new Date()
            endTime.setDate(today.getDate() + i)
            endTime.setHours(21, 0, 0, 0)

            // setting hours 
            if (today.getDate() === currentDate.getDate()) {
                currentDate.setHours(currentDate.getHours() > 10 ? currentDate.getHours() + 1 : 10)
                currentDate.setMinutes(currentDate.getMinutes() > 30 ? 30 : 0)
            } else {
                currentDate.setHours(10)
                currentDate.setMinutes(0)
            }

            let timeSlots = [];


            while (currentDate < endTime) {
                let formattedTime = currentDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

                let day = currentDate.getDate()
                let month = currentDate.getMonth() + 1
                let year = currentDate.getFullYear()

                const slotDate = day + "_" + month + "_" + year
                const slotTime = formattedTime

                const isSlotAvailable = menInfo.slots_booked[slotDate] && menInfo.slots_booked[slotDate].includes(slotTime) ? false : true

                if (isSlotAvailable) {

                    // Add slot to array
                    timeSlots.push({
                        datetime: new Date(currentDate),
                        time: formattedTime
                    })
                }

                // Increment current time by 30 minutes
                currentDate.setMinutes(currentDate.getMinutes() + 30);
            }

            setMenSlots(prev => ([...prev, timeSlots]))

        }

    }

    const bookMeeting = async () => {

        if (!token) {
            toast.warning("Login to book Meeting")
            return navigate("/login")
        }

        const date = menSlots[slotIndex][0].datetime

        let day = date.getDate()
        let month = date.getMonth() + 1
        let year = date.getFullYear()

        const slotDate = day + "_" + month + "_" + year

        try {

            const { data } = await axios.post(backendUrl + "/api/user/book-Meeting", { menId, slotDate, slotTime }, { headers: { token } })
            if (data.success) {
                toast.success(data.message)
                getMentorData()
                navigate("/my-Meetings")
            } else {
                toast.error(data.message)
            }

        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }

    }

    useEffect(() => {
        if (mentors.length > 0) {
            fetchMenInfo()
        }
    }, [mentors, menId])

    useEffect(() => {
        if (menInfo) {
            getAvailableSolts()
        }
    }, [menInfo])

    return menInfo ? (
        <div>

            {/* ---------- Mentor Details ----------- */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div>
                    <img className="bg-primary w-full sm:max-w-72 rounded-lg" src={menInfo.image} alt="" />
                </div>

                <div className="flex-1 border border-[#ADADAD] rounded-lg p-8 py-7 bg-white mx-2 sm:mx-0 mt-[-80px] sm:mt-0">

                    {/* ----- Doc Info : name, degree, experience ----- */}

                    <p className="flex items-center gap-2 text-3xl font-medium text-gray-700">{menInfo.name} <img className="w-5" src={assets.verified_icon} alt="" /></p>
                    <div className="flex items-center gap-2 mt-1 text-gray-600">
                        <p>{menInfo.degree} - {menInfo.speciality}</p>
                        <button className="py-0.5 px-2 border text-xs rounded-full">{menInfo.experience}</button>
                    </div>

                    {/* ----- Doc About ----- */}
                    <div>
                        <p className="flex items-center gap-1 text-sm font-medium text-[#262626] mt-3">About <img className="w-3" src={assets.info_icon} alt="" /></p>
                        <p className="text-sm text-gray-600 max-w-[700px] mt-1">{menInfo.about}</p>
                    </div>

                    <p className="text-gray-600 font-medium mt-4">Meeting fee: <span className="text-gray-800">{currencySymbol}{menInfo.fees}</span> </p>
                </div>
            </div>

            {/* Booking slots */}
            <div className="sm:ml-72 sm:pl-4 mt-8 font-medium text-[#565656]">
                <p >Booking slots</p>
                <div className="flex gap-3 items-center w-full overflow-x-scroll mt-4">
                    {menSlots.length && menSlots.map((item, index) => (
                        <div onClick={() => setSlotIndex(index)} key={index} className={`text-center py-6 min-w-16 rounded-full cursor-pointer ${slotIndex === index ? "bg-primary text-white" : "border border-[#DDDDDD]"}`}>
                            <p>{item[0] && daysOfWeek[item[0].datetime.getDay()]}</p>
                            <p>{item[0] && item[0].datetime.getDate()}</p>
                        </div>
                    ))}
                </div>

                <div className="flex items-center gap-3 w-full overflow-x-scroll mt-4">
                    {menSlots.length && menSlots[slotIndex].map((item, index) => (
                        <p onClick={() => setSlotTime(item.time)} key={index} className={`text-sm font-light  flex-shrink-0 px-5 py-2 rounded-full cursor-pointer ${item.time === slotTime ? "bg-primary text-white" : "text-[#949494] border border-[#B4B4B4]"}`}>{item.time.toLowerCase()}</p>
                    ))}
                </div>

                <button onClick={bookMeeting} className="bg-primary text-white text-sm font-light px-20 py-3 rounded-full my-6">Book an Meeting</button>
            </div>

            {/* Listing Releated Mentors */}
            <RelatedMentors speciality={menInfo.speciality} menId={menId} />
        </div>
    ) : null
}

export default Meeting;