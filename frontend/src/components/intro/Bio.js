import React from "react";

const Bio = ({
  infos,
  handleBioChange,
  charactersRemaining,
  setShowBio,
  updateDetails,
  placeholder,
  name,
  rel,
  setShow,
  detail,
}) => {
  return (
    <div className="add_bio_wrap">
      {rel ? (
        <select
          className="select_rel"
          name={name}
          // value={infos.relationship}
          defaultValue={infos.relationship}
          onChange={handleBioChange}
        >
          <option value="Single">Single</option>
          <option value="In a relationship">In a relationship</option>
          <option value="Married">Married</option>
          <option value="Divorced">Divorced</option>
        </select>
      ) : (
        <textarea
          placeholder={placeholder}
          name={name}
          value={infos?.[name]}
          maxLength={detail ? 25 : 100}
          className="textarea_blue details_input"
          onChange={handleBioChange}
        ></textarea>
      )}
      {!detail && <div className="remaining">{charactersRemaining} characters remaining</div>}
      <div className="flex">
        <div className="flex flex_left">
          <i className="public_icon"></i>Public
        </div>
        <div className="flex flex_right">
          <button
            className="gray_btn"
            onClick={() => (!detail ? setShowBio(false) : setShow(false))}
          >
            Cancel
          </button>
          <button
            className="blue_btn"
            onClick={() => {
              updateDetails();
              setShow(false);
            }}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default Bio;
