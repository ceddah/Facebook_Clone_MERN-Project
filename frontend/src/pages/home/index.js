import React, { useRef } from "react";
import Header from "../../components/header";
import useClickOutside from "../../helpers/clickOutside";

const Home = () => {
  const ref = useRef(null);
  useClickOutside(ref, () => {
    ref.current.style.display = "none";
  });
  return (
    <div>
      <Header />
      <div className="card" ref={ref}></div>
    </div>
  );
};

export default Home;
