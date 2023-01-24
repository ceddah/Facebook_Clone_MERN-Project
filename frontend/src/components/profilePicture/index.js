import React, { useRef, useState } from "react";
import "./style.css";
import UpdateProfilePicture from "./UpdateProfilePicture";
import useClickOutside from "../../helpers/clickOutside";
import { useSelector } from "react-redux";

const ProfilePicture = ({ setShowUpdatePicture, pRef, photos }) => {
  const [image, setImage] = useState("");
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);
  const modalRef = useRef(null);
  const user = useSelector((state) => state.user);
  useClickOutside(modalRef, () => setShowUpdatePicture(false));
  const handleImage = (e) => {
    let file = e.target.files[0];
    if (
      file.type !== "image/jpeg" &&
      file.type !== "image/png" &&
      file.type !== "image/gif" &&
      file.type !== "image/webp"
    ) {
      setError(`${file.name} format is not supported.`);
      return;
    } else if (file.size > 1024 * 1024 * 5) {
      setError(`${file.name} size is too large. 5MB is the limit.`);
      return;
    }
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (e) => {
      setImage(e.target.result);
    };
  };
  return (
    <div className="blur">
      <input
        accept="image/jpeg,image/png,image/gif,image/webp"
        multiple={false}
        type="file"
        hidden
        ref={fileInputRef}
        onChange={handleImage}
      />
      <div className="postBox pictureBox" ref={modalRef}>
        <div className="box_header">
          <div className="small_circle" onClick={() => setShowUpdatePicture(false)}>
            <i className="exit_icon"></i>
          </div>
          <span>Update profile picture</span>
        </div>
        <div className="update_picture_wrap">
          <div className="update_picture_buttons">
            <button className="light_blue_btn" onClick={() => fileInputRef.current.click()}>
              <i className="plus_icon filter_blue"></i>
              Upload photo
            </button>
            <button className="gray_btn">
              <i className="frame_icon"></i>
              Add frame
            </button>
          </div>
        </div>
        {error && (
          <div className="postError comment_error">
            <div className="postError_error">{error}</div>
            <button className="blue_btn" onClick={() => setError("")}>
              Try again
            </button>
          </div>
        )}
        <div className="old_pictures_wrap scrollbar">
          <h4>Your profile pictures</h4>
          <div className="old_pictures">
            {photos
              .filter((img) => img.folder === `${user.username}/profile_picture`)
              .map((photo) => (
                <img
                  src={photo.secure_url}
                  key={photo.public_id}
                  alt="all profile photos"
                  onClick={() => setImage(photo.secure_url)}
                />
              ))}
          </div>
          <h4>Other pictures</h4>
          <div className="old_pictures">
            {photos
              .filter((img) => img.folder !== `${user.username}/profile_picture`)
              .map((photo) => (
                <img
                  src={photo.secure_url}
                  key={photo.public_id}
                  onClick={() => setImage(photo.secure_url)}
                  alt="all profile photos"
                />
              ))}
          </div>
        </div>
        {image && (
          <UpdateProfilePicture
            setImage={setImage}
            image={image}
            setError={setError}
            setShowUpdatePicture={setShowUpdatePicture}
            pRef={pRef}
          />
        )}
      </div>
    </div>
  );
};

export default ProfilePicture;
