import React from "react";
import { Link } from "react-router-dom";

const Friends = ({ friends }) => {
  return (
    <div className="profile_card">
      <div className="profile_card_heahder">
        Friends
        <Link to="/friends/all" className="profile_header_link">
          See all friends
        </Link>
      </div>
      <div className="profile_card_count">
        {friends?.length === 0
          ? null
          : friends?.length === 1
          ? "1 Friend"
          : `${friends?.length} Friends`}
      </div>
      <div className="profile_card_grid">
        {friends &&
          friends?.slice(0, 9).map((friend, i) => (
            <Link to={`/profile/${friend.username}`} key={i + 2322} className="profile_photo_card">
              <img src={friend.picture} alt={friend.username} />
              <span>
                {friend.frist_name} {friend.last_name}
              </span>
            </Link>
          ))}
      </div>
    </div>
  );
};

export default Friends;
