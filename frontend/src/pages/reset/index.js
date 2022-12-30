import Cookies from "js-cookie";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { Form, Formik } from "formik";
import LoginInput from "../../components/inputs/loginInput";
import SearchAccount from "./SearchAccount";
import "./style.css";
import SendEmail from "./SendEmail";
import CodeVerification from "./CodeVerification";
import Footer from "../../components/login/Footer";

const Reset = () => {
  const user = useSelector((state) => state.user);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [visible, setVisible] = useState(2);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const logout = () => {
    Cookies.set("user", "");
    dispatch({
      type: "LOGOUT",
    });
    navigate("/login");
  };
  return (
    <div className="reset">
      <div className="reset_header">
        <img src="../../../icons/facebook.svg" alt="facebook" />
        {user ? (
          <div className="right_reset">
            <Link to="/profile">
              <img src={user.picture} alt="user" />
            </Link>
            <button onClick={() => logout()} className="blue_btn">
              Logout
            </button>
          </div>
        ) : (
          <Link to="/login" className="right_reset">
            <button className="blue_btn">Login</button>
          </Link>
        )}
      </div>
      <div className="reset_wrap">
        {visible === 0 && <SearchAccount email={email} setEmail={setEmail} error={error} />}
        {visible === 1 && <SendEmail user={user} />}
        {visible === 2 && <CodeVerification code={code} setCode={setCode} error={error} />}
      </div>
      <Footer />
    </div>
  );
};

export default Reset;
