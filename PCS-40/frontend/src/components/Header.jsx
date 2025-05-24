import { assets } from "../assets/assets.js";
import { Link } from "react-router-dom";

const Header = () => {
    return (
        <div className="flex flex-col md:flex-row flex-wrap bg-primary rounded-3xl ">

            {/* --------- Header Left --------- */}
            <div className="md:w-1/2 flex flex-col items-center justify-center  gap-4 py-10 m-auto md:py-[10vw] md:mb-[-30px]">
                <p className="text-3xl md:text-4xl lg:text-5xl text-white font-semibold leading-tight md:leading-tight lg:leading-tight">
                    Unlock Your Future,<br />  with Expert Guidance
                </p>
                <div className="flex flex-col md:flex-row items-center gap-3 text-white text-sm font-light">
                    <img className="w-28" src={assets.group_profiles} alt="" />
                    <p>Explore a vast network of experienced mentors, gain valuable insights, <br className="hidden sm:block" /> and schedule your meetings effortlessly to shape a successful career path.</p>
                </div>
                <Link to="Mentors" className="flex items-center gap-2 bg-white px-8 py-3 rounded-full text-[#595959] text-sm m-auto md:m-0 hover:scale-105 transition-all duration-300">
                    Book Meeting <img className="w-3" src={assets.arrow_icon} alt="" />
                </Link>
            </div>

            {/* --------- Header Right --------- */}
            <div className="md:w-1/2 relative ">
                <img className="w-full md:absolute bottom-0 r-0 h-full rounded-br-3xl rounded-tr-3xl " src={assets.college_img} alt="" />
            </div>
        </div>
    )
}

export default Header;