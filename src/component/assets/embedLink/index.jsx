import React, { useEffect, useState } from "react";
import { showToast } from "../../ToastAlert";
import LoadingOverlay from "../projectOverlay.jsx";

const CopyEmbedButton = ({ embedCode }) => {
  const [showOverlay, setSHowOverlay] = useState(false);

  //   useEffect(() => {
  //       setTimeout(() => setSHowOverlay(false), 1000); // Show loading overlay for 3 seconds
  //     }, []);
  const handleCopyEmbed = () => {
    setSHowOverlay(true);

    const link = `<iframe
    height="300"
    style="width: 100%;"
    scrolling="no"
   
    src="${embedCode}"
    frameborder="no"
    loading="lazy"
    allowtransparency="true"
    allowfullscreen="true"
  ></iframe>`;
    navigator.clipboard
      .writeText(link)
      .then(() => {
        setSHowOverlay(false);
        showToast.info("Embed code copied to clipboard!");
      })
      .catch((err) => {
        console.error("Failed to copy embed code: ", err);
      });
  };

  return (
    <>
      {showOverlay ? <LoadingOverlay isVisible={true} /> : null}
      <li className="copy-embd" title="Copy Embed" onClick={handleCopyEmbed}>
        <i className="fa fa-code"></i>
      </li>
    </>
  );
};

export default CopyEmbedButton;
