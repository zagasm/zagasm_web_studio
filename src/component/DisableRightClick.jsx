// component/DisableRightClick.jsx
import React, { useEffect } from "react";

export default function DisableRightClick() {
  useEffect(() => {
    function handleContextMenu(e) {
      e.preventDefault();
    }

    function handleKeyDown(e) {
      const key = e.key?.toLowerCase?.() || e.key;

      const isF12 = e.key === "F12";
      const isCtrlShiftInspect =
        e.ctrlKey &&
        e.shiftKey &&
        (key === "i" || key === "j" || key === "c"); // Ctrl+Shift+I/J/C

      const isCmdOptInspect =
        e.metaKey &&
        e.altKey &&
        key === "i"; // ⌘+⌥+I on Mac

      if (isF12 || isCtrlShiftInspect || isCmdOptInspect) {
        e.preventDefault();
        e.stopPropagation();
      }
    }

    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return null;
}
