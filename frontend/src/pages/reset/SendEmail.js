import axios from "axios";
import React from "react";
import { Link } from "react-router-dom";

const SendEmail = ({ user, setVisible, userInfos, setError, setLoading, error }) => {
  const sendEmail = async () => {
    try {
      setLoading(true);
      await axios.post(`${process.env.REACT_APP_BACKEND_URL}/sendResetPasswordCode`, {
        email: userInfos.email,
      });
      setError("");
      setLoading(false);
      setVisible(2);
    } catch (error) {
      setError(error.response.data.message);
      setLoading(false);
    }
  };
  return (
    <div className="reset_form dynamic_height">
      <div className="reset_form_header">Reset Your Account</div>
      <div className="reset_grid">
        <div className="reset_left">
          <div className="reset_form_text">
            How do you want to receive the code to reset your password?
          </div>
          <label htmlFor="email">
            <input type="radio" name="email" id="email" checked readOnly />
            <div className="label_col">
              <span>Send code via email</span>
              <span>{userInfos?.email}</span>
            </div>
          </label>
        </div>
        <div className="reset_right">
          <img src={userInfos?.picture} alt="user" />
          <span>{userInfos?.email}</span>
          <span>Facebook user</span>
        </div>
      </div>
      {error && (
        <div className="error_text" style={{ padding: "10px" }}>
          {error}
        </div>
      )}
      <div className="reset_form_btns">
        <Link className="gray_btn" to="/login">
          Cancel
        </Link>
        <button onClick={() => sendEmail()} className="blue_btn">
          Send
        </button>
      </div>
    </div>
  );
};

export default SendEmail;
