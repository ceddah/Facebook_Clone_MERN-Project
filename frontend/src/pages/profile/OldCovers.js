import React, { useRef } from "react";
import useClickOutside from "../../helpers/clickOutside";

const OldCovers = ({ setShowOldCovers, photos, setCoverPicture, user }) => {
  const popUpRef = useRef(null);
  useClickOutside(popUpRef, () => setShowOldCovers(false));
  return (
    <div className="blur">
      <div className="postBox selectCoverBox" ref={popUpRef}>
        <div className="box_header">
          <div className="small_circle" onClick={() => setShowOldCovers(false)}>
            <i className="exit_icon"></i>
          </div>
          <span>Select photo</span>
        </div>
        <div className="selectCoverBox_links">
          <div className="selectCoverBox_link">Recent photos</div>
          <div className="selectCoverBox_link">Photo albums</div>
        </div>
        <div className="old_pictures_wrap scrollbar">
          <div className="old_pictures">
            {photos &&
              photos
                .filter((img) => img.folder === `${user.username}/cover_picture`)
                .map((photo) => (
                  <img
                    src={photo.secure_url}
                    key={photo.public_id}
                    alt="all cover photos"
                    onClick={() => {
                      setCoverPicture(photo.secure_url);
                      setShowOldCovers(false);
                    }}
                  />
                ))}
          </div>
          <div className="old_pictures">
            {photos &&
              photos
                .filter((img) => img.folder !== `${user.username}/post_images`)
                .map((photo) => (
                  <img
                    src={photo.secure_url}
                    key={photo.public_id}
                    onClick={() => {
                      setCoverPicture(photo.secure_url);
                      setShowOldCovers(false);
                    }}
                    alt="all profile photos"
                  />
                ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OldCovers;
