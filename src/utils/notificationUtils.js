import { setItem } from "./localStorage/localStorage";

export const handleReadNotification = (notificationId, setNotificationItem) => {
 setNotificationItem((prevNotification) => {
  const updatedNotification = prevNotification.map((item) =>
   item.id === notificationId ? { ...item, isRead: true } : item
  );

  setItem("notification", updatedNotification);

  return updatedNotification;
 });
};

export const unreadNotificationAmount = (notificationItem) => {
 return notificationItem.filter((notification) => notification.isRead === false)
  .length;
};
