import { useState } from "preact/hooks";

const CopyLinkButton = ({ link }) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopyLink = () => {
    navigator.clipboard
      .writeText(link)
      .then(() => {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000); // Reset after 2 seconds
      })
      .catch((err) => {
        console.error("Failed to copy link: ", err);
      });
  };

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
      <span>{link}</span>
      <button
        onClick={handleCopyLink}
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          padding: "0",
        }}
        title="Copy link"
      >
        <i className="fa fa-copy"></i> {/* Copy icon */}
      </button>
      {isCopied && <span style={{ color: "green" }}>Copied!</span>}
    </div>
  );
};

export default CopyLinkButton;