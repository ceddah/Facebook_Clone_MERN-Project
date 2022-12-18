import React from "react";

const SettingsPrivacy = ({ returnToMainUserMenu }) => {
  return (
    <div className="absolute_wrap">
      <div className="absolute_wrap_header">
        <div className="circle hover1" onClick={returnToMainUserMenu}>
          <i className="arrow_back_icon" />
        </div>
        Help & Support
      </div>
      <div className="mmenu_item hover3">
        <div className="small_circle">
          <div className="help_center_icon" />
        </div>
        <span>Help Center</span>
      </div>
      <div className="mmenu_item hover3">
        <div className="small_circle">
          <div className="email_icon" />
        </div>
        <span>Support Inbox</span>
      </div>
      <div className="mmenu_item hover3">
        <div className="small_circle">
          <div className="info_filled_icon" />
        </div>
        <span>Report A Problem</span>
      </div>
    </div>
  );
};

export default SettingsPrivacy;
