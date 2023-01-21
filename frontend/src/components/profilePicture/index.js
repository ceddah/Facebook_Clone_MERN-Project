import React, { useRef, useState } from "react";
import "./style.css";
import UpdateProfilePicture from "./UpdateProfilePicture";

const ProfilePicture = ({ setShowUpdatePicture }) => {
  const [image, setImage] = useState("");
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);
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
      <div className="postBox pictureBox">
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
        <div className="old_pictures_wrap"></div>
      </div>
      {image && <UpdateProfilePicture setImage={setImage} image={image} />}
    </div>
  );
};

export default ProfilePicture;
