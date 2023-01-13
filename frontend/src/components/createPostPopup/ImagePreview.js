import React, { useRef } from "react";
import EmojiPickerBackgrounds from "./EmojiPickerBackgrounds";

const ImagePreview = ({ text, setText, user, images, setImages, setShowPreview, setError }) => {
  const imageInputRef = useRef(null);
  const handleImages = (e) => {
    let files = Array.from(e.target.files);
    files.forEach((img) => {
      if (
        img.type !== "image/jpeg" &&
        img.type !== "image/png" &&
        img.type !== "image/webp" &&
        img.type !== "image/gif"
      ) {
        setError(`${img.name} format is unsupported.`);
        files = files.filter((item) => item.name !== img.name);
        return;
      } else if (img.size > 1024 * 1024 * 5) {
        setError(`${img.name} size is too large. Max 5Mb is allowed.`);
        files = files.filter((item) => item.name !== img.name);
        return;
      }
      const reader = new FileReader();
      reader.readAsDataURL(img);
      reader.onload = (readerEvent) => {
        setImages((images) => [...images, readerEvent.target.result]);
      };
    });
  };
  return (
    <div className="overflow_a scrollbar">
      <EmojiPickerBackgrounds text={text} setText={setText} user={user} type2 />
      <div className="add_pics_wrap">
        <input
          type="file"
          multiple
          hidden
          onChange={handleImages}
          accept="image/jpeg,image/png,image/webp,image/gif"
          ref={imageInputRef}
        />
        {images && images.length ? (
          <div className="add_pics_inside1 p0">
            <div className="preview_actions">
              <button>
                <i className="edit_icon"></i>
                Edit
              </button>
              <button onClick={() => imageInputRef.current.click()}>
                <i className="addPhoto_icon"></i>
                Add Photos/Videos
              </button>
            </div>
            <div className="small_white_circle" onClick={() => setImages([])}>
              <i className="exit_icon"></i>
            </div>
            <div
              className={
                images.length === 1
                  ? "preview1"
                  : images.length === 2
                  ? "preview2"
                  : images.length === 3
                  ? "preview3"
                  : images.length === 4
                  ? "preview4"
                  : images.length === 5
                  ? "preview5"
                  : images.length % 2 === 0
                  ? "preview6"
                  : "preview6 singular_grid"
              }
            >
              {images.map((image, i) => (
                <img src={image} key={i} alt="grid" />
              ))}
            </div>
          </div>
        ) : (
          <div className="add_pics_inside1">
            <div className="small_white_circle" onClick={() => setShowPreview(false)}>
              <i className="exit_icon"></i>
            </div>
            <div className="add_col" onClick={() => imageInputRef.current.click()}>
              <div className="add_circle">
                <i className="addPhoto_icon"></i>
              </div>
              <span>Add Photos/Videos</span>
              <span>or drag and drop</span>
            </div>
          </div>
        )}
        <div className="add_pics_inside2">
          <div className="add_circle">
            <i className="phone_icon"></i>
          </div>
          <div className="mobile_text">Add photos from your mobile device</div>
          <div className="addphone_btn">Add</div>
        </div>
      </div>
    </div>
  );
};

export default ImagePreview;
