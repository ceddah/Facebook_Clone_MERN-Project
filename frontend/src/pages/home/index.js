import React from "react";
import { useSelector } from "react-redux";
import CreatePost from "../../components/createPost";
import Header from "../../components/header";
import LeftHome from "../../components/home/left";
import RightHome from "../../components/home/right";
import SendVerification from "../../components/home/emailVerification";
import Stories from "../../components/home/stories";

import "./style.css";

const Home = ({ setCreatePostVisible }) => {
  const user = useSelector((state) => state.user);
  return (
    <div className="home">
      <Header />
      <LeftHome user={user} />
      <div className="home_middle">
        <Stories />
        {!user.verified && <SendVerification user={user} />}
        <CreatePost user={user} setCreatePostVisible={setCreatePostVisible} />
      </div>
      <RightHome user={user} />
    </div>
  );
};

export default Home;
