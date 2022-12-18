import React from "react";

const SettingsPrivacy = ({ returnToMainUserMenu }) => {
  return (
    <div className="absolute_wrap">
      <div className="absolute_wrap_header">
        <div className="circle hover1" onClick={returnToMainUserMenu}>
          <i className="arrow_back_icon" />
        </div>
        Settings & Privacy
      </div>
      <div className="mmenu_item hover3">
        <div className="small_circle">
          <div className="settings_filled_icon" />
        </div>
        <span>Settings</span>
      </div>
      <div className="mmenu_item hover3">
        <div className="small_circle">
          <div className="privacy_checkup_icon" />
        </div>
        <span>Privacy Checkup</span>
      </div>
      <div className="mmenu_item hover3">
        <div className="small_circle">
          <div className="privacy_shortcuts_icon" />
        </div>
        <span>Privacy Shortcuts</span>
      </div>
      <div className="mmenu_item hover3">
        <div className="small_circle">
          <div className="activity_log_icon" />
        </div>
        <span>Activity Log</span>
      </div>
      <div className="mmenu_item hover3">
        <div className="small_circle">
          <div className="news_icon" />
        </div>
        <span>Use Feed Preferences</span>
      </div>
      <div className="mmenu_item hover3">
        <div className="small_circle">
          <div className="language_icon" />
        </div>
        <span>Language</span>
      </div>
    </div>
  );
};

export default SettingsPrivacy;
