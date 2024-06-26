import { useEffect, useState } from "react";
import { GoSidebarCollapse } from "react-icons/go";
import { FaHome, FaChalkboardTeacher, FaBookOpen, FaChevronDown, FaChevronUp } from "react-icons/fa";
import { Link } from "react-router-dom";
import { SiStudyverse } from "react-icons/si";
import useClassStore from "@/store/classStore";

const HomeSidebar = () => {
    const { teachingClasses, enrolledClasses, fetchTeachingClasses, fetchEnrolledClasses,fetchClassMembers   } = useClassStore();
    const fetchUserRoleInClass = useClassStore((state) => state.fetchUserRoleInClass);
    const fetchClassroomById = useClassStore((state) => state.fetchClassroomById);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isTeachingOpen, setIsTeachingOpen] = useState(false);
    const [isEnrolledOpen, setIsEnrolledOpen] = useState(false);
    const current_user = localStorage.getItem("User");

    useEffect(() => {
        fetchTeachingClasses();
        fetchEnrolledClasses();
        fetchClassMembers();
    
      }, [current_user]);
    

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const toggleTeachingDropdown = () => {
        setIsTeachingOpen(!isTeachingOpen);
    };

    const toggleEnrolledDropdown = () => {
        setIsEnrolledOpen(!isEnrolledOpen);
    };


    return (
        <div className="flex">
            <div className={` ${isSidebarOpen ? "w-72" : "w-20 "} bg-[#2E3748] h-min-screen p-5 pt-8 relative duration-300`}>
                <GoSidebarCollapse 
                    className={`absolute cursor-pointer text-white -right-3 top-9 w-10 h-10 ${!isSidebarOpen && "rotate-180"}`} 
                    onClick={toggleSidebar} 
                />
                <div className="flex gap-x-4 items-center">
                <SiStudyverse className=" text-white w-9 h-10" />

                    <h1 className={`text-white origin-left font-medium text-2xl duration-200 ${!isSidebarOpen && "scale-0"}`}>
                        SmartClass
                    </h1>
                </div>
                <ul className="pt-6">
                    <li className="flex rounded-md p-2 cursor-pointer hover:bg-[#39425A] text-gray-300 text-sm items-center gap-x-4">
                        
                        <div  className="flex rounded-md p-1  cursor-pointer hover:bg-[#39425A] text-gray-300 text-sm items-center gap-x-4 justify-between">
                            <div className="flex items-center gap-x-4">
                            <FaHome className="w-8 h-8"/>
                                <Link to={'/h'} className={`${!isSidebarOpen && "hidden"} origin-left text-2xl duration-200`}>Home</Link>
                            </div>
                        </div>
                    </li>

                    <li className="flex flex-col">
                        <div onClick={toggleTeachingDropdown} className="flex rounded-md p-2 mt-4 cursor-pointer hover:bg-[#39425A] text-gray-300 text-sm items-center gap-x-4 justify-between">
                            <div className="flex items-center gap-x-4">
                                <FaChalkboardTeacher className="w-8 h-8"/>
                                <span className={`${!isSidebarOpen && "hidden"} origin-left text-2xl duration-200`}>Teaching</span>
                            </div>
                            {isTeachingOpen ? <FaChevronUp /> : <FaChevronDown />}
                        </div>
                        {isTeachingOpen && isSidebarOpen && (
                            <>
                            {teachingClasses && (
                                <>
                                        {teachingClasses.length>0 && (
                                <>
                                    <div className="ml-6 mt-2 space-y-2">
                                    {teachingClasses.map((classroom) => (
                                        <div  className="cursor-pointer p-2 hover:bg-[#39425A] rounded">
                                            <p className="text-white text-xl">{classroom.title}</p>
                                        </div>
                                        ))}
                                        
                                    </div>
                                </>
                            )}
                                
                                
                                </>
                            )}
                            </>
                        )}
                    </li>

                    <li className="flex flex-col">
                        <div onClick={toggleEnrolledDropdown} className="flex rounded-md p-2 mt-4 cursor-pointer hover:bg-[#39425A] text-gray-300 text-sm items-center gap-x-4 justify-between">
                            <div className="flex items-center gap-x-4">
                                <FaBookOpen className="w-8 h-8"/>
                                <span className={`${!isSidebarOpen && "hidden"} origin-left text-2xl duration-200`}>Enrolled</span>
                            </div>
                            {isEnrolledOpen ? <FaChevronUp /> : <FaChevronDown />}
                        </div>
                        {isEnrolledOpen && isSidebarOpen && (
                            <>
                            {enrolledClasses && (
                                <>
                                        {enrolledClasses.length>0 && (
                                <div className="ml-6 mt-2 space-y-2">
                                    {enrolledClasses.map((classroom) => (
                                        <div  className="cursor-pointer p-2 hover:bg-[#39425A] rounded">
                                            <p className="text-white text-xl">{classroom.title}</p>
                                        </div>
                                        ))}
                                </div>
                            )}
                                </>

                            )}
                            </>
                        )}
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default HomeSidebar;
