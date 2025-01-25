import styles from "./main.module.css";

import { Heart, Minus, Plus, Trash } from "lucide-react";
import PropTypes from "prop-types";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BuyModal } from "../Modal/Modal";
import { format } from "date-fns";
import { removeItem, setItem } from "../../utils/localStorage";

function CartContents({
 wishlistItem = [],
 setCartItem,
 setWishlistItem,
 getCartDetails,
}) {
 const navigate = useNavigate();

 const handleRemoveCart = (productId) => {
  setCartItem((prevItem) => {
   const updatedCart = prevItem.filter((item) => item.id !== productId);

   setItem("cart", updatedCart);

   return updatedCart;
  });
 };

 const handleAmount = (change, productId) => {
  setCartItem((prevItem) =>
   prevItem.map((item) => {
    const updatedCart =
     item.id === productId
      ? { ...item, amount: Math.max(1, item.amount + change) }
      : item;

    setItem("cart", updatedCart);

    return updatedCart;
   })
  );
 };

 const handleWishlistItem = (product) => {
  setWishlistItem((prevWishlistItem) => {
   const exists = prevWishlistItem.find((item) => item.id === product.id);

   let updatedWishlist;

   if (exists) {
    updatedWishlist = prevWishlistItem.filter((item) => item.id !== product.id);
   } else {
    updatedWishlist = [...prevWishlistItem, { id: product.id }];
   }

   setItem("wishlist", updatedWishlist);

   return updatedWishlist;
  });
 };

 return (
  <section className={styles["cart-contents"]}>
   <div data-testid="item-list" className={styles["item-list"]}>
    {getCartDetails().map((cartItemProduct) => {
     const isWishlist = wishlistItem.some(
      (wishlist) => wishlist.id === cartItemProduct.id
     );
     return (
      <div className={styles.item} key={cartItemProduct.id}>
       {/* Product Image */}
       <div
        className={styles["product-image"]}
        onClick={() => navigate(`/product/${cartItemProduct.id}`)}
       >
        <img src={cartItemProduct.image} alt={cartItemProduct.title} />
       </div>

       {/* Product Title */}
       <div
        className={styles["product-title"]}
        onClick={() => navigate(`/product/${cartItemProduct.id}`)}
       >
        {cartItemProduct.title}
       </div>

       {/* Product Price */}
       <div className={styles["product-price"]}>${cartItemProduct.price}</div>

       {/* Product Options */}
       <div className={styles["product-option"]}>
        {/* Wishlist Button */}
        <div
         data-testid={`wishlist-button-${cartItemProduct.id}`}
         className={`${styles["wishlist-button"]} ${
          styles[isWishlist ? "active" : "inactive"]
         }`}
         onClick={() => handleWishlistItem(cartItemProduct)}
        >
         <Heart size={16} />
        </div>

        {/* Remove Button */}
        <div
         data-testid={`remove-button-${cartItemProduct.id}`}
         className={styles["remove-button"]}
         onClick={() => handleRemoveCart(cartItemProduct.id)}
        >
         <Trash size={16} />
        </div>

        {/* Amount Control */}
        <div className={styles["product-amount"]}>
         <button
          data-testid={`reduce-button-${cartItemProduct.id}`}
          className={styles["reduce-button"]}
          disabled={cartItemProduct.amount <= 1}
          onClick={() => handleAmount(-1, cartItemProduct.id)}
         >
          <Minus size={16} />
         </button>
         <div
          data-testid={`amount-${cartItemProduct.id}`}
          className={styles.amount}
         >
          {cartItemProduct.amount}
         </div>
         <button
          data-testid={`add-button-${cartItemProduct.id}`}
          className={styles["add-button"]}
          onClick={() => handleAmount(1, cartItemProduct.id)}
         >
          <Plus size={16} />
         </button>
        </div>
       </div>
      </div>
     );
    })}
   </div>
  </section>
 );
}

function Summary({ totalPrice, orderAmount, handleBuy }) {
 return (
  <section className={styles.summary}>
   <div>Shopping Summary</div>
   <div className={styles.total}>
    <p>Total</p>
    <div data-testid="total-price">{totalPrice()}</div>
   </div>
   <button
    data-testid="buy-button"
    className={styles["buy-button"]}
    onClick={handleBuy}
   >
    Buy ({orderAmount()})
   </button>
  </section>
 );
}

function CartMain({
 products = [],
 cartItem = [],
 setCartItem,
 wishlistItem = [],
 setWishlistItem,
 setNotificationItem,
}) {
 const [modal, setModal] = useState("");

 const getCartDetails = () => {
  return cartItem.map((cart) => {
   const product = products.find((p) => p.id === cart.id);
   return {
    ...product,
    amount: cart.amount,
   };
  });
 };

 const totalPrice = () => {
  const cartDetails = getCartDetails();
  return cartDetails.reduce((total, item) => {
   return total + item.price * item.amount;
  }, 0);
 };

 const orderAmount = () => {
  return cartItem.reduce((prevItem, item) => prevItem + item.amount, 0);
 };

 const handleBuy = () => {
  if (!cartItem.length || cartItem.length < 1) {
   return;
  }
  const timeStamp = Date.now();
  const formattedDate = format(timeStamp, "dd/MM/yyyy HH:mm");
  setModal("buy-modal");
  setNotificationItem((prevNotification) => {
   const updatedNotification = [
    ...prevNotification,
    {
     id: prevNotification.length + 1,
     message: `Purchase Complete, total Price: ${totalPrice()}`,
     products: [...cartItem],
     timeStamp: formattedDate,
     isRead: false,
    },
   ];

   setItem("notification", updatedNotification);

   return updatedNotification;
  });

  setCartItem([]);
  removeItem("cart");
 };

 return (
  <>
   <main>
    <h2>Cart</h2>
    <CartContents
     setCartItem={setCartItem}
     wishlistItem={wishlistItem}
     setWishlistItem={setWishlistItem}
     setModal={setModal}
     getCartDetails={getCartDetails}
    />
    <Summary
     totalPrice={totalPrice}
     orderAmount={orderAmount}
     handleBuy={handleBuy}
    />
   </main>
   {modal === "buy-modal" ? <BuyModal setModal={setModal} /> : null}
  </>
 );
}

CartMain.propTypes = {
 products: PropTypes.array,
 cartItem: PropTypes.array,
 setCartItem: PropTypes.func,
 wishlistItem: PropTypes.array,
 setWishlistItem: PropTypes.func,
 setNotificationItem: PropTypes.func,
};

CartContents.propTypes = {
 cartItem: PropTypes.array,
 setCartItem: PropTypes.func,
 wishlistItem: PropTypes.array,
 setWishlistItem: PropTypes.func,
 getCartDetails: PropTypes.func,
};

Summary.propTypes = {
 totalPrice: PropTypes.func,
 orderAmount: PropTypes.func,
 handleBuy: PropTypes.func,
};

export default CartMain;
