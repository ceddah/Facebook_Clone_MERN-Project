import React from "react";
import { Link } from "react-router-dom";

const SendEmail = ({ user }) => {
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
              <span>asdsad242k@gmail.com</span>
            </div>
          </label>
        </div>
        <div className="reset_right">
          <img src={user?.picture} alt={user?.first_name} />
          <span>asdsad242k@gmail.com</span>
          <span>Facebook user</span>
        </div>
      </div>
      <div className="reset_form_btns">
        <Link className="gray_btn" to="/login">
          Cancel
        </Link>
        <button type="submit" className="blue_btn">
          Search
        </button>
      </div>
    </div>
  );
};

export default SendEmail;
