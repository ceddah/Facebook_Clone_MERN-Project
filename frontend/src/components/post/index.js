import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import Moment from "react-moment";
import "./styles.css";
import { Dots, Public } from "../../svg";
import ReactsPopup from "./ReactsPopup";
import CreateComment from "./CreateComment";
import PostMenu from "./PostMenu";
import useClickOutside from "../../helpers/clickOutside";
import { getReacts, reactPost } from "../../functions/post";
import Comment from "./Comment";

const Post = ({ post, onImageLoad, user, isOnProfile }) => {
  const [visible, setVisible] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [reacts, setReacts] = useState();
  const [check, setCheck] = useState();
  const [checkSaved, setCheckSaved] = useState();
  const [comments, setComments] = useState([]);
  const [count, setCount] = useState(1);
  const [totalReacts, setTotalReacts] = useState(0);
  const menuRef = useRef(null);
  const postRef = useRef(null);
  useClickOutside(menuRef, () => setShowMenu(false));
  const getPostReacts = async () => {
    const res = await getReacts(post._id, user.token);
    setReacts(res.reacts);
    setCheck(res.check);
    setTotalReacts(res.total);
    setCheckSaved(res.checkSaved);
  };

  const reactionHandler = async (type) => {
    reactPost(post._id, type, user.token);
    if (check == type) {
      setCheck();
      let index = reacts.findIndex((x) => x.react == check);
      if (index !== -1) {
        setReacts([...reacts, (reacts[index].count = --reacts[index].count)]);
        setTotalReacts((prev) => --prev);
      }
    } else {
      setCheck(type);
      let index = reacts.findIndex((x) => x.react == type);
      let index1 = reacts.findIndex((x) => x.react == check);
      if (index !== -1) {
        setReacts([...reacts, (reacts[index].count = ++reacts[index].count)]);
        setTotalReacts((prev) => ++prev);
      }
      if (index1 !== -1) {
        setReacts([...reacts, (reacts[index1].count = --reacts[index1].count)]);
        setTotalReacts((prev) => --prev);
      }
    }
  };

  const showMore = () => {
    setCount((prev) => prev + 3);
  };

  useEffect(() => {
    getPostReacts();
    setComments(post?.comments);
  }, [post]);
  return (
    <div className="post" style={{ width: `${isOnProfile && "100%"}` }} ref={postRef}>
      <div className="post_header">
        <Link className="post_header_left" to={`/profile/${post.user.username}`}>
          <img src={post.user.picture} alt={post.user.first_name} />
          <div className="header_col">
            <div className="post_profile_name">
              {post.user.first_name} {post.user.last_name}
              <div className="updated_p">
                {post.type === "profilePicture" &&
                  `updated ${post.user.gender === "Male" ? "his" : "her"} profile picture`}
                {post.type === "coverPicture" &&
                  `updated ${post.user.gender === "Male" ? "his" : "her"} cover picture`}
              </div>
            </div>
            <div className="post_profile_privacy_date">
              <Moment fromNow interval={30}>
                {post.createdAt}
              </Moment>
              . {` `}
              <Public color="#828387" />
            </div>
          </div>
        </Link>
        <div className="post_header_right hover1" onClick={() => setShowMenu((c) => !c)}>
          <Dots color="#828387" />
        </div>
      </div>
      {post.background ? (
        <div className="post_bg" style={{ backgroundImage: `url(${post.background})` }}>
          <div className="post_bg_text">{post.text}</div>
        </div>
      ) : post.type === null ? (
        <>
          <div className="post_text">{post.text}</div>
          {post.images && post.images.length && (
            <div
              className={
                post.images.length === 1
                  ? "grid_1"
                  : post.images.length === 2
                  ? "grid_2"
                  : post.images.length === 3
                  ? "grid_3"
                  : post.images.length === 4
                  ? "grid_4"
                  : post.images.length >= 5 && "grid_5"
              }
            >
              {post.images.slice(0, 5).map((image, i) => (
                <img
                  onLoad={onImageLoad}
                  src={image.url}
                  key={i}
                  alt="post_image"
                  className={`img-${i}`}
                />
              ))}
              {post.images.length > 5 && (
                <div className="more-pics-shadow">+{post.images.length - 5}</div>
              )}
            </div>
          )}
        </>
      ) : post.type === "profilePicture" ? (
        <div className="post_profile_wrap">
          <div className="post_updated_bg">
            {post.user?.cover && <img src={post.user?.cover} alt="" />}
          </div>
          <img src={post.images[0].url} alt="profile pic" className="post_updated_picture" />
        </div>
      ) : (
        <div className="post_cover_wrap">
          <img src={post.images[0].url} alt="cover" />
        </div>
      )}
      <div className="post_infos">
        <div className="reacts_count">
          <div className="reacts_count_imgs">
            {reacts &&
              reacts
                .sort((a, b) => b.count - a.count)
                .slice(0, 3)
                .map(
                  (react, i) =>
                    react.count > 0 && (
                      <img
                        key={`${react.react}-${i}`}
                        src={`../../../reacts/${react.react}.svg`}
                        alt={`${react.react} emoji`}
                      />
                    )
                )}
          </div>
          <div className="react_count_num">{totalReacts > 0 && totalReacts}</div>
        </div>
        <div className="to_right">
          <div className="comments_count">{comments.length} comments</div>
          <div className="share_count">1 share</div>
        </div>
      </div>
      <div className="post_actions">
        <ReactsPopup visible={visible} setVisible={setVisible} reactionHandler={reactionHandler} />
        <div
          className="post_action hover1"
          onMouseOver={() => {
            setTimeout(() => setVisible(true), 500);
          }}
          onMouseLeave={() => {
            setTimeout(() => setVisible(false), 500);
          }}
          onClick={() => reactionHandler(check ? check : "like")}
        >
          {check ? (
            <img
              style={{ width: "18px" }}
              src={`../../../reacts/${check}.svg`}
              alt={`${check} emoji`}
            />
          ) : (
            <i className="like_icon"></i>
          )}
          <span
            style={{
              color: `${
                check === "like"
                  ? "#4267b2"
                  : check === "love"
                  ? "#f63459"
                  : check === "haha"
                  ? "#f7b125"
                  : check === "sad"
                  ? "#f7b125"
                  : check === "wow"
                  ? "#f7b125"
                  : check === "angry"
                  ? "#e4605a"
                  : ""
              }`,
            }}
          >
            {check ? `${check[0].toUpperCase()}${check.slice(1, check.length)}` : "Like"}
          </span>
        </div>
        <div className="post_action hover1">
          <i className="comment_icon"></i>
          <span>Comment</span>
        </div>
        <div className="post_action hover1">
          <i className="share_icon"></i>
          <span>Share</span>
        </div>
      </div>
      <div className="comments_wrap">
        <div className="comments_order"></div>
        <CreateComment
          user={user}
          postId={post._id}
          setComments={setComments}
          setCount={setCount}
        />
        {comments &&
          comments
            .slice(0, count)
            .sort((a, b) => {
              return new Date(b.commentAt) - new Date(a.commentAt);
            })
            .map((comment) => <Comment comment={comment} key={comment.commentAt.toString()} />)}
        {count < comments.length && (
          <div onClick={() => showMore()} className="view_comments">
            View more comments
          </div>
        )}
      </div>
      {showMenu && (
        <PostMenu
          menuRef={menuRef}
          userId={user?.id}
          postUserId={post?.user?._id}
          imagesLength={post?.images?.length}
          postId={post._id}
          token={user.token}
          checkSaved={checkSaved}
          setCheckSaved={setCheckSaved}
          images={post?.images}
          postRef={postRef}
        />
      )}
    </div>
  );
};

export default Post;
