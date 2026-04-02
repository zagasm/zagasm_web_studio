

import { useEffect, useState } from "react";
import "./preloader.css"; // Import styles
import zagasmLogo from "../../../assets/zagasm_studio_logo.png";
const FullpagePreloader = ({ loading }) => {
  return (
    <div className={`preloader ${loading ? "show" : "hide"}`}>
      <img src={zagasmLogo}  alt="Zagasm studio Logo" className="preloader-logo" />
    </div>
  );
};

export default FullpagePreloader;

