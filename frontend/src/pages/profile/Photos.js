import React from "react";

const Photos = ({ photos }) => {
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
