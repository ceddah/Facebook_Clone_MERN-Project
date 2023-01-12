import React, { useEffect, useRef, useState } from "react";
import EmojiPicker from "emoji-picker-react";

const EmojiPickerBackgrounds = ({ text, setText, user, type2 }) => {
  const [picker, setPicker] = useState(false);
  const [cursorPosition, setCursorPosition] = useState();
  const textRef = useRef(null);
  const handleEmoji = (_, { emoji }) => {
    const ref = textRef.current;
    ref.focus();
    const start = text.substring(0, ref.selectionStart);
    const end = text.substring(ref.selectionStart);
    const newText = start + emoji + end;
    setText(newText);
    setCursorPosition(start.length + emoji.length);
  };
  useEffect(() => {
    textRef.current.selectionEnd = cursorPosition;
  }, [cursorPosition]);
  return (
    <div className={`${type2 ? "images_input" : ""}`}>
      <div className={`${!type2 ? "flex_center" : ""}`}>
        <textarea
          ref={textRef}
          maxLength="100"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={`What's on your mind ${user?.first_name}?`}
          className={`post_input ${type2 ? "input2" : ""}`}
        ></textarea>
      </div>
      <div className={`${!type2 ? "post_emojis_wrap" : ""}`}>
        {picker && (
          <div className={`comment_emoji_picker ${type2 ? "movepicker2" : "rlmove"}`}>
            <EmojiPicker onEmojiClick={handleEmoji} />
          </div>
        )}
        {!type2 && <img src="../../../icons/colorful.png" alt="colorful" />}
        <i
          className={`emoji_icon_large ${type2 ? "moveleft" : ""}`}
          onClick={() => setPicker((c) => !c)}
        ></i>
      </div>
    </div>
  );
};

export default EmojiPickerBackgrounds;
