import React from "react";

const reactsArray = [
  {
    name: "like",
    image: "../../../reacts/like.gif",
  },
  {
    name: "love",
    image: "../../../reacts/love.gif",
  },
  {
    name: "haha",
    image: "../../../reacts/haha.gif",
  },
  {
    name: "wow",
    image: "../../../reacts/wow.gif",
  },
  {
    name: "sad",
    image: "../../../reacts/sad.gif",
  },
  {
    name: "angry",
    image: "../../../reacts/angry.gif",
  },
];
const ReactsPopup = ({ visible, setVisible, reactionHandler }) => {
  return visible ? (
    <div
      className="reacts_popup"
      onMouseOver={() => {
        setTimeout(() => setVisible(true), 500);
      }}
      onMouseLeave={() => {
        setTimeout(() => setVisible(false), 500);
      }}
    >
      {reactsArray.map((react, i) => (
        <div key={i} className="react" onClick={() => reactionHandler(react.name)}>
          <img src={react.image} alt="reaction" />
        </div>
      ))}
    </div>
  ) : null;
};

export default ReactsPopup;
