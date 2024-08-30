import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoLogOutSharp } from "react-icons/io5";
import { IoMdArrowRoundBack } from "react-icons/io";
import { FaUser } from "react-icons/fa";
import { MdDashboard, MdNotificationsActive } from "react-icons/md";
import { PiBooksFill } from "react-icons/pi";
import { TiThMenu } from "react-icons/ti";
import Logo from "../../../assets/logo1.png";
import Styles from './SideNavAdmin.module.css';

interface SideNavItem {
  itemName: string;
  path: string;
}

const sideNavData: SideNavItem[] = [
  {
    itemName: "Analytic",
    path: "/analytics",
  },
  {
    itemName: "Student List",
    path: "/studentlist",
  },
  {
    itemName: "Add Student",
    path: "/addstudent",
  },
  {
    itemName: "Event List",
    path: "/eventlist",
  },
  {
    itemName: "Add Event",
    path: "/addevent",
  },
  {
    itemName: "Add Department",
    path: "/adddepartment",
  },
];

interface SideNavProps {
  children: React.ReactNode;
}

const SideNavAdmin: React.FC<SideNavProps> = ({ children }) => {
  const navigate = useNavigate();
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  const [userData, setUserData] = useState({ userName: "", email: "" });

  useEffect(() => {
    const storedUserData = sessionStorage.getItem("UserData");
    if (storedUserData) {
      const parsedUserData = JSON.parse(storedUserData);
      setUserData({
        userName: parsedUserData.userName,
        email: parsedUserData.email,
      });
    }
  }, []);

  const handleNavigate = (data: SideNavItem) => {
    navigate(data.path);
  };

  const toggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible);
  };

  const handleLogout = () => {
    sessionStorage.removeItem("MyToken");
    sessionStorage.removeItem("UserData");
    navigate("/Login");
  };

  return (
    <div className={Styles.container}>
      {isSidebarVisible && (
        <nav className={`${Styles.sidebar} col-md-3 col-lg-2 d-md-block`}>
          <div className={Styles.sticky}>
            <h2 className={`${Styles.title} text-white text-center py-4`}>LIBRARY MANAGEMENT</h2>
            <h3 className={`${Styles.username} text-white text-center`}>{userData.userName}</h3>
            <p className={`${Styles.useremail} text-white text-center`}>{userData.email}</p>
            <ul className={`nav flex-column`}>
              <li
                className={`${Styles.navItem} nav-item d-flex justify-content-start align-items-center`}
                onClick={() => navigate("/")}
              >
                <MdDashboard />
                <span className={`${Styles.navLink} nav-link active text-white`}>Dashboard</span>
              </li>
              <li
                className={`${Styles.navItem} nav-item d-flex justify-content-start align-items-center`}
                onClick={() => navigate("/listuser")}
              >
                <FaUser />
                <span className={`${Styles.navLink} nav-link active text-white`}>List of User</span>
              </li>
              <li
                className={`${Styles.navItem} nav-item d-flex justify-content-start align-items-center`}
                onClick={() => navigate("/listbooks")}
              >
                <PiBooksFill />
                <span className={`${Styles.navLink} nav-link text-white`}>List of Books</span>
              </li>
              {/* <li
                className={${Styles.navItem} nav-item d-flex justify-content-start align-items-center}
                onClick={() => navigate("/addgenres")}
              >
                <BiBookAdd />
                <span className={${Styles.navLink} nav-link text-white}>Add Genres</span>
              </li> */}
              <li
                className={`${Styles.navItem} nav-item d-flex justify-content-start align-items-center`}
                onClick={() => navigate("/request")}
              >
                <MdNotificationsActive />
                <span className={`${Styles.navLink} nav-link text-white`}>Requests</span>
              </li>
            </ul>
          </div>
        </nav>
      )}

      <div className={isSidebarVisible ? `${Styles.mainVisible} col-md-9 ms-sm-auto col-lg-10 p-0` : `${Styles.mainHidden} col-12 p-0`}>
        <div className={`${Styles.header} d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 border-bottom px-3`}>
          {isSidebarVisible ? (
            <IoMdArrowRoundBack className={Styles.iconnav} onClick={toggleSidebar} />
          ) : (
            <TiThMenu className={Styles.iconnav} onClick={toggleSidebar} />
          )}
          <img className={Styles.mainlogo} src={Logo} alt="Logo" />
          <button className={Styles.signoutbutton}>
            <IoLogOutSharp className={Styles.iconnav} onClick={handleLogout} />
          </button>
        </div>
      </div>
      <main className={isSidebarVisible ? `${Styles.contentVisible} col-md-9 ms-sm-auto col-lg-10 p-0` : `${Styles.contentHidden} col-12 p-0`}>
        {sideNavData.map((item) => (
          <div
            key={item.path}
            onClick={() => handleNavigate(item)}
          ></div>
        ))}
        {children}
      </main>
    </div>
  );
};

export default SideNavAdmin;
