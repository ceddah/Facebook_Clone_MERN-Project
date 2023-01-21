import React from "react";

const AddFriendSmallCard = ({ friend }) => {
  return (
    <div className="addfriendCard">
      <div className="addfriend_imgsmall">
        <img src={friend.profile_picture} alt="" />
        <div className="addfriend_infos">
          <div className="addfriend_name">
            {friend.profile_name.length > 11
              ? `${friend.profile_name.substring(0, 11)}...`
              : friend.profile_name}
          </div>
          <div className="light_blue_btn">
            <img src="../../../icons/addFriend.png" alt="" className="filter_blue" />
            Add Friend
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddFriendSmallCard;
