import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { showError, showSuccess } from "../../../component/ui/toast";

const NetworkStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOffline = () => {
      setIsOnline(false);
      showError("You lost internet connection!");
    };

    const handleOnline = () => {
      setIsOnline(true);
      showSuccess("You are back online!");
    };

    window.addEventListener("offline", handleOffline);
    window.addEventListener("online", handleOnline);

    return () => {
      
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("online", handleOnline);
    };
  }, []);

  return null;
};

export default NetworkStatus;
