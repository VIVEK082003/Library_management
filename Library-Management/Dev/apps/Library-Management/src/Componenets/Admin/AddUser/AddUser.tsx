import React, { useState, ChangeEvent, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import Styles from "./AddUser.module.css";

interface FormData {
  userName: string;
  email: string;
  password: string;
  isAdmin: boolean;
}

const AddUser: React.FC = () => {
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  const [formData, setFormData] = useState<FormData>({
    userName: "",
    email: "",
    password: "",
    isAdmin: false,
  });
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:14668/api/Users/Register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        navigate("/listuser");
      } else {
        // Handle error response
        console.error("Registration failed");
      }
    } catch (error) {
      console.error("Error during registration:", error);
    }
  };

  return (
    <>
      <section className={Styles.adduser}>
        <div className={Styles.adduserwrapper}>
          <div className={Styles.adduserformbox}>
            <form onSubmit={handleSubmit}>
              <h1>ADD USER</h1>
              <div className="row">
                <div className={`col-lg-12 ${Styles.adduserinputbox}`}>
                  <div>
                    <span>User-Name :</span>
                    <input
                      type="text"
                      name="userName"
                      placeholder="User-Name"
                      value={formData.userName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
              </div>
              <div className="row">
                <div className={`col-lg-6 ${Styles.adduserinputbox}`}>
                  <div>
                    <span>Email :</span>
                    <input
                      type="email"
                      name="email"
                      placeholder="Email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                <div className={`col-lg-6 ${Styles.adduserinputbox}`}>
                  <div>
                    <span>Password :</span>
                    <input
                      type="password"
                      name="password"
                      placeholder="Password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
              </div>
              <div className="row">
                <div className={`col-lg-12 ${Styles.adduserinputbox}`}>
                  <div>
                    <span>Admin :</span>
                    <input
                      type="checkbox"
                      name="isAdmin"
                      checked={formData.isAdmin}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>
              <button className={Styles.adduserbtn} type="submit">
                ADD USER
              </button>
            </form>
          </div>
        </div>
      </section>
    </>
  );
};

export default AddUser;
