import styles from "./header.module.css";

import { Bell, Search, ShoppingCart } from "lucide-react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";

function Header({
 cartItem,
 notificationItem,
 hoverButton,
 setHoverButton,
 searchInput,
 setSearchInput,
}) {
 const navigate = useNavigate();

 const handleCartClick = () => {
  console.log("Navigate to Cart");
  navigate("/cart");
 };

 const handleHoverButton = (isCartOpen) => {
  setHoverButton(isCartOpen);
 };

 const handleInputChange = (value) => {
  setSearchInput(value);
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
    <button
     onClick={handleCartClick}
     onMouseEnter={() => handleHoverButton("cart")}
     onMouseLeave={() => handleHoverButton(null)}
     data-testid="cart-button"
     className={styles["cart-button"]}
    >
     <ShoppingCart size={16} title="Cart Button" />
     {cartItem && cartItem.length > 0 && (
      <div data-testid="item-count" className={styles["item-count"]}>
       {cartItem.length}
      </div>
     )}
     {hoverButton === "cart" && (
      <div>
       <ul>
        {cartItem.map((item) => (
         <li key={item.id}>{item.description}</li>
        ))}
       </ul>
      </div>
     )}
    </button>
    <button
     onMouseEnter={() => handleHoverButton("notification")}
     onMouseLeave={() => handleHoverButton(null)}
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
     {hoverButton === "notification" && (
      <div>
       <ul>
        {notificationItem.map((item) => (
         <li key={item.id}>{item.description}</li>
        ))}
       </ul>
      </div>
     )}
    </button>
   </nav>
  </header>
 );
}

Header.propTypes = {
 cartItem: PropTypes.array.isRequired,
 notificationItem: PropTypes.array.isRequired,
 hoverButton: PropTypes.string.isRequired,
 setHoverButton: PropTypes.func.isRequired,
 searchInput: PropTypes.string.isRequired,
 setSearchInput: PropTypes.func.isRequired,
};

export default Header;
