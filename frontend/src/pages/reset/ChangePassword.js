import React from "react";
import { Form, Formik } from "formik";
import LoginInput from "../../components/inputs/loginInput";
import { Link } from "react-router-dom";
import * as Yup from "yup";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ChangePassword = ({
  password,
  setPassword,
  confirmPassword,
  setConfirmPassword,
  error,
  setError,
  userInfos,
  loading,
  setLoading,
}) => {
  const navigate = useNavigate();
  const validatePassword = Yup.object({
    password: Yup.string()
      .required(
        "Enter a combination of at least six numbers,letters and punctuation marks(such as ! and &)."
      )
      .min(6, "Password must be atleast 6 characters.")
      .max(36, "Password can't be more than 36 characters"),
    confirmPassword: Yup.string()
      .required("Confirm your password")
      .oneOf([Yup.ref("password")], "Passwords must match"),
  });
  const handleChangePassword = async () => {
    if (password !== confirmPassword) return;
    try {
      setLoading(true);
      await axios.post(`${process.env.REACT_APP_BACKEND_URL}/changePassword`, {
        email: userInfos.email,
        password,
      });
      setError("");
      navigate("/");
    } catch (error) {
      setLoading(false);
      setError(error.response.data.message);
    }
  };
  return (
    <div className="reset_form" style={{ height: "310px" }}>
      <div className="reset_form_header">Change Password</div>
      <div className="reset_form_text">Pick a strong password</div>
      <Formik
        enableReinitialize
        initialValues={{
          password,
          confirmPassword,
        }}
        validationSchema={validatePassword}
        onSubmit={() => handleChangePassword()}
      >
        {(formik) => (
          <Form>
            <LoginInput
              type="password"
              name="password"
              onChange={({ target: { value } }) => setPassword(value)}
              placeholder="New password"
            />
            <LoginInput
              type="password"
              name="confirmPassword"
              onChange={({ target: { value } }) => setConfirmPassword(value)}
              placeholder="Confirm new password"
              bottom
            />
            {error && <div className="error_text">{error}</div>}
            <div className="reset_form_btns">
              <Link className="gray_btn" to="/login">
                Cancel
              </Link>
              <button type="submit" className="blue_btn">
                Continue
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default ChangePassword;
