import { useCallback, useEffect, useRef, useState } from "react";
import useClickOutside from "../../helpers/clickOutside";
import Cropper from "react-easy-crop";
import getCroppedImg from "../../helpers/getCroppedImg";
import { uploadImages } from "../../functions/uploadImages";
import { useSelector } from "react-redux";
import { updateCover } from "../../functions/user";
import { createPost } from "../../functions/post";
import PulseLoader from "react-spinners/PulseLoader";
import OldCovers from "./OldCovers";

export default function Cover({ cover, visitor, photos }) {
  const [showCoverMneu, setShowCoverMenu] = useState(false);
  const [coverPicture, setCoverPicture] = useState("");
  const [loading, setLoading] = useState(false);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [zoom, setZoom] = useState(1);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [error, setError] = useState("");
  const [width, setWidth] = useState();
  const [showOldCovers, setShowOldCovers] = useState(false);
  const menuRef = useRef(null);
  const inputRef = useRef(null);
  const coverRef = useRef(null);
  const coverImageRef = useRef(null);
  const user = useSelector((state) => state.user);

  useClickOutside(menuRef, () => setShowCoverMenu(false));

  const handleImage = (e) => {
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
        setCoverPicture(readerEvent.target.result);
      };
    });
  };
  const getCroppedImage = useCallback(
    async (show) => {
      try {
        const img = await getCroppedImg(coverPicture, croppedAreaPixels);
        if (show) {
          setZoom(1);
          setCrop({ x: 0, y: 0 });
          setCoverPicture(img);
        } else {
          return img;
        }
      } catch (error) {
        console.log(error);
      }
    },
    [croppedAreaPixels]
  );

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const updateCoverPicture = async () => {
    try {
      setLoading(true);
      const img = await getCroppedImage();
      const blob = await fetch(img).then((b) => b.blob());
      const path = `${user.username}/cover_picture`;
      let formData = new FormData();
      formData.append("file", blob);
      formData.append("path", path);
      const res = await uploadImages(formData, user.token);
      const updatedPictureResponse = await updateCover(res[0].url, user.token);
      if (updatedPictureResponse === "ok") {
        const createPostResponse = await createPost(
          "coverPicture",
          null,
          null,
          res,
          user.id,
          user.token
        );
        if (createPostResponse === "ok") {
          setLoading(false);
          setCoverPicture("");
          coverImageRef.current.src = res[0].url;
        } else {
          setError(createPostResponse);
          setLoading(false);
        }
      } else {
        setError(updatedPictureResponse);
        setLoading(false);
      }
    } catch (error) {
      setError(error?.response?.data?.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    setWidth(coverRef.current.clientWidth);
  }, [window.innerWidth]);

  return (
    <div className="profile_cover" ref={coverRef}>
      {coverPicture && (
        <div className="save_changes_cover">
          <div className="save_changes_left">
            <i className="public_icon"></i>
            Your cover photo is public
          </div>
          <div className="save_changes_right">
            <button className="blue_btn opacity_btn" onClick={() => setCoverPicture("")}>
              Cnacel
            </button>
            <button className="blue_btn" disabled={loading} onClick={() => updateCoverPicture()}>
              {loading ? <PulseLoader color="#FFF" size={5} /> : "Save changes"}
            </button>
          </div>
        </div>
      )}
      <input
        type="file"
        onChange={handleImage}
        ref={inputRef}
        hidden
        accept="image/jpeg,image/png,image/webp,image/gif"
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
      {coverPicture && (
        <div className="cover_cropper">
          <Cropper
            image={coverPicture}
            crop={crop}
            onCropChange={setCrop}
            zoom={zoom}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
            aspect={width / 350}
            showGrid={true}
            objectFit="horizontal-cover"
          />
        </div>
      )}
      {cover && !coverPicture && (
        <img src={cover} className="cover" alt="Cover" ref={coverImageRef} />
      )}
      {!visitor && (
        <div className="udpate_cover_wrapper">
          <div className="open_cover_update" onClick={() => setShowCoverMenu((prev) => !prev)}>
            <i className="camera_filled_icon"></i>
            Add Cover Photo
          </div>
          {showCoverMneu && (
            <div className="open_cover_menu" ref={menuRef}>
              <div className="open_cover_menu_item hover1" onClick={() => setShowOldCovers(true)}>
                <i className="photo_icon"></i>
                Select Photo
              </div>
              <div className="open_cover_menu_item hover1" onClick={() => inputRef.current.click()}>
                <i className="upload_icon"></i>
                Uplaod Photo
              </div>
            </div>
          )}
        </div>
      )}
      {showOldCovers && (
        <OldCovers
          setShowOldCovers={setShowOldCovers}
          photos={photos}
          user={user}
          setCoverPicture={setCoverPicture}
        />
      )}
    </div>
  );
}
