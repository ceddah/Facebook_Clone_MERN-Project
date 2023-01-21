import axios from "axios";
import React, { useEffect, useReducer } from "react";
import { photosReducer } from "../../functions/reducers";

const Photos = ({ user, username }) => {
  const [{ loading, error, photos }, dispatch] = useReducer(photosReducer, {
    loading: false,
    photos: [],
    error: "",
  });
  const path = `${username}/*`;
  const max = 30;
  const sort = "desc";

  const getPhotosData = async () => {
    try {
      dispatch({
        type: "PHOTOS_REQUEST",
      });
      const { data } = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/listImages`,
        {
          path,
          max,
          sort,
        },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      dispatch({
        type: "PHOTOS_SUCCESS",
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: "PHOTOS_ERROR",
        payload: error?.response?.data?.message,
      });
    }
  };
  useEffect(() => {
    getPhotosData();
  }, [username]);
  return (
    <div className="profile_card">
      <div className="profile_card_heahder">
        Photos
        <div className="profile_header_link">See all photos</div>
      </div>
      <div className="profile_card_count">
        {photos.total_count === 0
          ? null
          : photos.total_count === 1
          ? "1 Photo"
          : `${photos.total_count} photos`}
      </div>
      <div className="profile_card_grid">
        {photos.resources &&
          photos.resources.slice(0, 9).map((photo) => (
            <div className="profile_photo_card" key={photo.public_id}>
              <img src={photo.secure_url} alt="all your photos" />
            </div>
          ))}
      </div>
    </div>
  );
};

export default Photos;
