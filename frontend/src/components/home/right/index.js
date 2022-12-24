import React from "react";
import { Dots, NewRoom, Search } from "../../../svg";
import Contact from "./Contact";
import "./style.css";

const RightHome = () => {
  return (
    <div className="right_home">
      <div className="heading">Sponsor</div>
      <div className="splitter1" />
      <div className="contacts_wrap">
        <div className="contacts_header">
          <div className="contacts_header_left">Contacts</div>
          <div className="contacts_header_right">
            <div className="contact_circle">
              <NewRoom color="#65676P" />
            </div>
            <div className="contact_circle">
              <Search color="#65676P" />
            </div>
            <div className="contact_circle">
              <Dots color="#65676P" />
            </div>
          </div>
        </div>
        <div className="contacts_list">
          <Contact />
        </div>
      </div>
    </div>
  );
};

export default RightHome;
