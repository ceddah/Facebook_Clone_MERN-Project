import { Routes, Route } from "react-router-dom";
import Login from "./pages/login";
import Profile from "./pages/profile";
import Home from "./pages/home";
import LoggedInRoutes from "./routes/LoggedInRoutes";
import NotLoggedInRoutes from "./routes/NotLoggedInRoutes";
import Activate from "./pages/home/activate";
import Reset from "./pages/reset";
import CreatePostPopup from "./components/createPostPopup";
import { useSelector } from "react-redux";
import { useReducer, useState } from "react";
import axios from "axios";
import { postsReducer } from "./functions/reducers";
import Friends from "./pages/friends";

function App() {
  const [{ loading, error, posts }, dispatch] = useReducer(postsReducer, {
    loading: false,
    posts: [],
    error: "",
  });
  const dark = useSelector((state) => state.dark);
  const getAllPosts = async () => {
    try {
      dispatch({
        type: "POSTS_REQUEST",
      });
      const { data } = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/getAllPosts`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      dispatch({
        type: "POSTS_SUCCESS",
        payload: data.allPosts,
      });
    } catch (error) {
      dispatch({
        type: "POSTS_ERROR",
        payload: error?.response?.data?.message,
      });
    }
  };
  const addNewPostToState = (newPost) => {
    dispatch({
      type: "POSTS_ADD_NEW_POST",
      payload: newPost,
    });
  };
  const user = useSelector((state) => state.user);
  const [createPostVisible, setCreatePostVisible] = useState(false);

  return (
    <div className={dark ? "dark" : ""}>
      {createPostVisible && (
        <CreatePostPopup
          setCreatePostVisible={setCreatePostVisible}
          user={user}
          addNewPostToState={addNewPostToState}
        />
      )}
      <Routes>
        <Route element={<NotLoggedInRoutes />}>
          <Route path="/login" element={<Login />} />
        </Route>
        <Route element={<LoggedInRoutes />}>
          <Route
            path="/"
            element={
              <Home
                posts={posts}
                getAllPosts={getAllPosts}
                setCreatePostVisible={setCreatePostVisible}
                isLoading={loading}
              />
            }
          />
          <Route path="/activate/:token" element={<Activate />} />
          <Route path="/profile" element={<Profile getAllPosts={getAllPosts} />} />
          <Route path="/friends" element={<Friends />} />
          <Route path="/friends/:type" element={<Friends />} />
          <Route path="/profile/:username" element={<Profile getAllPosts={getAllPosts} />} />
        </Route>
        <Route path="/reset" element={<Reset />} />
      </Routes>
    </div>
  );
}

export default App;
