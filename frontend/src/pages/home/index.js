import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import CreatePost from "../../components/createPost";
import Header from "../../components/header";
import LeftHome from "../../components/home/left";
import RightHome from "../../components/home/right";
import SendVerification from "../../components/home/emailVerification";
import Stories from "../../components/home/stories";
import { HashLoader } from "react-spinners";
import Post from "../../components/post";

import "./style.css";
import { getFriendsPageInfos } from "../../functions/user";

const Home = ({ setCreatePostVisible, posts, getAllPosts, isLoading }) => {
  const user = useSelector((state) => state.user);
  const [height, setHeight] = useState();
  const [contacts, setContacts] = useState([]);
  const middle = useRef(null);

  const getAllContacts = async () => {
    const { status, data } = await getFriendsPageInfos("contacts", user.token);
    if (status === "ok") {
      setContacts(data.contacts);
    }
  };

  useEffect(() => {
    setHeight(middle.current.clientHeight);
    getAllPosts();
    getAllContacts();
  }, []);

  const onImageLoad = () => setHeight(middle.current.clientHeight);
  return (
    <div className="home" style={{ height: `${height + 150}px`, minHeight: "70vw" }}>
      <Header page="home" getAllPosts={getAllPosts} />
      <LeftHome user={user} />
      <div className="home_middle" ref={middle}>
        <Stories />
        {!user.verified && <SendVerification user={user} />}
        <CreatePost user={user} setCreatePostVisible={setCreatePostVisible} />
        {!isLoading ? (
          <div className="posts">
            {posts.map((post) => (
              <Post onImageLoad={onImageLoad} key={post._id} post={post} user={user} />
            ))}
          </div>
        ) : (
          <div className="skeleton_loader" style={{ height: "250px" }}>
            <HashLoader color="#1876f2" />
          </div>
        )}
      </div>
      <RightHome contacts={contacts} />
    </div>
  );
};

export default Home;
