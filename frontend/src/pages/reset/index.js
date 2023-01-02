import Cookies from "js-cookie";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import SearchAccount from "./SearchAccount";
import "./style.css";
import SendEmail from "./SendEmail";
import CodeVerification from "./CodeVerification";
import Footer from "../../components/login/Footer";
import ChangePassword from "./ChangePassword";

const Reset = () => {
  const user = useSelector((state) => state.user);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(0);
  const [userInfos, setUserInfos] = useState("");
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
        {visible === 0 && (
          <SearchAccount
            email={email}
            setEmail={setEmail}
            error={error}
            setLoading={setLoading}
            setError={setError}
            setUserInfos={setUserInfos}
            setVisible={setVisible}
          />
        )}
        {visible === 1 && userInfos && (
          <SendEmail
            user={user}
            setVisible={setVisible}
            userInfos={userInfos}
            setError={setError}
            setLoading={setLoading}
            email={email}
            error={error}
          />
        )}
        {visible === 2 && (
          <CodeVerification
            code={code}
            setCode={setCode}
            error={error}
            setError={setError}
            setVisible={setVisible}
            setLoading={setLoading}
            userInfos={userInfos}
          />
        )}
        {visible === 3 && (
          <ChangePassword
            password={password}
            confirmPassword={confirmPassword}
            setPassword={setPassword}
            setConfirmPassword={setConfirmPassword}
            error={error}
            setError={setError}
            userInfos={userInfos}
            loading={loading}
            setLoading={setLoading}
          />
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Reset;
