import React, { useEffect, useReducer } from "react";
import { useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import Header from "../../components/header";
import { friendsPageReducer } from "../../functions/reducers";
import { getFriendsPageInfos } from "../../functions/user";
import Card from "./Card";
import "./style.css";

const Friends = () => {
  const [{ loading, data, error }, dispatch] = useReducer(friendsPageReducer, {
    loading: false,
    data: {},
    error: "",
  });
  const { type } = useParams();
  const user = useSelector((state) => state.user);
  const getFriendsInfos = async () => {
    dispatch({
      type: "FRIENDS_REQUEST",
    });
    const response = await getFriendsPageInfos(null, user.token);
    if (response.status === "ok") {
      dispatch({
        type: "FRIENDS_SUCCESS",
        payload: response.data,
      });
    } else {
      dispatch({
        type: "FRIENDS_ERROR",
        payload: response.data,
      });
    }
  };

  useEffect(() => {
    getFriendsInfos();
  }, []);
  return (
    <>
      <Header page="friends" />
      <div className="friends">
        <div className="friends_left">
          <div className="friends_left_header">
            <h3>Friends</h3>
            <div className="small_circle">
              <i className="settings_filled_icon"></i>
            </div>
          </div>
          <div className="friends_left_wrap">
            <Link to="/friends" className={`mmenu_item hover3 ${!type && "active_friends"}`}>
              <div className="small_circle">
                <i className="friends_home_icon"></i>
              </div>
              <span>Home</span>
              <div className="rArrow">
                <i className="right_icon"></i>
              </div>
            </Link>
            <Link
              to="/friends/requests"
              className={`mmenu_item hover3 ${type === "requests" && "active_friends"}`}
            >
              <div className="small_circle">
                <i className="friends_requests_icon"></i>
              </div>
              <span>Friend Requests</span>
              <div className="rArrow">
                <i className="right_icon"></i>
              </div>
            </Link>
            <Link
              to="/friends/sent"
              className={`mmenu_item hover3 ${type === "sent" && "active_friends"}`}
            >
              <div className="small_circle">
                <i className="friends_requests_icon"></i>
              </div>
              <span>Sent Requests</span>
              <div className="rArrow">
                <i className="right_icon"></i>
              </div>
            </Link>
            <Link
              to="/friends/suggestions"
              className={`mmenu_item hover3 ${type === "suggestions" && "active_friends"}`}
            >
              <div className="small_circle">
                <i className="friends_suggestions_icon"></i>
              </div>
              <span>Suggestions</span>
              <div className="rArrow">
                <i className="right_icon"></i>
              </div>
            </Link>
            <Link
              to="/friends/all"
              className={`mmenu_item hover3 ${type === "all" && "active_friends"}`}
            >
              <div className="small_circle">
                <i className="all_friends_icon"></i>
              </div>
              <span>All Friends</span>
              <div className="rArrow">
                <i className="right_icon"></i>
              </div>
            </Link>
            <div className="mmenu_item hover3">
              <div className="small_circle">
                <i className="birthdays_icon"></i>
              </div>
              <span>Birthdays</span>
              <div className="rArrow">
                <i className="right_icon"></i>
              </div>
            </div>
            <div className="mmenu_item hover3">
              <div className="small_circle">
                <i className="all_friends_icon"></i>
              </div>
              <span>Custom List</span>
              <div className="rArrow">
                <i className="right_icon"></i>
              </div>
            </div>
          </div>
        </div>
        <div className="friends_right">
          {(!type || type === "requests") && (
            <div className="friends_right_wrap">
              <div className="friends_left_header">
                <h3>Friend Requests</h3>
                {!type && (
                  <Link to="/friends/requests" className="see_link hover3">
                    See All
                  </Link>
                )}
              </div>
              <div className="flex_wrap">
                {data.requests &&
                  data.requests.map((user) => (
                    <Card
                      user={user}
                      key={user._id}
                      type="request"
                      getFriendsInfos={getFriendsInfos}
                    />
                  ))}
              </div>
            </div>
          )}
          {(!type || type === "sent") && (
            <div className="friends_right_wrap">
              <div className="friends_left_header">
                <h3>Sent Requests</h3>
                {!type && (
                  <Link to="/friends/sent" className="see_link hover3">
                    See All
                  </Link>
                )}
              </div>
              <div className="flex_wrap">
                {data.sentRequests &&
                  data.sentRequests.map((user) => (
                    <Card
                      user={user}
                      key={user._id}
                      type="sent"
                      getFriendsInfos={getFriendsInfos}
                    />
                  ))}
              </div>
            </div>
          )}
          {(!type || type === "all") && (
            <div className="friends_right_wrap">
              <div className="friends_left_header">
                <h3>Friends</h3>
                {!type && (
                  <Link to="/friends/all" className="see_link hover3">
                    See All
                  </Link>
                )}
              </div>
              <div className="flex_wrap">
                {data.friends &&
                  data.friends.map((user) => (
                    <Card
                      user={user}
                      key={user._id}
                      type="friends"
                      getFriendsInfos={getFriendsInfos}
                    />
                  ))}
              </div>
            </div>
          )}
          {(!type || type === "suggestions") && (
            <div className="friends_right_wrap">
              <div className="friends_left_header">
                <h3>Suggestions</h3>
                {!type && (
                  <Link to="/friends/suggestions" className="see_link hover3">
                    See All
                  </Link>
                )}
              </div>
              <div className="flex_wrap">
                {data.suggestedUsers &&
                  data.suggestedUsers.map((user) => (
                    <Card
                      user={user}
                      key={user._id}
                      type="suggestions"
                      getFriendsInfos={getFriendsInfos}
                    />
                  ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Friends;
