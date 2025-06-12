import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function Dropdown({ title, children }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <a style={{cursor:'pointer'}} data-ripple="" onClick={() => setIsOpen(!isOpen)}>
        {title} 
      </a>
      {isOpen && (
        children
      )}
    </>
  );
}
