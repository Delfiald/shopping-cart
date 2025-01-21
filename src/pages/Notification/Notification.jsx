import { useOutletContext } from "react-router-dom";
import NotificationMain from "../../components/Main/NotificationMain";

function Notification() {
 const { products, notificationItem, setNotificationItem } = useOutletContext();
 return (
  <NotificationMain
   products={products}
   notificationItem={notificationItem}
   setNotificationItem={setNotificationItem}
  />
 );
}

export default Notification;
