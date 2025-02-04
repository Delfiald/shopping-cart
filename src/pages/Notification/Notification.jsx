import { useOutletContext } from "react-router-dom";
import NotificationMain from "../../components/Main/NotificationMain";

function Notification() {
 const {
  products,
  notificationItem,
  setNotificationItem,
  isExiting,
  setIsExiting,
 } = useOutletContext();

 if (products.length === 0) {
  return null;
 }
 return (
  <NotificationMain
   products={products}
   notificationItem={notificationItem}
   setNotificationItem={setNotificationItem}
   isExiting={isExiting}
   setIsExiting={setIsExiting}
  />
 );
}

export default Notification;
