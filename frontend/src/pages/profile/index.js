import React, { useEffect, useReducer, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { profileReducer } from "../../functions/reducers";
import axios from "axios";
import Header from "../../components/header";
import "./style.css";
import Cover from "./Cover";
import ProfilePictureInfos from "./ProfilePictureInfos";
import ProfileMenu from "./ProfileMenu";
import PeopleYouMayKnow from "./PeopleYouMayKnow";
import GridPosts from "./GridPosts";
import Post from "../../components/post";
import Photos from "./Photos";
import Friends from "./Friends";
import Intro from "../../components/intro";
import { useMediaQuery } from "react-responsive";

const Profile = ({ getAllPosts }) => {
  const [{ loading, error, profile }, dispatch] = useReducer(profileReducer, {
    loading: false,
    profile: [],
    error: "",
  });
  const [photos, setPhotos] = useState({});
  const [heights, setHeights] = useState({
    profileTopHeight: null,
    leftSideHeight: null,
    scrollHeight: null,
  });
  const [othername, setOthername] = useState();
  const user = useSelector((state) => state.user);
  const { username } = useParams();
  const userName = username === undefined ? user.username : username;
  const navigate = useNavigate();
  const visitor = userName === user.username ? false : true;
  const path = `${userName}/*`;
  const max = 30;
  const sort = "desc";
  const profileTopRef = useRef(null);
  const leftSideRef = useRef(null);
  const check = useMediaQuery({
    query: "(min-width:901px)",
  });
  const getProfileData = async () => {
    try {
      dispatch({
        type: "PROFILE_REQUEST",
      });
      const { data } = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/getProfile/${userName}`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      if (data.ok === false) {
        navigate("/profile");
      } else {
        try {
          const images = await axios.post(
            `${process.env.REACT_APP_BACKEND_URL}/listImages`,
            {
              path,
              max,
              sort,
            },
            {
              headers: {
                Authorization: `Bearer ${user.token}`,
              },
            }
          );
          setPhotos(images.data);
        } catch (error) {
          console.log(error);
        }
        dispatch({
          type: "PROFILE_SUCCESS",
          payload: data,
        });
      }
    } catch (error) {
      dispatch({
        type: "PROFILE_ERROR",
        payload: error?.response?.data?.message,
      });
    }
  };
  const rehydrateDetails = (newDetails) => {
    dispatch({
      type: "REHYDRATE_DETAILS",
      payload: newDetails,
    });
  };
  const getScrollHeight = () => {
    setHeights((prev) => ({ ...prev, scrollHeight: window.pageYOffset }));
  };
  useEffect(() => {
    getProfileData();
  }, [userName]);
  useEffect(() => {
    setOthername(profile?.details?.otherName);
  }, [profile]);

  useEffect(() => {
    setHeights((prev) => ({
      ...prev,
      profileTopHeight: profileTopRef.current.clientHeight + 300,
      leftSideHeight: leftSideRef.current.clientHeight,
    }));
    window.addEventListener("scroll", getScrollHeight, {
      passive: true,
    });

    return () => window.removeEventListener("scroll", getScrollHeight, { passive: true });
  }, [loading]);
  return (
    <div className="profile">
      <Header page="profile" getAllPosts={getAllPosts} />
      <div className="profile_top" ref={profileTopRef}>
        <div className="profile_container">
          <Cover cover={profile?.cover} visitor={visitor} photos={photos?.resources} />
          <ProfilePictureInfos
            profile={profile}
            visitor={visitor}
            photos={photos?.resources}
            othername={othername}
          />
          <ProfileMenu />
        </div>
      </div>
      <div className="profile_bottom">
        <div className="profile_container">
          <div className="bottom_container">
            <PeopleYouMayKnow />
            <div
              className={`profile_grid ${
                check &&
                heights.scrollHeight >= heights.profileTopHeight &&
                heights.leftSideHeight > 1000
                  ? "scrollFixed showLess"
                  : check &&
                    heights.scrollHeight >= heights.profileTopHeight &&
                    heights.leftSideHeight < 1000 &&
                    "scrollFixed showMore"
              }`}
            >
              <div className="profile_left" ref={leftSideRef}>
                <Intro
                  details={profile.details}
                  visitor={visitor}
                  user={user}
                  rehydrateDetails={rehydrateDetails}
                />
                <Photos photos={photos} />
                <Friends friends={profile.friends} />
                <div className="relative_fb_copyright">
                  <Link to="/">Privacy </Link>
                  <span>. </span>
                  <Link to="/">Terms </Link>
                  <span>. </span>
                  <Link to="/">Advertising </Link>
                  <span>. </span>
                  <Link to="/">
                    Ad Choices <i className="ad_choices_icon"></i>{" "}
                  </Link>
                  <span>. </span>
                  <Link to="/"></Link>Cookies <span>. </span>
                  <Link to="/">More </Link>
                  <span>. </span> <br />
                  Meta © 2022
                </div>
              </div>
              <div className="profile_right">
                <GridPosts />
                <div className="posts">
                  {profile.posts && profile.posts.length ? (
                    profile.posts.map((post) => (
                      <Post isOnProfile key={post._id} post={post} user={user} />
                    ))
                  ) : (
                    <div className="no_posts">No posts available for this user</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
