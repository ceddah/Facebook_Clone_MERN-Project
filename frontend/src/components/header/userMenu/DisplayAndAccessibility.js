import React from "react";
import { useSelector, useDispatch } from "react-redux";

const DisplayAndAccessibility = ({ returnToMainUserMenu }) => {
  const dark = useSelector((state) => state.dark);
  const dispatch = useDispatch();
  const handleDarkModeChange = (isDark) => {
    if (isDark) {
      dispatch({
        type: "DARK",
      });
    } else {
      dispatch({
        type: "LIGHT",
      });
    }
  };
  return (
    <div className="absolute_wrap">
      <div className="absolute_wrap_header">
        <div className="circle hover1" onClick={returnToMainUserMenu}>
          <i className="arrow_back_icon"></i>
        </div>
        Display & Accessibility
      </div>
      <div className="mmenu_main">
        <div className="small_circle" style={{ width: "50px" }}>
          <i className="dark_filled_icon" />
        </div>
        <div className="mmenu_col">
          <span className="mmenu_span1">Dark Mode</span>
          <span className="mmenu_span2">
            Adjust the appeareance of Facebook to reduce glare and give your eyes a break.
          </span>
        </div>
      </div>
      <label htmlFor="darkOff" className="hover1">
        <span>Off</span>
        <input
          type="radio"
          name="dark"
          id="darkOff"
          checked={!dark && true}
          onChange={() => handleDarkModeChange(false)}
        />
      </label>
      <label htmlFor="darkOn" className="hover1">
        <span>On</span>
        <input
          type="radio"
          name="dark"
          id="darkOn"
          checked={dark && true}
          onChange={() => handleDarkModeChange(true)}
        />
      </label>

      <div className="mmenu_main">
        <div className="small_circle" style={{ width: "50px" }}>
          <i className="compact_icon" />
        </div>
        <div className="mmenu_col">
          <span className="mmenu_span1">Compact Mode</span>
          <span className="mmenu_span2">
            Make your font size smaller so more content can fit on your screen.
          </span>
        </div>
      </div>
      <label htmlFor="compactOff" className="hover1">
        <span>Off</span>
        <input type="radio" name="compact" id="compactOff" />
      </label>
      <label htmlFor="compactOn" className="hover1">
        <span>On</span>
        <input type="radio" name="compact" id="compactOn" />
      </label>
      <div className="mmenu_item hover3">
        <div className="small_circle">
          <i className="keyboard_icon" />
        </div>
        <span>Keyboard</span>
        <div className="rArrow">
          <i className="right_icon"></i>
        </div>
      </div>
    </div>
  );
};

export default DisplayAndAccessibility;
