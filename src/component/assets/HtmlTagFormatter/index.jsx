import React from "react";
import DOMPurify from "dompurify"; // For sanitizing HTML
import './style.css';

const HTMLFormatter = ({ children, fontSize = "15px" }) => {
  // Sanitize the HTML content to prevent XSS attacks
  const sanitizedHTML = DOMPurify.sanitize(children);

  return (
    <div 
      className="HTMLFORMATTER_content" 
      style={{ fontSize: fontSize }} // Apply dynamic font size
      dangerouslySetInnerHTML={{ __html: sanitizedHTML }}
    />
  );
};

export default HTMLFormatter;