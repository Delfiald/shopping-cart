import styles from "./main.module.css";

import { Check, ChevronRight, Trash, X } from "lucide-react";
import PropTypes from "prop-types";
import { useState } from "react";
import { removeItem, setItem } from "../../utils/localStorage";

function NotificationList({ notificationItem, products, setNotificationItem }) {
 const [detail, setDetail] = useState("");

 const handleReadNotification = (notificationId) => {
  setNotificationItem((prevNotification) =>
   prevNotification.map((item) => {
    const updatedNotification =
     item.id === notificationId ? { ...item, isRead: true } : item;

    setItem("notification", updatedNotification);

    return updatedNotification;
   })
  );
 };

 const handleNotificationRemove = (notificationId) => {
  setNotificationItem((prevNotification) => {
   const updatedNotification = prevNotification.filter(
    (notification) => notification.id !== notificationId
   );
   setItem("notification", updatedNotification);
   return updatedNotification;
  });
 };

 const handleDetails = (notificationId) => {
  setDetail((prevDetail) =>
   prevDetail === notificationId ? "" : notificationId
  );
 };

 const getNotificationItemDetails = (notificationProducts) => {
  return notificationProducts.map((item) => {
   const product = products.find((p) => p.id === item.id);
   return {
    ...product,
    amount: item.amount,
   };
  });
 };

 const handlePurchaseTotal = (products) => {
  return products.reduce(
   (total, product) => total + product.amount * product.price,
   0
  );
 };

 return (
  <>
   <section className={styles["notification-list"]}>
    {notificationItem.map((notification) => (
     <div
      key={notification.id}
      data-testid={`notification-item-${notification.id}`}
      className={`${styles["notification-item"]} ${
       styles[notification.isRead ? "read" : "unread"]
      }`}
      onMouseEnter={() => handleReadNotification(notification.id)}
     >
      <p className={styles.time}>{notification.timeStamp}</p>
      <div
       data-testid={`remove-button-${notification.id}`}
       className={styles["remove-button"]}
       onClick={() => handleNotificationRemove(notification.id)}
      >
       <Trash size={16} />
      </div>
      <div className={styles.message}>{notification.message}</div>
      <div
       data-testid={`detail-button-${notification.id}`}
       className={`${styles["detail-button"]} ${
        styles[detail === notification.id ? "open" : "closed"]
       }`}
       onClick={() => handleDetails(notification.id)}
      >
       <ChevronRight size={16} />
       <p>Details</p>
      </div>
      {detail === notification.id && (
       <div
        data-testid={`notification-${notification.id}`}
        className={styles.detail}
       >
        {getNotificationItemDetails(notification.products).map((item) => (
         <div key={item.id} className={styles.item}>
          <div className={styles["product-title"]}>{item.title}</div>
          <div className={styles["product-subtotal"]}>
           {item.amount}
           <X size={16} />
           {item.price}
           <div className={styles.subtotal}>
            Subtotal: {item.amount * item.price}
           </div>
          </div>
         </div>
        ))}
        <div data-testid={`total-${notification.id}`} className={styles.total}>
         Total: {handlePurchaseTotal(notification.products)}
        </div>
       </div>
      )}
     </div>
    ))}
   </section>
  </>
 );
}

function NotificationMain({
 products = [],
 notificationItem = [],
 setNotificationItem,
}) {
 const unreadNotificationAmount = () => {
  return notificationItem.filter(
   (notification) => notification.isRead === false
  ).length;
 };

 const handleMarksAllRead = () => {
  setNotificationItem((prevNotification) => {
   const updatedNotification = prevNotification.map((item) => ({
    ...item,
    isRead: true,
   }));

   setItem("notification", updatedNotification);
   return updatedNotification;
  });
 };

 const handleRemoveAllNotification = () => {
  setNotificationItem([]);
  removeItem("notification");
 };

 return (
  <main>
   <h2>Notifications</h2>
   <div
    data-testid="marks-all-read"
    className={styles["marks-all-read"]}
    onClick={handleMarksAllRead}
   >
    <Check size={16} />
    <div>Marks All Read ({unreadNotificationAmount()})</div>
   </div>
   <NotificationList
    products={products}
    notificationItem={notificationItem}
    setNotificationItem={setNotificationItem}
   />
   <div
    data-testid="clear-notification-button"
    className={styles["clear-notification-button"]}
    onClick={handleRemoveAllNotification}
   >
    <Trash size={16} />
    <p>Clear Notification</p>
   </div>
  </main>
 );
}

NotificationMain.propTypes = {
 products: PropTypes.array,
 notificationItem: PropTypes.array,
 setNotificationItem: PropTypes.func,
};

NotificationList.propTypes = {
 products: PropTypes.array,
 notificationItem: PropTypes.array,
 setNotificationItem: PropTypes.func,
};

export default NotificationMain;
