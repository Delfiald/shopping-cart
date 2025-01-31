import styles from "./main.module.css";

import { Check, ChevronRight, Trash, X } from "lucide-react";
import PropTypes from "prop-types";
import { useState } from "react";
import { removeItem, setItem } from "../../utils/localStorage";
import { useNavigate } from "react-router-dom";
import formatText from "../../utils/formatText";

function NotificationList({ notificationItem, products, setNotificationItem }) {
 const [detail, setDetail] = useState("");
 const navigate = useNavigate();

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
  return getNotificationItemDetails(products).reduce(
   (total, product) => total + product.amount * product.price,
   0
  );
 };

 return (
  <>
   <section className={styles["notification-list"]}>
    {notificationItem.length > 0 ? (
     notificationItem.map((notification) => (
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
        <p>Details</p>
        <ChevronRight size={18} />
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
            <div className={styles["amount-and-price"]}>
             {item.amount}
             <X size={16} />
             {formatText.priceText(item.price)}
            </div>
            <div className={styles.subtotal}>
             Subtotal: {formatText.priceText(item.amount * item.price)}
            </div>
           </div>
          </div>
         ))}
         <div data-testid={`total-${notification.id}`} className={styles.total}>
          Total:{" "}
          {formatText.priceText(handlePurchaseTotal(notification.products))}
         </div>
        </div>
       )}
      </div>
     ))
    ) : (
     <div className={styles["no-notification"]}>
      <div>No notifications yet. Stay tuned for updates!</div>
      <button className={styles["back-to-home"]} onClick={() => navigate("/")}>
       <div className={styles.displayed}>Back to Home</div>
       <div className={styles.hovered}>Back to Home</div>
      </button>
     </div>
    )}
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
  <main className={styles.notification}>
   <h2>Notifications</h2>
   {notificationItem.length > 0 && (
    <div
     data-testid="marks-all-read"
     className={styles["marks-all-read"]}
     onClick={handleMarksAllRead}
    >
     <div className={styles.displayed}>
      <Check size={16} />
      Marks All Read ({unreadNotificationAmount()})
     </div>
     <div className={styles.hovered}>
      <Check size={16} />
      Marks All Read ({unreadNotificationAmount()})
     </div>
    </div>
   )}
   <NotificationList
    products={products}
    notificationItem={notificationItem}
    setNotificationItem={setNotificationItem}
   />
   {notificationItem.length > 0 && (
    <div
     data-testid="clear-notification-button"
     className={styles["clear-notification-button"]}
     onClick={handleRemoveAllNotification}
    >
     <div className={styles.displayed}>
      <Trash size={16} />
      <p>Clear Notification</p>
     </div>
     <div className={styles.hovered}>
      <Trash size={16} />
      <p>Clear Notification</p>
     </div>
    </div>
   )}
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
