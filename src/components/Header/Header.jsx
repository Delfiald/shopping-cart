import styles from "./header.module.css";

import { Bell, Heart, Search, ShoppingCart, Trash, X } from "lucide-react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";

function Header({
 products,
 cartItem,
 notificationItem,
 setNotificationItem,
 wishlistItem,
 hoverButton,
 setHoverButton,
 searchInput,
 setSearchInput,
}) {
 const navigate = useNavigate();

 const handleCartClick = () => {
  navigate("/cart");
 };

 const handleWishlistClick = () => {
  navigate("/wishlist");
 };

 const handleNotificationClick = () => {
  navigate("/notification");
 };

 const handleHoverButton = (isCartOpen) => {
  setHoverButton(isCartOpen);
 };

 const handleInputChange = (value) => {
  setSearchInput(value);
 };

 const orderAmount = () => {
  return cartItem.reduce((prevItem, item) => prevItem + item.amount, 0);
 };

 const unreadNotificationAmount = () => {
  return notificationItem.filter(
   (notification) => notification.isRead === false
  ).length;
 };

 const getCartDetails = () => {
  return cartItem.map((cart) => {
   const product = products.find((p) => p.id === cart.id);
   return {
    ...product,
    amount: cart.amount,
   };
  });
 };

 const getWishlistDetails = () => {
  return wishlistItem.map((wishlist) => {
   const product = products.find((p) => p.id === wishlist.id);
   return {
    ...product,
   };
  });
 };

 const handleReadNotification = (notificationId) => {
  setNotificationItem((prevNotification) =>
   prevNotification.map((item) =>
    item.id === notificationId ? { ...item, isRead: true } : item
   )
  );
 };

 return (
  <header>
   <nav>
    <div className={styles.hero} onClick={() => navigate("/")}>
     <h1>Shoppers</h1>
    </div>
    <div className={styles["search-container"]}>
     <label htmlFor="search">
      <Search size={16} title="Search Icon" />
     </label>
     <input
      onChange={(e) => handleInputChange(e.target.value)}
      type="text"
      id="search"
      placeholder="Search Here..."
      value={searchInput}
     />
    </div>
    <div
     onMouseEnter={() => handleHoverButton("cart")}
     onMouseLeave={() => handleHoverButton(null)}
     data-testid="cart-button-wrapper"
     className={styles["cart-button-wrapper"]}
    >
     <button
      onClick={handleCartClick}
      data-testid="cart-button"
      className={styles["cart-button-wrapper"]}
     >
      <ShoppingCart size={16} title="Cart Button" />
      {cartItem && orderAmount() > 0 && (
       <div data-testid="item-count" className={styles["item-count"]}>
        {orderAmount()}
       </div>
      )}
     </button>
     {hoverButton === "cart" && (
      <div>
       <div className="cart-information">
        <div>Cart ({orderAmount()})</div>
        <div role="button" onClick={handleCartClick}>
         See All
        </div>
       </div>
       {getCartDetails().map((item) => (
        <div
         data-testid={`product-${item.id}`}
         key={item.id}
         onClick={() => navigate(`/product/${item.id}`)}
        >
         <div className="image">
          <img src={item.image} alt={item.title} />
         </div>
         <div className="title">{item.title}</div>
         <div className="subtotal">
          <p className="amount">{item.amount}</p>
          <X size={16} />
          <p className="price">{item.price}</p>
         </div>
        </div>
       ))}
      </div>
     )}
    </div>
    <div
     onMouseEnter={() => handleHoverButton("notification")}
     onMouseLeave={() => handleHoverButton(null)}
     data-testid="notification-button-wrapper"
     className={styles["notification-button-wrapper"]}
    >
     <button
      data-testid="notification-button"
      className={styles["notification-button"]}
      onClick={handleNotificationClick}
     >
      <Bell size={16} />
      {notificationItem && unreadNotificationAmount() > 0 && (
       <div
        data-testid="notification-count"
        className={styles["notification-count"]}
       >
        {unreadNotificationAmount()}
       </div>
      )}
     </button>
     {hoverButton === "notification" && (
      <div>
       <div className="notification-information">
        <div>Notifications ({notificationItem.length})</div>
        <div role="button" onClick={handleNotificationClick}>
         See All
        </div>
       </div>
       {notificationItem.map((item) => (
        <div
         key={item.id}
         data-testid={`notification-item-${item.id}`}
         className={`notification-item ${item.isRead ? "read" : "unread"}`}
         onMouseEnter={() => handleReadNotification(item.id)}
        >
         <div data-testid={`notification-time-${item.id}`} className="time">
          {item.timeStamp}
         </div>
         <div
          data-testid={`notification-message-${item.id}`}
          className="message"
         >
          {item.message}
         </div>
        </div>
       ))}
       <div
        data-testid="clear-notification-button"
        className="clear-button"
        onClick={() => setNotificationItem([])}
       >
        <Trash />
        Clear Notifications
       </div>
      </div>
     )}
    </div>
    <div
     onMouseEnter={() => handleHoverButton("wishlist")}
     onMouseLeave={() => handleHoverButton(null)}
     data-testid="wishlist-button-wrapper"
     className={styles["wishlist-button-wrapper"]}
    >
     <button
      onClick={handleWishlistClick}
      data-testid="wishlist-button"
      className={styles["wishlist-button"]}
     >
      <Heart size={16} />
      {wishlistItem && wishlistItem.length > 0 && (
       <div data-testid="wishlist-count" className={styles["wishlist-count"]}>
        {wishlistItem.length}
       </div>
      )}
     </button>
     {hoverButton === "wishlist" && (
      <div>
       <div className="wishlist-information">
        <div>Wishlist ({wishlistItem.length})</div>
        <div role="button" onClick={handleWishlistClick}>
         See All
        </div>
       </div>
       {getWishlistDetails().map((item) => (
        <div
         data-testid={`product-${item.id}`}
         key={item.id}
         onClick={() => navigate(`/product/${item.id}`)}
        >
         <div className="image">
          <img src={item.image} alt={item.title} />
         </div>
         <div className="title">{item.title}</div>
         <div className="price">{item.price}</div>
        </div>
       ))}
      </div>
     )}
    </div>
   </nav>
  </header>
 );
}

Header.propTypes = {
 products: PropTypes.array.isRequired,
 cartItem: PropTypes.array,
 notificationItem: PropTypes.array,
 setNotificationItem: PropTypes.func,
 wishlistItem: PropTypes.array,
 hoverButton: PropTypes.string,
 setHoverButton: PropTypes.func,
 searchInput: PropTypes.string,
 setSearchInput: PropTypes.func,
};

export default Header;
