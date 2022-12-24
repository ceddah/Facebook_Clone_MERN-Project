import { Routes, Route } from "react-router-dom";
import Login from "./pages/login";
import Profile from "./pages/profile";
import Home from "./pages/home";
import LoggedInRoutes from "./routes/LoggedInRoutes";
import NotLoggedInRoutes from "./routes/NotLoggedInRoutes";

function App() {
  return (
    <div>
      <Routes>
        <Route element={<NotLoggedInRoutes />}>
          <Route path="/login" element={<Login />} />
        </Route>
        <Route element={<LoggedInRoutes />}>
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
