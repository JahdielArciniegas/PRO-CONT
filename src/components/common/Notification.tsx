import React from "react";
import { useNotificationStore } from "@src/lib/store";

const Notification = () => {
  const { notifications } = useNotificationStore();
  return (
    <div className="absolute top-4 right-4 z-50 flex flex-col gap-2">
      {notifications.map((notification, index) => (
        <div
          key={index}
          className={`bg-secondary p-2 rounded-lg text-xl ${
            notification.type === "success"
              ? "text-green-500"
              : notification.type === "error"
              ? "text-red-500"
              : "text-primary"
          }`}
        >
          <p>{notification.message}</p>
        </div>
      ))}
    </div>
  );
};

export default Notification;
