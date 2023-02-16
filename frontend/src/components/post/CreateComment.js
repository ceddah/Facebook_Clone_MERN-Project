import React, { useEffect, useRef, useState } from "react";
import EmojiPicker from "emoji-picker-react";
import { comment } from "../../functions/post";
import { uploadImages } from "../../functions/uploadImages";
import dataURItoBlob from "../../helpers/dataUriToBlob";
import { ClipLoader } from "react-spinners";

const CreateComment = ({ user, postId, setComments, setCount }) => {
  const [picker, setPicker] = useState(false);
  const [cursorPosition, setCursorPosition] = useState();
  const [commentImage, setCommentImage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const textRef = useRef(null);
  const [text, setText] = useState("");
  const fileInputRef = useRef(null);

  const handleEmoji = (_, { emoji }) => {
    const ref = textRef.current;
    ref.focus();
    const start = text.substring(0, ref.selectionStart);
    const end = text.substring(ref.selectionStart);
    const newText = start + emoji + end;
    setText(newText);
    setCursorPosition(start.length + emoji.length);
  };

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
      setCommentImage(e.target.result);
    };
  };

  const handleComment = async (e) => {
    if (e.key === "Enter") {
      if (commentImage !== "") {
        setLoading(true);
        const imageBlob = dataURItoBlob(commentImage);
        const path = `${user.username}/post_images/${postId}`;
        let formData = new FormData();
        formData.append("path", path);
        formData.append("file", imageBlob);
        const imgComment = await uploadImages(formData, user.token);
        const { comments } = await comment(postId, text, imgComment[0].url, user.token);
        setComments(comments);
        setCount((prev) => ++prev);
        setLoading(false);
        setText("");
        setCommentImage("");
      } else {
        setLoading(true);
        const { comments } = await comment(postId, text, "", user.token);
        setComments(comments);
        setCount((prev) => ++prev);
        setLoading(false);
        setText("");
        setCommentImage("");
      }
    }
  };
  useEffect(() => {
    textRef.current.selectionEnd = cursorPosition;
  }, [cursorPosition]);
  return (
    <div className="create_comment_wrap">
      <div className="create_comment">
        <img src={user?.picture} alt="user" />
        <div className="comment_input_wrap">
          {picker && (
            <div className="comment_emoji_picker">
              <EmojiPicker onEmojiClick={handleEmoji} />
            </div>
          )}
          <input
            type="file"
            hidden
            ref={fileInputRef}
            accept="image/jpeg,image/png,image/gif,image/webp"
            onChange={handleImage}
            multiple={false}
          />
          {error && (
            <div className="postError comment_error">
              <div className="postError_error">{error}</div>
              <button className="blue_btn" onClick={() => setError("")}>
                Try again
              </button>
            </div>
          )}
          <input
            type="text"
            ref={textRef}
            value={text}
            placeholder="Write your comment here"
            onChange={({ target }) => setText(target.value)}
            onKeyUp={handleComment}
          />
          <div className="comment_circle" style={{ marginTop: "5px" }}>
            <ClipLoader size={20} color="#1876F2" loading={loading} />
          </div>
          <div className="comment_circle_icon hover2" onClick={() => setPicker((c) => !c)}>
            <i className="emoji_icon"></i>
          </div>
          <div className="comment_circle_icon hover2" onClick={() => fileInputRef.current.click()}>
            <i className="camera_icon"></i>
          </div>
          <div className="comment_circle_icon hover2">
            <i className="gif_icon"></i>
          </div>
          <div className="comment_circle_icon hover2">
            <i className="sticker_icon"></i>
          </div>
        </div>
      </div>
      {commentImage && (
        <div className="comment_img_preview">
          <img src={commentImage} alt="Your comment img" />
          <div className="small_white_circle" onClick={() => setCommentImage("")}>
            <i className="exit_icon"></i>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateComment;
