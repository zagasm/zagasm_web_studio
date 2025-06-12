import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

const NetworkStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOffline = () => {
      setIsOnline(false);
      toast.error("You lost internet connection!", { autoClose: false });
    };

    const handleOnline = () => {
      setIsOnline(true);
      toast.success("Internet is back!", { autoClose: 3000 });
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
