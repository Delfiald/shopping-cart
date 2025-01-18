import styles from "./header.module.css";

import { Bell, Search, ShoppingCart, X } from "lucide-react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";

function Header({
 products,
 cartItem,
 notificationItem,
 hoverButton,
 setHoverButton,
 searchInput,
 setSearchInput,
}) {
 const navigate = useNavigate();

 const handleCartClick = () => {
  navigate("/cart");
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

 const getCartDetails = () => {
  return cartItem.map((cart) => {
   const product = products.find((p) => p.id === cart.id);
   return {
    ...product,
    amount: cart.amount,
   };
  });
 };

 return (
  <header>
   <nav>
    <div className={styles.hero}>
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
     >
      <Bell size={16} />
      {notificationItem && notificationItem.length > 0 && (
       <div
        data-testid="notification-count"
        className={styles["notification-count"]}
       >
        {notificationItem.length}
       </div>
      )}
     </button>
     {hoverButton === "notification" && (
      <div>
       <ul>
        {notificationItem.map((item) => (
         <li key={item.id}>{item.description}</li>
        ))}
       </ul>
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
 hoverButton: PropTypes.string,
 setHoverButton: PropTypes.func,
 searchInput: PropTypes.string,
 setSearchInput: PropTypes.func,
};

export default Header;
