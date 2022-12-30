import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CreatePost from "../../components/createPost";
import Header from "../../components/header";
import LeftHome from "../../components/home/left";
import RightHome from "../../components/home/right";
import Stories from "../../components/home/stories";
import ActivateForm from "../../components/activateAccount/ActivateForm";
import axios from "axios";
import Cookies from "js-cookie";

import "./style.css";
import { useNavigate, useParams } from "react-router-dom";

const Activate = () => {
  const user = useSelector((state) => state.user);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { token } = useParams();

  useEffect(() => {
    const activateAccount = async () => {
      try {
        setLoading(true);
        const { data } = await axios.post(
          `${process.env.REACT_APP_BACKEND_URL}/activate`,
          { token },
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          }
        );
        setSuccess(data.message);
        Cookies.set("user", JSON.stringify({ ...user, verified: true }));
        dispatch({ type: "VERIFY", payload: true });
        setTimeout(() => {
          navigate("/");
        }, 3000);
      } catch (error) {
        setError(error.response.data.message);
        setTimeout(() => {
          navigate("/");
        }, 3000);
      }
    };
    activateAccount();
  }, []);
  return (
    <div className="home">
      {success && (
        <ActivateForm
          type="success"
          header="You have successfully activated your Account"
          text={success}
          loading={loading}
        />
      )}
      {error && (
        <ActivateForm
          type="error"
          header="You have failed to activate your Account"
          text={error}
          loading={loading}
        />
      )}
      <Header />
      <LeftHome user={user} />
      <div className="home_middle">
        <Stories />
        <CreatePost user={user} />
      </div>
      <RightHome user={user} />
    </div>
  );
};

export default Activate;
