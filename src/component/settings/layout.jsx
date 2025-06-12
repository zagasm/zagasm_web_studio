import React from "react";
import { Outlet } from "react-router-dom";
import SettingsNavBar from "./leftNav";
import ProfilePageHeading from "./heading";
const Settings = () => {
  return (
    <section>
      <div className="gap2 gray-bg">
        <div className="container">
          <div className="row">
            <div className="col-lg-10 offset-lg-1">
              <div className="row merged20" id="page-contents">
                <ProfilePageHeading />
              {/* <h2>Settings</h2> */}
                <SettingsNavBar />
                <div className="col-lg-9 col-sm-12 outlet_section p-0">
                  <div className="central-meta p-3">
                    {/* <div className="about"> */}
                      {/* <div className="d-flex flex-row "> */}
                        <Outlet />
                      {/* </div> */}
                    {/* </div> */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Settings;
