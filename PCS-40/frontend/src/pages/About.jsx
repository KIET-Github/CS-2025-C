import { assets } from "../assets/assets";

const About = () => {
  return (
    <div>

      <div className="text-center text-2xl pt-10 text-[#707070]">
        <p>ABOUT <span className="text-gray-700 font-semibold">US</span></p>
      </div>

      <div className="my-10 flex flex-col md:flex-row gap-12">
        <img className="w-full md:max-w-[360px]" src={assets.aboutus} alt="" />
        <div className="flex flex-col justify-center gap-6 md:w-2/4 text-sm text-gray-600">
          <p>At College Search, we believe that the right guidance at the right time can shape a student's future. Our platform is dedicated to providing comprehensive, reliable, and up-to-date information about Indian universities, courses, admissions, scholarships, and career opportunities..</p>
          <p>Thats why we have created a platform that brings together all the essential information about Indian universities into a single, user-friendly hub.</p>
          <b className="text-gray-800">Our Vision</b>
          <p>We aim to bridge the gap between students and higher education by offering trustworthy guidance and mentorship. Whether you’re a high school student exploring universities, a college student seeking career advice, or a professional looking for higher education options, we are here to guide you every step of the way.</p>
        </div>
      </div>

      <div className="text-xl my-4">
        <p>WHY  <span className="text-gray-700 font-semibold">CHOOSE US</span></p>
      </div>

      <div className="flex flex-col md:flex-row mb-20">
        <div className="border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-primary hover:text-white transition-all duration-300 text-gray-600 cursor-pointer">
          <b>EFFICIENCY:</b>
          <p>Integrated access to information on Indian universities and diverse mentorship opportunities to support your academic and career growth.</p>
        </div>
        <div className="border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-primary hover:text-white transition-all duration-300 text-gray-600 cursor-pointer">
          <b>CONVENIENCE: </b>
          <p>Access to a network of trusted mentors and comprehensive information on Indian universities to guide your academic and career journey.</p>
        </div>
        <div className="border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-primary hover:text-white transition-all duration-300 text-gray-600 cursor-pointer">
          <b>PERSONALIZATION:</b>
          <p >Personalized recommendations and timely reminders to help you navigate Indian universities and mentorship opportunities effectively.</p>
        </div>
      </div>

    </div>
  )
}

export default About
