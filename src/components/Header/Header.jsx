import styles from "./header.module.css";

import { Bell, Heart, Search, ShoppingCart, X } from "lucide-react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { removeItem, setItem } from "../../utils/localStorage";
import styled from "styled-components";
import formatText from "../../utils/formatText";

const SearchContainer = styled.div`
 &:has(input:focus) {
  color: #000;
 }

 &:has(input:focus)::before {
  transform: translate(0, -50%) scaleX(1);
 }
`;

const HeaderOverlay = styled.div.withConfig({
 shouldForwardProp: (prop) => prop !== "hoverButton",
})`
 visibility: ${(props) =>
  ["cart", "wishlist", "notification"].includes(props.hoverButton)
   ? "visible"
   : "hidden"};
 opacity: ${(props) =>
  ["cart", "wishlist", "notification"].includes(props.hoverButton) ? 0.5 : 0};
`;

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
   prevNotification.map((item) => {
    const updatedNotification =
     item.id === notificationId ? { ...item, isRead: true } : item;

    setItem("notification", updatedNotification);
    return updatedNotification;
   })
  );
 };

 const handleRemoveAllNotification = () => {
  const removeWithAnimation = () => {
   setTimeout(() => {
    setNotificationItem([]);
    removeItem("notification");
    setHoverButton("");
   }, notificationItem.length * 50 + 300);
  };

  const addExitAnimation = () => {
   notificationItem.forEach((item, index) => {
    setTimeout(() => {
     setNotificationItem((prevItems) =>
      prevItems.map((prevItem) =>
       prevItem.id === item.id ? { ...prevItem, isExiting: true } : prevItem
      )
     );
    }, index * 50);
   });
  };

  addExitAnimation();
  removeWithAnimation();
 };

 const handleSearch = () => {
  if (searchInput.trim() !== "") {
   navigate(`/shop?search=${searchInput}`);
  } else {
   navigate(`/shop`);
  }
 };

 return (
  <header>
   <nav>
    <div className={styles.hero}>
     <h1 onClick={() => navigate("/")}>
      <div className={styles["displayed"]}>Shoppers</div>
      <div className={styles["hovered"]}>Shoppers</div>
     </h1>
    </div>
    <SearchContainer className={styles["search-container"]}>
     <label htmlFor="search">
      <Search size={18} title="Search Icon" />
     </label>
     <input
      onChange={(e) => handleInputChange(e.target.value)}
      type="text"
      id="search"
      placeholder="Search Here..."
      value={searchInput}
      onKeyDown={(e) => {
       if (e.key === "Enter") {
        handleSearch();
       }
      }}
     />
     <button
      data-testid="search-button"
      className={styles["search-button"]}
      onClick={handleSearch}
     >
      <div className={styles["displayed"]}>Search</div>
      <div className={styles["hovered"]}>Search</div>
     </button>
    </SearchContainer>
    <div className={styles["button-wrapper"]}>
     <div
      onMouseEnter={() => handleHoverButton("cart")}
      onMouseLeave={() => handleHoverButton(null)}
      data-testid="cart-button-wrapper"
      className={styles["cart-button-wrapper"]}
     >
      <button
       onClick={handleCartClick}
       data-testid="cart-button"
       className={styles["cart-button"]}
      >
       <div className={styles["displayed"]}>
        <ShoppingCart size={18} title="Cart Button" />
       </div>
       <div className={styles["hovered"]}>
        <ShoppingCart size={18} title="Cart Button Hovered" />
       </div>
      </button>
      {cartItem && orderAmount() > 0 && (
       <div data-testid="item-count" className={styles["item-count"]}>
        {orderAmount()}
       </div>
      )}
      {hoverButton === "cart" && (
       <div>
        <div className={styles["cart-information"]}>
         <div>Cart ({orderAmount()})</div>
         <div
          className={styles["see-all-button"]}
          role="button"
          onClick={handleCartClick}
         >
          See All
         </div>
        </div>
        {getCartDetails().length > 0 ? (
         <div className={styles["cart-items-wrapper"]}>
          {getCartDetails().map((item) => (
           <div
            data-testid={`product-${item.id}`}
            key={item.id}
            onClick={() => navigate(`/product/${item.id}`)}
           >
            <div className={styles.image}>
             <img src={item.image} alt={item.title} />
            </div>
            <div className={styles.title}>{item.title}</div>
            <div className={styles.subtotal}>
             <p className={styles.amount}>{item.amount}</p>
             <X size={16} />
             <p className={styles.price}>{formatText.priceText(item.price)}</p>
            </div>
           </div>
          ))}
         </div>
        ) : (
         <div className={styles["empty-cart"]}>
          <p>Your Cart is Empty</p>
          <button
           className={styles["start-shopping-button"]}
           onClick={() => navigate("/shop")}
          >
           Start Shopping
          </button>
         </div>
        )}
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
       <div className={styles["displayed"]}>
        <Bell size={18} title="Notification Button" />
       </div>
       <div className={styles["hovered"]}>
        <Bell size={18} title="Notification Button Hovered" />
       </div>
      </button>
      {notificationItem && unreadNotificationAmount() > 0 && (
       <div
        data-testid="notification-count"
        className={styles["notification-count"]}
       >
        {unreadNotificationAmount()}
       </div>
      )}
      {hoverButton === "notification" && (
       <div>
        <div className={styles["notification-information"]}>
         <div>Notifications ({notificationItem.length})</div>
         <div
          className={styles["see-all-button"]}
          role="button"
          onClick={handleNotificationClick}
         >
          See All
         </div>
        </div>
        {notificationItem.length > 0 ? (
         <div className={styles["notification-items-wrapper"]}>
          {notificationItem.map((item) => (
           <div
            key={item.id}
            data-testid={`notification-item-${item.id}`}
            className={`${styles["notification-item"]} ${
             styles[item.isRead ? "read" : "unread"]
            } ${item.isExiting ? styles["exiting"] : ""}`}
            onMouseEnter={() => handleReadNotification(item.id)}
           >
            <div
             data-testid={`notification-time-${item.id}`}
             className={styles.time}
            >
             {item.timeStamp}
            </div>
            <div
             data-testid={`notification-message-${item.id}`}
             className={styles.message}
            >
             {item.message}
            </div>
           </div>
          ))}
         </div>
        ) : (
         <div className={styles["empty-notification"]}>
          <p>You have no notifications right now.</p>
          <p>Start Shopping</p>
          <button
           className={styles["start-shopping-button"]}
           onClick={() => navigate("/shop")}
          >
           Start Shopping
          </button>
         </div>
        )}
        {notificationItem.length > 0 && (
         <div className={styles["clear-button-wrapper"]}>
          <div
           data-testid="clear-notification-button"
           className={styles["clear-button"]}
           onClick={handleRemoveAllNotification}
          >
           Clear Notifications
          </div>
         </div>
        )}
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
       <div className={styles["displayed"]}>
        <Heart size={18} title="Wishlist Button" />
       </div>
       <div className={styles["hovered"]}>
        <Heart size={18} title="Wishlist Button Hovered" />
       </div>
      </button>
      {wishlistItem && wishlistItem.length > 0 && (
       <div data-testid="wishlist-count" className={styles["wishlist-count"]}>
        {wishlistItem.length}
       </div>
      )}
      {hoverButton === "wishlist" && (
       <div>
        <div className={styles["wishlist-information"]}>
         <div>Wishlist ({wishlistItem.length})</div>
         <div
          className={styles["see-all-button"]}
          role="button"
          onClick={handleWishlistClick}
         >
          See All
         </div>
        </div>
        {getWishlistDetails().length > 0 ? (
         <div className={styles["wishlist-items-wrapper"]}>
          {getWishlistDetails().map((item) => (
           <div
            data-testid={`product-${item.id}`}
            key={item.id}
            onClick={() => navigate(`/product/${item.id}`)}
           >
            <div className={styles.image}>
             <img src={item.image} alt={item.title} />
            </div>
            <div className={styles.title}>{item.title}</div>
            <div className={styles.price}>
             {formatText.priceText(item.price)}
            </div>
           </div>
          ))}
         </div>
        ) : (
         <div className={styles["empty-wishlist"]}>
          <p>Your wishlist is currently empty.</p>
          <button
           className={styles["start-shopping-button"]}
           onClick={() => navigate("/shop")}
          >
           Start Shopping
          </button>
         </div>
        )}
       </div>
      )}
     </div>
    </div>
   </nav>
   <HeaderOverlay
    className={styles["header-overlay"]}
    hoverButton={hoverButton}
   ></HeaderOverlay>
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
