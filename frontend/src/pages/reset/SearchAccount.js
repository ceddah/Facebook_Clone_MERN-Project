import React from "react";
import { Form, Formik } from "formik";
import LoginInput from "../../components/inputs/loginInput";
import { Link } from "react-router-dom";
import * as Yup from "yup";
import axios from "axios";

const SearchAccount = ({
  email,
  setEmail,
  setLoading,
  error,
  setError,
  setUserInfos,
  setVisible,
}) => {
  const validateEmail = Yup.object({
    email: Yup.string()
      .required("Email address is required.")
      .email("Must be valid Email address")
      .max(50, "Email address must be maximum of 50 characters"),
  });
  const handleSearch = async () => {
    try {
      setLoading(true);
      const { data } = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/findUser`, { email });
      setUserInfos(data);
      setVisible(1);
      setError("");
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setError(error.response.data.message);
    }
  };
  return (
    <div className="reset_form">
      <div className="reset_form_header">Find Your Account</div>
      <div className="reset_form_text">
        Please enter your email address or phone number to search for your account.
      </div>
      <Formik
        enableReinitialize
        initialValues={{
          email,
        }}
        validationSchema={validateEmail}
        onSubmit={() => {
          handleSearch();
        }}
      >
        {(formik) => (
          <Form>
            <LoginInput
              type="text"
              name="email"
              // onChange={({ target: { value } }) => setEmail((a) => a + value)}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address or phone number"
            />
            {error && <div className="error_text">{error}</div>}
            <div className="reset_form_btns">
              <Link className="gray_btn" to="/login">
                Cancel
              </Link>
              <button type="submit" className="blue_btn">
                Search
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default SearchAccount;
