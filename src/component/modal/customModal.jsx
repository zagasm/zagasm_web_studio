import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import { Modal } from "react-bootstrap"; // Assuming you're using Bootstrap Modal
import "./CustomModal.css"; // Import styles
import LoadingOverlay from "../assets/projectOverlay.jsx";
import { useState } from "react";

const CustomModal = ({ isOpen, onClose, children, title }) => {
  const [showOverlay, setSHowOverlay] = useState(false);
  if (!isOpen) return null; // Don't render if modal is closed
  useEffect(()=>{
    setSHowOverlay(true);
    setTimeout(() => setSHowOverlay(false), 200); // Show loading overlay for 3 seconds
  },[])
  return ReactDOM.createPortal(
    // <div className="modal-overlay" onClick={onClose}>
 <>
   {showOverlay ? <LoadingOverlay isVisible={true} />: null}
    <Modal
        show={isOpen}
        onHide={onClose}
        backdrop="static"
        size="lg" // Extra Large Modal
         
        top// Centers the modal
        animation={true} // Enables animation
        className="custom-modal"
        keyboard={false}
      >
        <Modal.Header closeButton onClick={onClose}>
         { title && <Modal.Title>{title}</Modal.Title>}
        </Modal.Header>
        <Modal.Body onClick={(e) => e.stopPropagation()}>{children} </Modal.Body>
      </Modal> 
 </>
    ,
    document.body // Mounts modal outside of its parent
  );
};

export default CustomModal;
