import axios from "axios";
import { useContext, useEffect } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";

const Verify = () => {

    const [searchParams, setSearchParams] = useSearchParams()

    const success = searchParams.get("success")
    const MeetingId = searchParams.get("MeetingId")

    const { backendUrl, token } = useContext(AppContext)

    const navigate = useNavigate()

    // Function to verify stripe payment
    const verifyStripe = async () => {

        try {

            const { data } = await axios.post(backendUrl + "/api/user/verifyStripe", { success, MeetingId }, { headers: { token } })

            if (data.success) {
                toast.success(data.message)
            } else {
                toast.error(data.message)
            }

            navigate("/my-Meetings")

        } catch (error) {
            toast.error(error.message)
            console.log(error)
        }

    }

    useEffect(() => {
        if (token, MeetingId, success) {
            verifyStripe()
        }
    }, [token])

    return (
        <div className="min-h-[60vh] flex items-center justify-center">
            <div className="w-20 h-20 border-4 border-gray-300 border-t-4 border-t-primary rounded-full animate-spin"></div>
        </div>
    )
}

export default Verify;