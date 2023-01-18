import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import CreatePost from "../../components/createPost";
import Header from "../../components/header";
import LeftHome from "../../components/home/left";
import RightHome from "../../components/home/right";
import SendVerification from "../../components/home/emailVerification";
import Stories from "../../components/home/stories";

import "./style.css";
import Post from "../../components/post";

const Home = ({ setCreatePostVisible, posts }) => {
  const user = useSelector((state) => state.user);
  const [height, setHeight] = useState();
  const middle = useRef(null);
  useEffect(() => {
    setHeight(middle.current.clientHeight);
  }, []);

  const onImageLoad = () => setHeight(middle.current.clientHeight);
  return (
    <div className="home" style={{ height: `${height + 150}px` }}>
      <Header />
      <LeftHome user={user} />
      <div className="home_middle" ref={middle}>
        <Stories />
        {!user.verified && <SendVerification user={user} />}
        <CreatePost user={user} setCreatePostVisible={setCreatePostVisible} />
        <div className="posts">
          {posts.map((post) => (
            <Post onImageLoad={onImageLoad} key={post._id} post={post} user={user} />
          ))}
        </div>
      </div>
      <RightHome user={user} />
    </div>
  );
};

export default Home;
