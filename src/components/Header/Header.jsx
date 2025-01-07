import styles from "./header.module.css";

import { Search, ShoppingCart } from "lucide-react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";

function Header({ cartItem = 0, cartOpen, setCartOpen }) {
 const navigate = useNavigate();

 const handleCartClick = () => {
  console.log("Navigate to Cart");
  navigate("/cart");
 };

 const handleCartHover = (isCartOpen) => {
  setCartOpen(isCartOpen);
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
     <input type="text" id="search" placeholder="Search Here..." />
    </div>
    <button
     onClick={handleCartClick}
     onMouseEnter={() => handleCartHover(true)}
     onMouseLeave={() => handleCartHover(false)}
     data-testid="cart-button"
     className={styles["cart-button"]}
    >
     <ShoppingCart size={16} title="Cart Button" />
     {cartItem.length > 0 && (
      <div data-testid="item-count" className={styles["item-count"]}>
       {cartItem.length}
      </div>
     )}
     {cartOpen && (
      <div>
       <ul>
        <li>item 1</li>
        <li>item 2</li>
        <li>item 3</li>
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
 cartOpen: PropTypes.bool.isRequired,
 setCartOpen: PropTypes.func.isRequired,
};

export default Header;
