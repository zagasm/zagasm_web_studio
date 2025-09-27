

import { useEffect, useState } from "react";
import "./preloader.css"; // Import styles
import logoMobile from '../../../assets/ZAGASM_LOGO_ICON_V2_350PX.png';
import logo from '../../../assets/zagasm_logo.png';
import zagasmLogo from "../../../assets/zagasm_logo.png";
const FullpagePreloader = ({ loading }) => {
  return (
    <div className={`preloader ${loading ? "show" : "hide"}`}>
      <img src={zagasmLogo}  alt="Zagasm studio Logo" className="preloader-logo" />
    </div>
  );
};

export default FullpagePreloader;

