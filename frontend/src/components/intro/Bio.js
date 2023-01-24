import React from "react";

const Bio = ({ infos, handleBioChange, charactersRemaining, setShowBio, updateDetails }) => {
  return (
    <div className="add_bio_wrap">
      <textarea
        className="textarea_blue details_input"
        placeholder="Add bio"
        name="bio"
        value={infos.bio}
        maxLength="100"
        onChange={handleBioChange}
      ></textarea>
      <div className="remaining">{charactersRemaining} characters remaining</div>
      <div className="flex">
        <div className="flex flex_left">
          <i className="public_icon"></i> Public
        </div>
        <div className="flex flex_right">
          <button className="gray_btn" onClick={() => setShowBio(false)}>
            Cancel
          </button>
          <button onClick={() => updateDetails()} className="blue_btn">
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default Bio;
