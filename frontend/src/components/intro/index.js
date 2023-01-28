import axios from "axios";
import React, { useEffect, useState } from "react";
import Bio from "./Bio";
import EditDetails from "./EditDetails";
import "./style.css";

const Intro = ({ details, visitor, user, rehydrateDetails }) => {
  const initial = {
    bio: details?.bio ? details.bio : "",
    otherName: details?.otherName ? details.otherName : "",
    job: details?.job ? details.job : "",
    workplace: details?.workplace ? details.workplace : "",
    highSchool: details?.highSchool ? details.highSchool : "",
    college: details?.college ? details.college : "",
    currentCity: details?.currentCity ? details.currentCity : "",
    hometown: details?.hometown ? details.hometown : "",
    relationship: details?.relationship ? details.relationship : "",
    instagram: details?.instagram ? details.instagram : "",
  };
  const [infos, setInfos] = useState({
    bio: details?.bio ? details.bio : "",
    otherName: details?.otherName ? details.otherName : "",
    job: details?.job ? details.job : "",
    workplace: details?.workplace ? details.workplace : "",
    highSchool: details?.highSchool ? details.highSchool : "",
    college: details?.college ? details.college : "",
    currentCity: details?.currentCity ? details.currentCity : "",
    hometown: details?.hometown ? details.hometown : "",
    relationship: details?.relationship ? details.relationship : "",
    instagram: details?.instagram ? details.instagram : "",
  });
  const [showBio, setShowBio] = useState(false);
  const [showEditDetails, setShowEditDetails] = useState(false);
  const [charactersRemaining, setCharactersRemaining] = useState(100 - infos?.bio.length || 100);
  const handleBioChange = (e) => {
    // setInfos((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setInfos({ ...details, [e.target.name]: e.target.value });
    setCharactersRemaining(100 - Number(e.target.value.length));
  };
  const updateDetails = async () => {
    try {
      const { data } = await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}/updateDetails`,
        {
          infos,
        },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      rehydrateDetails(data);
      setShowBio(false);
    } catch (error) {
      console.log(error?.response?.data?.message);
    }
  };
  return (
    <div className="profile_card">
      <div className="profile_card_header">Intro</div>
      {details?.bio && !showBio && (
        <div className="info_col">
          <span className="info_text">{details?.bio}</span>
          {!visitor && (
            <button onClick={() => setShowBio(true)} className="gray_btn hover1">
              Edit Bio
            </button>
          )}
        </div>
      )}
      {!details?.bio && !showBio && !visitor && (
        <button className="gray_btn hover1 w100" onClick={() => setShowBio(true)}>
          Add Bio
        </button>
      )}

      {showBio && (
        <Bio
          value={infos}
          handleBioChange={handleBioChange}
          charactersRemaining={charactersRemaining}
          setShowBio={setShowBio}
          updateDetails={updateDetails}
          placeholder="Add bio"
          name="bio"
        />
      )}
      {details?.job && details?.workplace ? (
        <div className="info_profile">
          <img src="../../../icons/job.png" alt="" />
          Works as {details?.job} at <b>{details?.workplace}</b>
        </div>
      ) : details?.job && !details?.workplace ? (
        <div className="info_profile">
          <img src="../../../icons/job.png" alt="" />
          Works as {details?.job}
        </div>
      ) : (
        details?.workplace &&
        !details?.job && (
          <div className="info_profile">
            <img src="../../../icons/job.png" alt="" />
            Works at {details?.workplace}
          </div>
        )
      )}
      {details?.relationship && (
        <div className="info_profile">
          <img src="../../../icons/relationship.png" alt="" />
          {details?.relationship}
        </div>
      )}
      {details?.college && (
        <div className="info_profile">
          <img src="../../../icons/studies.png" alt="" />
          Studied at {details?.college}
        </div>
      )}
      {details?.highSchool && (
        <div className="info_profile">
          <img src="../../../icons/studies.png" alt="" />
          High School {details?.highSchool}
        </div>
      )}
      {details?.currentCity && (
        <div className="info_profile">
          <img src="../../../icons/home.png" alt="" />
          Lives in {details?.currentCity}
        </div>
      )}
      {details?.hometown && (
        <div className="info_profile">
          <img src="../../../icons/home.png" alt="" />
          From {details?.hometown}
        </div>
      )}
      {details?.hometown && (
        <div className="info_profile">
          <img src="../../../icons/instagram.png" alt="" />
          <a
            href={`https://www.instagram.com/${details?.instagram}`}
            target="_blank"
            rel="noreferrer"
          >
            {details?.instagram}
          </a>
        </div>
      )}
      {!visitor && (
        <button onClick={() => setShowEditDetails(true)} className="gray_btn hover1 w100">
          Edit Details
        </button>
      )}
      {showEditDetails && !visitor && (
        <EditDetails
          setShowEditDetails={setShowEditDetails}
          details={details}
          handleBioChange={handleBioChange}
          updateDetails={updateDetails}
          infos={infos}
        />
      )}
      {!visitor && <button className="gray_btn hover1 w100">Add Hobbies</button>}
      {!visitor && <button className="gray_btn hover1 w100">Add Featured</button>}
    </div>
  );
};

export default Intro;
