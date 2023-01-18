import React from "react";
import MenuItem from "./MenuItem";

const PostMenu = ({ postUserId, userId, imagesLength, menuRef }) => {
  const isUserAuthorOfPost = postUserId === userId ? true : false;
  return (
    <ul className="post_menu" ref={menuRef}>
      {isUserAuthorOfPost && <MenuItem icon="pin_icon" title="Pin Post" />}
      <MenuItem icon="save_icon" title="Save Post" subtitle="Add this to your saved items" />
      <div className="line"></div>
      {isUserAuthorOfPost && <MenuItem icon="edit_icon" title="Edit Post" />}
      {!isUserAuthorOfPost && (
        <MenuItem icon="turnOnNotification_icon" title="Turn on notifications for this post" />
      )}
      {imagesLength && <MenuItem icon="download_icon" title="Download Post" />}
      {imagesLength && <MenuItem icon="fullscreen_icon" title="Enter fullscreen" />}
      {isUserAuthorOfPost && <MenuItem img="../../../icons/lock.png" title="Edit audiance" />}
      {isUserAuthorOfPost && (
        <MenuItem icon="turnOffNotifications_icon" title="Turn off notifications for this post" />
      )}
      {isUserAuthorOfPost && <MenuItem icon="delete_icon" title="Turn off translations" />}
      {isUserAuthorOfPost && <MenuItem icon="date_icon" title="Edit Date" />}
      {isUserAuthorOfPost && <MenuItem icon="refresh_icon" title="Refresh share attachments" />}
      {isUserAuthorOfPost && <MenuItem icon="archive_icon" title="Move to archive" />}
      {isUserAuthorOfPost && (
        <MenuItem
          icon="trash_icon"
          title="Move to trash"
          subtitle="Items in your trash are deleted after 30 days."
        />
      )}
      {!isUserAuthorOfPost && (
        <>
          <div className="line"></div>
          <MenuItem
            img="../../../icons/report.png"
            title="Report post"
            subtitle="I'm concerned about this post."
          />
        </>
      )}
    </ul>
  );
};

export default PostMenu;
