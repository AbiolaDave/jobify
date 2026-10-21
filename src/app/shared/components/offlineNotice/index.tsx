"use client";

import { useEffect, useState } from "react";

export default function OfflineNotice() {
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    function updateStatus() {
      setIsOffline(!navigator.onLine);
    }
    updateStatus();
    window.addEventListener("online", updateStatus);
    window.addEventListener("offline", updateStatus);
    return () => {
      window.removeEventListener("online", updateStatus);
      window.removeEventListener("offline", updateStatus);
    };
  }, []);

  if (!isOffline) return null;

  return (
    <p aria-live="polite" className="offline-notice" role="status">
      You’re offline. Some actions may not be available until you reconnect.
    </p>
  );
}
