import React, { useRef, useState } from "react";
import AddToYourPost from "./AddToYourPost";
import EmojiPickerBackgrounds from "./EmojiPickerBackgrounds";
import ImagePreview from "./ImagePreview";
import useClickOutside from "../../helpers/clickOutside";
import "./style.css";
import { createPost } from "../../functions/post";
import PulseLoader from "react-spinners/PulseLoader";
import PostError from "./PostError";
import dataUriToBlob from "../../helpers/dataUriToBlob";
import { uploadImages } from "../../functions/uploadImages";

const CreatePostPopup = ({ user, setCreatePostVisible }) => {
  const [text, setText] = useState("");
  const [images, setImages] = useState([]);
  const [showPreview, setShowPreview] = useState(false);
  const [background, setBackground] = useState("");
  const createPostRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useClickOutside(createPostRef, () => setCreatePostVisible(false));

  const postSubmit = async () => {
    if (background) {
      setLoading(true);
      const response = await createPost(null, background, text, null, user.id, user.token);
      setLoading(false);
      if (response === "ok") {
        setBackground("");
        setText("");
        setCreatePostVisible(false);
      } else {
        setError(response);
      }
    } else if (images && images.length) {
      setLoading(true);
      const imagesBlob = images.map((img) => {
        return dataUriToBlob(img);
      });
      const path = `${user.username}/post Images`;
      let formData = new FormData();
      formData.append("path", path);
      imagesBlob.forEach((img) => {
        formData.append("file", img);
      });
      const response = await uploadImages(formData, user.token);
      const res = await createPost(null, null, text, response, user.id, user.token);
      setLoading(false);
      if (res === "ok") {
        setText("");
        setImages([]);
        setCreatePostVisible(false);
      } else {
        setError(res);
      }
    } else if (text) {
      setLoading(true);
      const response = await createPost(null, null, text, null, user.id, user.token);
      setLoading(false);
      if (response === "ok") {
        setBackground("");
        setText("");
        setCreatePostVisible(false);
      } else {
        setError(response);
      }
    } else {
    }
  };
  return (
    <div className="blur">
      <div className="postBox" ref={createPostRef}>
        {error && <PostError error={error} setError={setError} />}
        <div className="box_header">
          <div className="small_circle" onClick={() => setCreatePostVisible(false)}>
            <i className="exit_icon"></i>
          </div>
          <span>Create Post</span>
        </div>
        <div className="box_profile">
          <img src={user.picture} alt="" className="box_profile_img" />
          <div className="box_col">
            <div className="box_profile_name">
              {user.first_name} {user.last_name}
            </div>
            <div className="box_privacy">
              <img src="../../../icons/public.png" alt="" />
              <span>Public</span>
              <i className="arrowDown_icon"></i>
            </div>
          </div>
        </div>
        {!showPreview ? (
          <EmojiPickerBackgrounds
            text={text}
            setText={setText}
            user={user}
            background={background}
            setBackground={setBackground}
          />
        ) : (
          <ImagePreview
            text={text}
            setText={setText}
            user={user}
            setError={setError}
            images={images}
            setImages={setImages}
            setShowPreview={setShowPreview}
          />
        )}
        <AddToYourPost setShowPreview={setShowPreview} />
        <button disabled={loading} onClick={() => postSubmit()} className="post_submit">
          {loading ? <PulseLoader color="#FFF" size={5} /> : "Post"}
        </button>
      </div>
    </div>
  );
};

export default CreatePostPopup;
