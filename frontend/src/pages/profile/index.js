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
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import HashLoader from "react-spinners/HashLoader";

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
          {!loading ? (
            <>
              <Cover cover={profile?.cover} visitor={visitor} photos={photos?.resources} />
              <ProfilePictureInfos
                profile={profile}
                visitor={visitor}
                photos={photos?.resources}
                othername={othername}
              />
            </>
          ) : (
            <>
              <div className="profile_cover">
                <Skeleton
                  height="347px"
                  containerClassName="avatar-skeleton"
                  style={{ borderRadius: "8px" }}
                />
              </div>
              <div
                className="profile_img_wrap"
                style={{ marginBottom: "-3rem", transform: "translateY(-8px)" }}
              >
                <div className="profile_w_left">
                  <Skeleton
                    circle
                    height="180px"
                    width="180px"
                    containerClassName="avatar-skeleton"
                    style={{ transform: "translateY(-3.3rem)" }}
                  />
                  <div className="profile_w_col">
                    <div className="profile_name">
                      <Skeleton height="35px" width="200px" containerClassName="avatar-skeleton" />
                      <Skeleton
                        height="30px"
                        width="100px"
                        containerClassName="avatar-skeleton"
                        style={{ transform: "translateY(2.5px)" }}
                      />
                    </div>
                    <div className="profile_friend_count">
                      <Skeleton
                        height="20px"
                        width="90px"
                        containerClassName="avatar-skeleton"
                        style={{ margin: "5px 0" }}
                      />
                    </div>
                    <div className="profile_friend_imgs">
                      {Array.from(new Array(6), (val, i) => i + 1).map((id, i) => (
                        <Skeleton
                          key={i}
                          circle
                          height="32px"
                          width="32px"
                          containerClassName="avatar-skeleton"
                          style={{ transform: `translateX(${-i * 20}px)` }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <div className={`friendship ${!visitor && "fix"}`}>
                  <Skeleton height="36px" width={110} containerClassName="avatar-skeleton" />

                  <div className="flex">
                    <Skeleton height="36px" width={110} containerClassName="avatar-skeleton" />
                    {visitor && (
                      <Skeleton height="36px" width={110} containerClassName="avatar-skeleton" />
                    )}
                  </div>
                </div>
              </div>
            </>
          )}
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
                {loading ? (
                  <>
                    <div className="profile_card">
                      <div className="profile_card_heahder">Intro</div>
                      <div className="skeleton_loader">
                        <HashLoader color="#1876f2" />
                      </div>
                    </div>
                    <div className="profile_card">
                      <div className="profile_card_heahder">
                        Photos
                        <div className="profile_header_link">See all photos</div>
                      </div>
                      <div className="skeleton_loader">
                        <HashLoader color="#1876f2" />
                      </div>
                    </div>
                    <div className="profile_card">
                      <div className="profile_card_heahder">
                        Friends
                        <div className="profile_header_link">See all friends</div>
                      </div>
                      <div className="skeleton_loader">
                        <HashLoader color="#1876f2" />
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <Intro
                      details={profile.details}
                      visitor={visitor}
                      user={user}
                      rehydrateDetails={rehydrateDetails}
                    />
                    <Photos photos={photos} />
                    <Friends friends={profile.friends} />
                  </>
                )}

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
                {!loading ? (
                  <div className="posts">
                    {profile.posts && profile.posts.length ? (
                      profile.posts.map((post) => (
                        <Post isOnProfile key={post._id} post={post} user={user} />
                      ))
                    ) : (
                      <div className="no_posts">No posts available for this user</div>
                    )}
                  </div>
                ) : (
                  <div className="skeleton_loader" style={{ height: "250px" }}>
                    <HashLoader color="#1876f2" />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
