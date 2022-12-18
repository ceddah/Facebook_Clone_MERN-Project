import React, { useEffect, useRef, useState } from "react";
import useClickOutside from "../../helpers/clickOutside";
import { Return, Search } from "../../svg";

const SearchMenu = ({ color, closeSearchMenu }) => {
  const [iconVisible, setIconVisible] = useState(false);
  const menuRef = useRef(null);
  const inputRef = useRef(null);
  useClickOutside(menuRef, () => {
    closeSearchMenu();
  });

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  return (
    <div ref={menuRef} className="header_left search_area scrollbar">
      <div className="search_wrap">
        <div className="header_logo">
          <div className="circle hover1" onClick={closeSearchMenu}>
            <Return color={color} />
          </div>
        </div>
        <div className="search" onClick={() => inputRef.current.focus()}>
          {iconVisible && (
            <div>
              <Search color={color} />
            </div>
          )}
          <input
            type="text"
            placeholder="Search Facebook"
            ref={inputRef}
            onFocus={() => setIconVisible(false)}
            onBlur={() => setIconVisible(true)}
          />
        </div>
      </div>
      <div className="search_history_header">
        <span>Recent Searches</span>
        <a href="!#">Edit</a>
      </div>
      <div className="search-history">
        <div className="search_results scrollbar"></div>
      </div>
    </div>
  );
};

export default SearchMenu;
