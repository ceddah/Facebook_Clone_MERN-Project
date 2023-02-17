import React from "react";
import { deletePost, savePost } from "../../functions/post";
import MenuItem from "./MenuItem";
import { saveAs } from "file-saver";

const PostMenu = ({
  postUserId,
  userId,
  imagesLength,
  menuRef,
  postId,
  token,
  checkSaved,
  setCheckSaved,
  images,
  postRef,
}) => {
  const isUserAuthorOfPost = postUserId === userId ? true : false;
  const savePosthandler = async () => {
    savePost(postId, token);

    if (checkSaved) {
      setCheckSaved(false);
    } else {
      setCheckSaved(true);
    }
  };

  const downloadImages = async () => {
    images.map((img) => {
      saveAs(img.url, "facebook-image.jpg");
    });
  };

  const handlePostRemove = async () => {
    const res = await deletePost(postId, token);
    if (res.status === "ok") {
      postRef.current.remove();
    }
  };
  return (
    <ul className="post_menu" ref={menuRef}>
      {isUserAuthorOfPost && <MenuItem icon="pin_icon" title="Pin Post" />}
      <div onClick={() => savePosthandler()}>
        {!checkSaved ? (
          <MenuItem icon="save_icon" title="Save Post" subtitle="Add this to your saved items" />
        ) : (
          <MenuItem
            icon="save_icon"
            title="Unsave Post"
            subtitle="Remove this to your saved items"
          />
        )}
      </div>
      <div className="line"></div>
      {isUserAuthorOfPost && <MenuItem icon="edit_icon" title="Edit Post" />}
      {!isUserAuthorOfPost && (
        <MenuItem icon="turnOnNotification_icon" title="Turn on notifications for this post" />
      )}
      {imagesLength && (
        <div onClick={() => downloadImages()}>
          <MenuItem icon="download_icon" title="Download Post" />
        </div>
      )}
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
        <div onClick={() => handlePostRemove()}>
          <MenuItem
            icon="trash_icon"
            title="Move to trash"
            subtitle="Items in your trash are deleted after 30 days."
          />
        </div>
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
