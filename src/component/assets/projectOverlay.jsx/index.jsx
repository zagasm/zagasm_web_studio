import React from "react";
import { ClipLoader } from "react-spinners";
const LoadingOverlay = ({  isVisible }) => {
  if (!isVisible) return null; // Don't render if not visible
// console.log(isVisible);
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(12, 11, 11, 0.5)", // Semi-transparent black
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 999999999999999999999999999999999999999999999999999, // Ensure it's on top of other elements
      }}
    >
      <p
        style={{
          color: "white",
          fontSize: "2rem",
          fontWeight: "bold",
          textAlign: "center",
        }}
      >
         <ClipLoader color="#ffffff" size={50} /> {/* Spinner */}
      </p>
    </div>
  );
};

export default LoadingOverlay;