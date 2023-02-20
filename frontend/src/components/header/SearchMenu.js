import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  addToSearchHistory,
  getSearchHistory,
  removeFromSearch,
  search,
} from "../../functions/user";
import useClickOutside from "../../helpers/clickOutside";
import { Return, Search } from "../../svg";

const SearchMenu = ({ color, closeSearchMenu, token }) => {
  const [iconVisible, setIconVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);
  const [searchHistory, setSearchHistory] = useState([]);
  const menuRef = useRef(null);
  const inputRef = useRef(null);

  const getHistory = async () => {
    const data = await getSearchHistory(token);
    setSearchHistory(data);
  };

  const searchHandler = async () => {
    if (searchTerm === "") {
      setResults([]);
    } else {
      const res = await search(searchTerm, token);
      setResults(res);
    }
  };

  const addToHistoryHandler = async (id) => {
    await addToSearchHistory(id, token);
    getHistory();
  };

  const removeFromHistoryHandler = async (searchUser) => {
    await removeFromSearch(searchUser, token);
    getHistory();
  };

  useClickOutside(menuRef, () => {
    closeSearchMenu();
  });

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  useEffect(() => {
    getHistory();
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
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyUp={searchHandler}
            onFocus={() => setIconVisible(false)}
            onBlur={() => setIconVisible(true)}
          />
        </div>
      </div>
      {!results.length && (
        <div className="search_history_header">
          <span>Recent Searches</span>
          <a href="!#">Edit</a>
        </div>
      )}
      <div className="search_history scrollbar">
        {searchHistory &&
          !results.length &&
          searchHistory
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .map(({ user }) => (
              <div className="search_user_item hover1" key={user._id}>
                <Link
                  to={`/profile/${user.username}`}
                  className="flex"
                  onClick={() => addToHistoryHandler(user._id)}
                >
                  <img src={user.picture} alt={user.first_name} />
                  <span>
                    {user.first_name} {user.last_name}
                  </span>
                </Link>
                <i onClick={() => removeFromHistoryHandler(user._id)} className="exit_icon"></i>
              </div>
            ))}
      </div>
      <div className="search_results scrollbar">
        {results &&
          results.map((user) => (
            <Link
              key={user._id}
              to={`/profile/${user.username}`}
              className="search_user_item"
              onClick={() => addToHistoryHandler(user._id)}
            >
              <img src={user.picture} alt={user.first_name} />
              <span>
                {user.first_name} {user.last_name}
              </span>
            </Link>
          ))}
      </div>
    </div>
  );
};

export default SearchMenu;
