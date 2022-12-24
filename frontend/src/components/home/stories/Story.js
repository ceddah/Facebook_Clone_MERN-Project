import React from "react";

const Story = ({ story }) => {
  return (
    <div className="story">
      <img src={story.image} className="story_img" alt="story" />
      <div className="story_profile_pic">
        <img src={story.profile_picture} alt="story profile" />
      </div>
      <div className="story_profile_name">{story.profile_name}</div>
    </div>
  );
};

export default Story;
