import React, { useEffect, useRef, useState } from "react";
import EmojiPicker from "emoji-picker-react";
import { useMediaQuery } from "react-responsive";

const postBackgrounds = [
  "https://res.cloudinary.com/dqs5qo3ts/image/upload/v1677271624/bgImages/1_hi9xjg.jpg",
  "https://res.cloudinary.com/dqs5qo3ts/image/upload/v1677271623/bgImages/2_shcwh8.jpg",
  "https://res.cloudinary.com/dqs5qo3ts/image/upload/v1677271623/bgImages/3_erfxie.jpg",
  "https://res.cloudinary.com/dqs5qo3ts/image/upload/v1677271623/bgImages/4_uwie7f.jpg",
  "https://res.cloudinary.com/dqs5qo3ts/image/upload/v1677271624/bgImages/5_sjwdz3.jpg",
  "https://res.cloudinary.com/dqs5qo3ts/image/upload/v1677271624/bgImages/6_wnwtzm.jpg",
  "https://res.cloudinary.com/dqs5qo3ts/image/upload/v1677271623/bgImages/7_jsfsek.jpg",
  "https://res.cloudinary.com/dqs5qo3ts/image/upload/v1677271624/bgImages/8_u8bvcn.jpg",
  "https://res.cloudinary.com/dqs5qo3ts/image/upload/v1677271624/bgImages/9_rzglpl.jpg",
  "https://res.cloudinary.com/dqs5qo3ts/image/upload/v1677271624/bgImages/10_hbfb4x.jpg",
];
// const postBackgrounds = [
//   "../../../images/postbackgrounds/1.jpg",
//   "../../../images/postbackgrounds/2.jpg",
//   "../../../images/postbackgrounds/3.jpg",
//   "../../../images/postbackgrounds/4.jpg",
//   "../../../images/postbackgrounds/5.jpg",
//   "../../../images/postbackgrounds/6.jpg",
//   "../../../images/postbackgrounds/7.jpg",
//   "../../../images/postbackgrounds/8.jpg",
//   "../../../images/postbackgrounds/9.jpg",
// ];

const EmojiPickerBackgrounds = ({ text, setText, user, type2, background, setBackground }) => {
  const [picker, setPicker] = useState(false);
  const [cursorPosition, setCursorPosition] = useState();
  const [showbackgrounds, setShowbackgrounds] = useState(false);
  const textRef = useRef(null);
  const bgRef = useRef(null);
  const sm = useMediaQuery({
    query: "(max-width: 550)",
  });

  const handleEmoji = (_, { emoji }) => {
    const ref = textRef.current;
    ref.focus();
    const start = text.substring(0, ref.selectionStart);
    const end = text.substring(ref.selectionStart);
    const newText = start + emoji + end;
    setText(newText);
    setCursorPosition(start.length + emoji.length);
  };

  const backgroundHandler = (i) => {
    bgRef.current.style.backgroundImage = `url(${postBackgrounds[i]})`;
    setBackground(postBackgrounds[i]);
    bgRef.current.classList.add("bgHandler");
  };
  const removeBackground = () => {
    bgRef.current.style.backgroundImage = ``;
    setBackground("");
    bgRef.current.classList.remove("bgHandler");
  };
  useEffect(() => {
    textRef.current.selectionEnd = cursorPosition;
  }, [cursorPosition]);
  return (
    <div className={`${type2 ? "images_input" : ""}`}>
      <div className={`${!type2 ? "flex_center" : ""}`} ref={bgRef}>
        <textarea
          ref={textRef}
          maxLength="250"
          value={text}
          style={{
            paddingTop: `${background ? Math.abs(textRef.current.value.length * 0.1 - 32) : "0"}%`,
          }}
          onChange={(e) => setText(e.target.value)}
          placeholder={`What's on your mind ${user?.first_name}?`}
          className={`post_input ${type2 ? "input2" : ""} ${sm && !background && "l0"}`}
        ></textarea>
      </div>
      <div className={`${!type2 ? "post_emojis_wrap" : ""}`}>
        {picker && (
          <div className={`comment_emoji_picker ${type2 ? "movepicker2" : "rlmove"}`}>
            <EmojiPicker onEmojiClick={handleEmoji} />
          </div>
        )}
        {!type2 && (
          <img
            onClick={() => setShowbackgrounds((c) => !c)}
            src="../../../icons/colorful.png"
            alt="colorful"
          />
        )}
        {!type2 && showbackgrounds && (
          <div className="post_backgrounds">
            <div className="no_bg" onClick={() => removeBackground()}></div>
            {postBackgrounds.map((bg, i) => (
              <img src={bg} key={i + 5} alt="bg" onClick={() => backgroundHandler(i)} />
            ))}
          </div>
        )}
        <i
          className={`emoji_icon_large ${type2 ? "moveleft" : ""}`}
          onClick={() => setPicker((c) => !c)}
        ></i>
      </div>
    </div>
  );
};

export default EmojiPickerBackgrounds;
