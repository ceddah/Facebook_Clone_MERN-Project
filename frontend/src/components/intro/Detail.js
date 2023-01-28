import React, { useState } from "react";
import Bio from "./Bio";

const Detail = ({
  value,
  img,
  placeholder,
  name,
  handleBioChange,
  updateDetails,
  infos,
  rel,
  text,
}) => {
  const [show, setShow] = useState(false);
  return (
    <div>
      <div className="add_details_flex " onClick={() => setShow(true)}>
        {value ? (
          <div className="info_profile ">
            <img src={`../../../icons/${img}.png`} alt="" />
            {value}
            <i className="edit_icon"></i>
          </div>
        ) : (
          <>
            <i className="rounded_plus_icon"></i>
            <span className="underline">Add {text}</span>
          </>
        )}
      </div>
      {show && (
        <Bio
          placeholder={placeholder}
          name={name}
          handleBioChange={handleBioChange}
          updateDetails={updateDetails}
          infos={infos}
          detail
          setShow={setShow}
          rel={rel}
        />
      )}
    </div>
  );
};

export default Detail;
