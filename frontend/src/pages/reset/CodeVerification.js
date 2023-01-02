import React from "react";
import { Form, Formik } from "formik";
import LoginInput from "../../components/inputs/loginInput";
import { Link } from "react-router-dom";
import * as Yup from "yup";
import axios from "axios";

const CodeVerification = ({
  code,
  setCode,
  error,
  setError,
  setVisible,
  setLoading,
  userInfos,
}) => {
  const validateCode = Yup.object({
    code: Yup.string()
      .required("Enter a code that you've received on your Email.")
      .min(5, "Code must be 5 characters long.")
      .max(5, "Code must be 5 characters long."),
  });

  const verifyCode = async () => {
    try {
      setLoading(true);
      await axios.post(`${process.env.REACT_APP_BACKEND_URL}/validateResetCode`, {
        email: userInfos.email,
        code,
      });
      setVisible(3);
      setError(false);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setError(error.response.data.message);
    }
  };

  return (
    <div className="reset_form">
      <div className="reset_form_header">Code Verification</div>
      <div className="reset_form_text">Please enter a code that have been sent to your email</div>
      <Formik
        enableReinitialize
        initialValues={{
          code,
        }}
        validationSchema={validateCode}
        onSubmit={() => verifyCode()}
      >
        {(formik) => (
          <Form>
            <LoginInput
              type="text"
              name="code"
              onChange={({ target: { value } }) => setCode(value)}
              placeholder="Code"
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

export default CodeVerification;
