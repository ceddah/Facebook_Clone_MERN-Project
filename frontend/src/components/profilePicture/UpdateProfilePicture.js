import React, { useRef, useState } from "react";
import Cropper from "react-easy-crop";

const UpdateProfilePicture = ({ setImage, image }) => {
  const [description, setDescription] = useState("");
  const [zoom, setZoom] = useState(1);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const sliderRef = useRef(null);

  const zoomIn = () => {
    sliderRef.current.stepUp();
    setZoom(sliderRef.current.value);
  };
  const zoomOut = () => {
    sliderRef.current.stepDown();
    setZoom(sliderRef.current.value);
  };
  return (
    <div className="postBox update_img">
      <div className="box_header">
        <div className="small_circle" onClick={() => setImage("")}>
          <i className="exit_icon"></i>
        </div>
        <span>Update profile picture</span>
      </div>
      <div className="update_image_desc">
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
          className="textarea_blue details_input"
        ></textarea>
      </div>
      <div className="update_center">
        <div className="crooper">
          <Cropper
            image={image}
            crop={crop}
            onCropChange={setCrop}
            zoom={zoom}
            onZoomChange={setZoom}
            aspect={1 / 1}
            cropShape="round"
            showGrid={false}
          />
        </div>
        <div className="slider">
          <div className="slider_circle hover1" onClick={zoomOut}>
            <i className="minus_icon"></i>
          </div>
          <input
            type="range"
            min={1}
            max={3}
            value={zoom}
            onChange={(e) => setZoom(e.target.value)}
            step={0.2}
            ref={sliderRef}
          />
          <div className="slider_circle hover1" onClick={zoomIn}>
            <i className="plus_icon"></i>
          </div>
        </div>
      </div>
      <div className="flex_up">
        <div className="gray_btn">
          <i className="crop_icon"></i>Crop Photo
        </div>
        <div className="gray_btn">
          <i className="temp_icon"></i>Make Temporary
        </div>
      </div>
      <div className="flex_p_t">
        <i className="public_icon"></i>
        Your profile picture is public
      </div>
      <div className="update_submit_wrap">
        <div className="blue_link">Cancel</div>
        <button className="blue_btn">Save</button>
      </div>
    </div>
  );
};

export default UpdateProfilePicture;
