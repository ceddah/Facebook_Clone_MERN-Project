import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  ArrowDown,
  Friends,
  Gaming,
  HomeActive,
  Logo,
  Market,
  Menu,
  Notifications,
  Search,
  Watch,
  Messenger,
} from "../../svg";
import "./style.css";
import SearchMenu from "./SearchMenu";
import AllMenu from "./AllMenu";
import useClickOutside from "../../helpers/clickOutside";
import UserMenu from "./userMenu";

const Header = () => {
  const user = useSelector((state) => state.user);
  const [showAllMenu, setShowAllMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const color = "#65676B";
  const [showSearchMenu, setShowSearchMenu] = useState(false);
  const allMenuRef = useRef(null);
  const userMenuRef = useRef(null);
  useClickOutside(allMenuRef, () => {
    setShowAllMenu(false);
  });
  useClickOutside(userMenuRef, () => {
    setShowUserMenu(false);
  });
  return (
    <header>
      <div className="header_left">
        <Link to="/" className="header_logo">
          <div className="circle">
            <Logo />
          </div>
        </Link>
        <div className="search search1" onClick={() => setShowSearchMenu(true)}>
          <Search color={color} />
          <input type="text" placeholder="Search Facebook" className="hide_input" />
        </div>
      </div>
      {showSearchMenu && (
        <SearchMenu closeSearchMenu={() => setShowSearchMenu(false)} color={color} />
      )}
      <div className="header_middle">
        <Link to="/" className="middle_icon active">
          <HomeActive color={color} />
        </Link>
        <Link to="/" className="middle_icon hover1">
          <Friends color={color} />
        </Link>
        <Link to="/" className="middle_icon hover1">
          <Watch color={color} />
          <div className="middle_notification">9+</div>
        </Link>
        <Link to="/" className="middle_icon hover1">
          <Market color={color} />
        </Link>
        <Link to="/" className="middle_icon hover1">
          <Gaming color={color} />
        </Link>
      </div>
      <div className="header_right">
        <Link to="/profile" className="profile_link hover1">
          <img src={user?.picture} alt={user.first_name} />
          <span>{user?.first_name}</span>
        </Link>
        <div
          ref={allMenuRef}
          className={`circle_icon hover1 ${showAllMenu ? "active_header" : null}`}
        >
          <div onClick={() => setShowAllMenu((c) => !c)}>
            <Menu />
          </div>
          {showAllMenu && <AllMenu />}
        </div>
        <div className="circle_icon hover1">
          <Messenger />
        </div>
        <div className="circle_icon hover1">
          <Notifications />
          <div className="right_notification">5</div>
        </div>
        <div
          ref={userMenuRef}
          className={`circle_icon hover1 ${showUserMenu ? "active_header" : null}`}
        >
          <div onClick={() => setShowUserMenu((c) => !c)}>
            <ArrowDown />
          </div>
          {showUserMenu && <UserMenu user={user} />}
        </div>
      </div>
    </header>
  );
};

export default Header;
