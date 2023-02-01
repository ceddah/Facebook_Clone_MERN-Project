import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";
import ProfilePicture from "../../components/profilePicture";
import Friendship from "./Friendship";

const ProfilePictureInfos = ({ profile, visitor, photos }) => {
  const [showUpdatePicture, setShowUpdatePicture] = useState(false);
  const pRef = useRef(null);
  return (
    <div className="profile_img_wrap">
      {showUpdatePicture && (
        <ProfilePicture setShowUpdatePicture={setShowUpdatePicture} pRef={pRef} photos={photos} />
      )}
      <div className="profile_w_left">
        <div className="profile_w_img">
          <div
            className="profile_w_bg"
            ref={pRef}
            style={{
              backgroundSize: "cover",
              backgroundImage: `url(${profile?.picture})`,
            }}
          ></div>
          {!visitor && (
            <div className="profile_circle hover1" onClick={() => setShowUpdatePicture(true)}>
              <i className="camera_filled_icon"></i>
            </div>
          )}
        </div>
        <div className="profile_w_col">
          <div className="profile_name">
            {profile?.first_name} {profile?.last_name}
            {profile?.details?.otherName && (
              <div className="othername">({profile.details.otherName})</div>
            )}
          </div>
          {profile?.friends && (
            <>
              <div className="profile_friend_count">
                {profile?.friends?.length === 0
                  ? null
                  : profile?.friends?.length === 1
                  ? "1 Friend"
                  : `${profile?.friends?.length} Friends`}
              </div>
              <div className="profile_friend_imgs">
                {profile?.friends &&
                  profile.friends.slice(0, 6).map((friend, i) => (
                    <Link to={`/profile/${friend.username}`} key={friend.username}>
                      <img
                        style={{ transform: `translateX(${i * -6}px)`, zIndex: i }}
                        src={friend.picture}
                        alt={friend.username}
                      />
                    </Link>
                  ))}
              </div>
            </>
          )}
        </div>
      </div>
      {!visitor ? (
        <div className="profile_w_right">
          <div className="blue_btn">
            <img src="../../../icons/plus.png" alt="" className="invert" />
            <span>Add to story</span>
          </div>
          <div className="gray_btn">
            <i className="edit_icon"></i>
            <span>Edit profile</span>
          </div>
        </div>
      ) : (
        <Friendship friendship={profile?.friendship} profileId={profile?._id} />
      )}
    </div>
  );
};

export default ProfilePictureInfos;
