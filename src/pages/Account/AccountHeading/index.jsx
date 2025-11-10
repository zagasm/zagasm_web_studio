import React, { useState } from "react";
import "./AccountHeadingStyling.css";
import { Link } from "react-router-dom";
import default_profilePicture from "../../../assets/avater_pix.avif";
import { useAuth } from "../../auth/AuthContext";
function AccountHeading() {
  const { user } = useAuth();
  const Default_user_image = user?.profileUrl
    ? user.profileUrl
    : default_profilePicture;
  const user_id = user?.id;
  const name = user?.name;
  // console.log('User in AccountHeading:', user);
  return (
    <div className="account_heading_section bg-dange">
      <div className="details_display tw:flex tw:flex-row tw:items-center tw:gap-4 tw:md:flex-col">
        <div
          style={{
            padding: 0,
            borderRadius: 20,
          }}
          className="tw:size-[200px] tw:rounded-xl tw:object-cover tw:p-0"
        >
          <img
            style={{
              width: 200,
              height: 200,
            }}
            className="tw:rounded-2xl"
            src={Default_user_image}
            loading="lazy"
          />
        </div>
        <div className="tw:text-left tw:md:text-center">
          <div className="profile_info ">
            <div>
              <span className=" tw:text-lg tw:md:text-xl tw:font-semibold">
                {name}
              </span>{" "}
              <br />
              <small>Date of Birth: {user?.dob}</small>
              <p className="follow_section tw:justify-between tw:md:justify-center tw:md:gap-4">
                <small>
                  {" "}
                  <span>{user?.followers_count}</span> following
                </small>{" "}
                <small className="tw:text-primary">•</small>
                <small>
                  {" "}
                  <span>{user?.followings_count}</span> followers
                </small>
              </p>
            </div>
          </div>
          <div className="View_Profile_button tw:text-center">
            <Link to={"/profile/" + user_id}>View profile</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AccountHeading;
