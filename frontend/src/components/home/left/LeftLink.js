import React from "react";

const LeftLink = ({ img, text, notification }) => {
  return (
    <div className="left_link hover2">
      <img src={`../../../left/${img}.png`} alt={text} />
      {notification !== undefined ? (
        <div className="col">
          <div className="col_1">{text}</div>
          <div className="col_2">{notification}</div>
        </div>
      ) : (
        <span>{text}</span>
      )}
    </div>
  );
};

export default LeftLink;
