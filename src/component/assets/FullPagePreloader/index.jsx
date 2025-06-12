// import { useState, useEffect } from "react";
// import "./Preloader.css"; // Import styles

// const FullpagePreloader = ({ loading }) => {
//     return (
//       <div className={`preloader ${loading ? "show" : "hide"}`}>
//         <div className="spinner"></div>
//       </div>
//     );
//   };

// export default FullpagePreloader;
// import { useState, useEffect } from "react";
// import "./Preloader.css"; // Import styles

// const FullpagePreloader = ({ loading }) => {
//   const [text, setText] = useState(""); // State to store typed text
//   const fullText = "POKIVILLAGE"; // Text to display

//   useEffect(() => {
//     if (loading) {
//       setText(""); // Reset text when loading starts
//       let i = 0;
//       const interval = setInterval(() => {
//         if (i < fullText.length) {
//           setText((prev) => prev + fullText[i]);
//           i++;
//         } else {
//           clearInterval(interval);
//         }
//       }, 200); // Typing speed (adjust if needed)
      
//       return () => clearInterval(interval);
//     }
//   }, [loading]);

//   return (
//     <div className={`preloader ${loading ? "show" : "hide"}`}>
//       <div className="typing-text">{text}</div>
//     </div>
//   );
// };

// export default FullpagePreloader;

import { useEffect, useState } from "react";
import "./Preloader.css"; // Import styles
// import Pokilogo_light from "../../../assets/Pokilogo_light.png";
// import Pokilogo_dark from "../../../assets/Pokilogo_dark.png";

const FullpagePreloader = ({ loading }) => {
  return (
    <div className={`preloader ${loading ? "show" : "hide"}`}>
      {/* <img src={Pokilogo_dark} alt="Pokivillage Logo" className="preloader-logo" /> */}
    </div>
  );
};

export default FullpagePreloader;

