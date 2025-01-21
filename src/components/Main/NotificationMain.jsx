import { Check, ChevronRight, Trash, X } from "lucide-react";
import PropTypes from "prop-types";
import { useState } from "react";

function NotificationList({ notificationItem, products, setNotificationItem }) {
 const [detail, setDetail] = useState("");

 const handleReadNotification = (notificationId) => {
  setNotificationItem((prevNotification) =>
   prevNotification.map((item) =>
    item.id === notificationId ? { ...item, isRead: true } : item
   )
  );
 };

 const handleNotificationRemove = (notificationId) => {
  setNotificationItem((prevNotification) =>
   prevNotification.filter((notification) => notification.id !== notificationId)
  );
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
   <section className="notification-list">
    {notificationItem.map((notification) => (
     <div
      key={notification.id}
      data-testid={`notification-item-${notification.id}`}
      className={`notification-item ${notification.isRead ? "read" : "unread"}`}
      onMouseEnter={() => handleReadNotification(notification.id)}
     >
      <p className="time">{notification.timeStamp}</p>
      <div
       data-testid={`remove-button-${notification.id}`}
       className="remove-button"
       onClick={() => handleNotificationRemove(notification.id)}
      >
       <Trash size={16} />
      </div>
      <div className="message">{notification.message}</div>
      <div
       data-testid={`detail-button-${notification.id}`}
       className={`detail-button ${
        detail === notification.id ? "open" : "closed"
       }`}
       onClick={() => handleDetails(notification.id)}
      >
       <ChevronRight size={16} />
       <p>Details</p>
      </div>
      {detail === notification.id && (
       <div data-testid={`notification-${notification.id}`} className="detail">
        {getNotificationItemDetails(notification.products).map((item) => (
         <div key={item.id} className="item">
          <div className="product-title">{item.title}</div>
          <div className="product-subtotal">
           {item.amount}
           <X size={16} />
           {item.price}
           <div className="subtotal">Subtotal: {item.amount * item.price}</div>
          </div>
         </div>
        ))}
        <div data-testid={`total-${notification.id}`} className="total">
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
  setNotificationItem((prevNotification) =>
   prevNotification.map((item) => ({ ...item, isRead: true }))
  );
 };

 return (
  <main>
   <h2>Notifications</h2>
   <div
    data-testid="marks-all-read"
    className="marks-all-read"
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
    className="clear-notification-button"
    onClick={() => setNotificationItem([])}
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
