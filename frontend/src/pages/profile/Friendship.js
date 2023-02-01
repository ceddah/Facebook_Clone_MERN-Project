import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import {
  acceptRequest,
  addFriend,
  canceLRequest,
  deleteRequest,
  follow,
  unfollow,
  unfriend,
} from "../../functions/user";
import useClickOutside from "../../helpers/clickOutside";
const initialFriendship = {
  friends: true,
  following: false,
  requestSent: false,
  requestReceived: false,
};

const Friendship = ({ friendship: profileFriendship = initialFriendship, profileId }) => {
  const [friendsMenu, setFriendsMenu] = useState(false);
  const [respondMenu, setRespondMenu] = useState(false);
  const [friendship, setFriendship] = useState(profileFriendship);
  const user = useSelector((state) => state.user);
  const friendsMenuRef = useRef(null);
  const respondMenuRef = useRef(null);
  useClickOutside(friendsMenuRef, () => setFriendsMenu(false));
  useClickOutside(respondMenuRef, () => setRespondMenu(false));

  const addFriendHandler = async () => {
    const res = await addFriend(profileId, user.token);
    if (res === "ok") {
      setFriendship({ ...friendship, requestSent: true, following: true });
    }
  };
  const cancelRequestHandler = async () => {
    const res = await canceLRequest(profileId, user.token);
    if (res === "ok") {
      setFriendship({ ...friendship, requestSent: false, following: false });
    }
  };

  const followHandler = async () => {
    const res = await follow(profileId, user.token);
    if (res === "ok") {
      setFriendship({ ...friendship, following: true });
    }
  };
  const unfollowHandler = async () => {
    const res = await unfollow(profileId, user.token);
    if (res === "ok") {
      setFriendship({ ...friendship, following: false });
    }
  };
  const acceptRequestHandler = async () => {
    const res = await acceptRequest(profileId, user.token);
    if (res === "ok") {
      setFriendship({
        ...friendship,
        friends: true,
        following: true,
        requestSent: false,
        requestReceived: false,
      });
    }
  };

  const unfriendHandler = async () => {
    const res = await unfriend(profileId, user.token);
    if (res === "ok") {
      setFriendship({
        ...friendship,
        friends: false,
        following: false,
        requestSent: false,
        requestReceived: false,
      });
    }
  };
  const deleteRequestHandler = async () => {
    const res = await deleteRequest(profileId, user.token);
    if (res === "ok") {
      setFriendship({
        ...friendship,
        friends: false,
        following: false,
        requestSent: false,
        requestReceived: false,
      });
    }
  };

  useEffect(() => {
    setFriendship(profileFriendship);
  }, [profileFriendship]);
  return (
    <div className="friendship">
      {friendship.friends ? (
        <div className="friends_menu_wrap">
          <button className="gray_btn" onClick={() => setFriendsMenu(true)}>
            <img src="../../../icons/friends.png" alt="friend" />
            <span>Friends</span>
          </button>
          {friendsMenu && (
            <div className="open_cover_menu" ref={friendsMenuRef}>
              <div className="open_cover_menu_item hover1">
                <img src="../../../icons/favoritesOutline.png" alt="favorite" />
                Favorite
              </div>
              <div className="open_cover_menu_item hover1">
                <img src="../../../icons/editFriends.png" alt="edit-friends" />
                Edit friend list
              </div>
              {friendship.following ? (
                <div className="open_cover_menu_item hover1" onClick={() => unfollowHandler()}>
                  <img src="../../../icons/unfollowOutlined.png" alt="unfollow" />
                  Unfollow
                </div>
              ) : (
                <div className="open_cover_menu_item hover1" onClick={() => followHandler()}>
                  <img src="../../../icons/unfollowOutlined.png" alt="follow" />
                  Follow
                </div>
              )}
              <div className="open_cover_menu_item hover1" onClick={() => unfriendHandler()}>
                <i className="unfriend_outlined_icon"></i>
                Unfriend
              </div>
            </div>
          )}
        </div>
      ) : (
        !friendship.requestSent &&
        !friendship.requestReceived && (
          <button className="blue_btn" onClick={() => addFriendHandler()}>
            <img src="../../../icons/addFriend.png" alt="friend" className="invert" />
            <span>Add Friend</span>
          </button>
        )
      )}
      {friendship.requestSent ? (
        <button className="blue_btn" onClick={() => cancelRequestHandler()}>
          <img src="../../../icons/cancelRequest.png" alt="cancel-request" className="invert" />
          <span>Cancel Request</span>
        </button>
      ) : (
        friendship.requestReceived && (
          <div className="friends_menu_wrap">
            <button className="gray_btn" onClick={() => setRespondMenu(true)}>
              <img src="../../../icons/friends.png" alt="friend" />
              <span>Respond</span>
            </button>
            {respondMenu && (
              <div className="open_cover_menu" ref={respondMenuRef}>
                <div className="open_cover_menu_item hover1" onClick={() => acceptRequestHandler()}>
                  Confirm
                </div>
                <div className="open_cover_menu_item hover1" onClick={() => deleteRequestHandler()}>
                  Delete
                </div>
              </div>
            )}
          </div>
        )
      )}
      <div className="flex">
        {friendship.following ? (
          <button className="gray_btn" onClick={() => unfollowHandler()}>
            <img src="../../../icons/follow.png" alt="cancel-request" />
            <span>Following</span>
          </button>
        ) : (
          <button className="blue_btn" onClick={() => followHandler()}>
            <img src="../../../icons/follow.png" alt="cancel-request" className="invert" />
            <span>Follow</span>
          </button>
        )}
        <button className={`${friendship.friends ? "blue_btn" : "gray_btn"}`}>
          <img
            src="../../../icons/message.png"
            alt="cancel-request"
            className={`${friendship.friends && "invert"}`}
          />
          <span>Message</span>
        </button>
      </div>
    </div>
  );
};

export default Friendship;
