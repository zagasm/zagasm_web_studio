import React, { useState } from "react";
import CustomModal from "../../modal/customModal";

const SocialShare = ({ title, shareUrl, onClose, isOpen, children }) => {
  const encodedUrl = encodeURIComponent(shareUrl);
  const [copied, setCopied] = useState(false);
  
  // Function to remove HTML tags from a string
  const stripHtmlTags = (html) => {
    return html.replace(/<[^>]+>/g, ""); // Remove all HTML tags
  };

  // Extract text content from children and remove HTML tags
  const getTextContent = (element) => {
    if (typeof element === "string") {
      return stripHtmlTags(element); // Remove HTML tags from strings
    }
    if (React.isValidElement(element)) {
      return getTextContent(element.props.children); // Recursively process children
    }
    if (Array.isArray(element)) {
      return element.map((child) => getTextContent(child)).join(" "); // Join array elements
    }
    return "";
  };

  const textContent = getTextContent(children);
  const encodedText = encodeURIComponent(textContent);

  const socialPlatforms = [
    {
      name: "Facebook",
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedText}`,
      icon: "fab fa-facebook",
      color: "#3b5998",
    },
    {
      name: "Twitter",
      url: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedText}`,
      icon: "fab fa-x-twitter",
      color: "#1DA1F2",
    },
    {
      name: "WhatsApp",
      url: `https://api.whatsapp.com/send?text=${encodedText}%20${encodedUrl}`,
      icon: "fab fa-whatsapp",
      color: "#25D366",
    },
    {
      name: "LinkedIn",
      url: `https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}&summary=${encodedText}`,
      icon: "fab fa-linkedin",
      color: "#0077b5",
    },
    {
      name: "Email",
      url: `mailto:?subject=${encodeURIComponent(
        `Check out this ${title}!`
      )}&body=${encodedText}%0A%0A${encodedUrl}`,
      icon: "fas fa-envelope",
      color: "#D44638",
    },
  ];

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000); // Reset copied state after 2 seconds
  };

  return (
    <CustomModal isOpen={isOpen} onClose={onClose}>
      <div className="fixed inset-0 flex items-center justify-center bg-opacity-50 z-50">
        {/* {console.log('share loding')} */}
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full p-4">
          <p className="text-sm text-dark-600 mb-4 text-center">
            Share this {title} with your friends:
          </p>
          {children}

          <div className="grid grid-cols-2 gap-3 row text-center p-4">
            {socialPlatforms.map(({ name, url, icon, color }) => (
              <a
                key={name}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center space-x-2 p-2 rounded-lg text-white col-md-12 col-lg-2"
                style={{ backgroundColor: color }}
              >
                <i className={icon}></i>
                <span>{name}</span>
              </a>
            ))}
            <a
              onClick={handleCopy}
              style={{
                cursor: "pointer",
                color: "white",
                background: "#FA6342",
              }}
              className="flex items-center justify-center space-x-2 p-2 rounded-lg col"
            >
              {copied ? "Copied!" : <span className="fa fa-copy"></span>}
            </a>
            <input
              type="text"
              style={{ display: "none" }}
              value={shareUrl}
              readOnly
              className="flex-1 bg-transparent text-gray-800 text-sm p-1 outline-none"
            />
          </div>
        </div>
      </div>
    </CustomModal>
  );
};

export default SocialShare;