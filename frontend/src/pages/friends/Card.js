import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { acceptRequest, canceLRequest, deleteRequest } from "../../functions/user";

const Card = ({ user, type, getFriendsInfos }) => {
  const { token } = useSelector((state) => state.user);
  const cancelRequestHandler = async (userId) => {
    const res = await canceLRequest(userId, token);
    if (res === "ok") {
      getFriendsInfos();
    }
  };
  const confirmRequestHandler = async (userId) => {
    const res = await acceptRequest(userId, token);
    if (res === "ok") {
      getFriendsInfos();
    }
  };
  const deleteRequestHandler = async (userId) => {
    const res = await deleteRequest(userId, token);
    if (res === "ok") {
      getFriendsInfos();
    }
  };
  return (
    <div className="req_card">
      <Link to={`/profile/${user.username}`}>
        <img src={user.picture} alt="" />
      </Link>
      <div className="req_name">
        {user.first_name} {user.last_name}
      </div>
      {type === "sent" ? (
        <button onClick={() => cancelRequestHandler(user._id)} className="blue_btn">
          Cancel Request
        </button>
      ) : type === "request" ? (
        <>
          <button className="blue_btn" onClick={() => confirmRequestHandler(user._id)}>
            Confirm
          </button>
          <button className="gray_btn" onClick={() => deleteRequestHandler(user._id)}>
            Delete
          </button>
        </>
      ) : (
        ""
      )}
    </div>
  );
};

export default Card;
