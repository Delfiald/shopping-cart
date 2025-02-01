import styles from "./main.module.css";

import { Heart, Minus, Plus, Trash } from "lucide-react";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BuyModal } from "../Modal/Modal";
import { format } from "date-fns";
import { removeItem, setItem } from "../../utils/localStorage";
import formatText from "../../utils/formatText";

function CartContents({
 wishlistItem = [],
 setCartItem,
 setWishlistItem,
 getCartDetails,
 handleNavigate,
}) {
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
    {getCartDetails().length > 0 ? (
     getCartDetails().map((cartItemProduct) => {
      const isWishlist = wishlistItem.some(
       (wishlist) => wishlist.id === cartItemProduct.id
      );
      return (
       <div className={styles.item} key={cartItemProduct.id}>
        {/* Product Image */}
        <div
         className={styles["product-image"]}
         onClick={() => handleNavigate(`/product/${cartItemProduct.id}`)}
        >
         <img src={cartItemProduct.image} alt={cartItemProduct.title} />
        </div>

        {/* Product Title */}
        <div
         className={styles["product-title"]}
         onClick={() => handleNavigate(`/product/${cartItemProduct.id}`)}
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
          <div className={styles["heart-icon"]}>
           <Heart size={16} />
           {isWishlist && <Heart className={styles["active-icon"]} size={16} />}
          </div>
         </div>

         {/* Remove Button */}
         <div
          data-testid={`remove-button-${cartItemProduct.id}`}
          className={styles["remove-button"]}
          onClick={() => handleRemoveCart(cartItemProduct.id)}
         >
          <Trash size={18} />
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
     })
    ) : (
     <div className={styles["empty-cart"]}>
      <div>Your cart is empty. Start adding some products!</div>
      <button
       onClick={() => handleNavigate("/shop")}
       className={styles["go-to-shop"]}
      >
       <div className={styles.displayed}>Go to Shop</div>
       <div className={styles.hovered}>Go to Shop</div>
      </button>
     </div>
    )}
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
    <div data-testid="total-price" className={styles["total-price"]}>
     {formatText.priceText(totalPrice())}
    </div>
   </div>
   <button
    data-testid="buy-button"
    className={styles["buy-button"]}
    onClick={handleBuy}
    disabled={orderAmount() === 0}
   >
    <div className={styles.displayed}>Buy ({orderAmount()})</div>
    <div className={styles.hovered}>Buy ({orderAmount()})</div>
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
 isExiting,
 setIsExiting,
}) {
 const navigate = useNavigate();
 const [modal, setModal] = useState("");
 const [isVisible, setIsVisible] = useState(false);

 const handleNavigate = (path) => {
  setIsExiting(true);
  setTimeout(() => {
   navigate(path);
   setIsExiting(false);
  }, 500);
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
     message: `Purchase Complete, total Price: ${formatText.priceText(
      totalPrice()
     )}`,
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

 useEffect(() => {
  setIsVisible(true);
 }, []);

 return (
  <>
   <main
    className={`${styles.cart} ${isVisible ? styles["fade-out"] : ""} ${
     isExiting ? styles["fade-in"] : ""
    }`}
   >
    <h2>Cart</h2>
    <CartContents
     setCartItem={setCartItem}
     wishlistItem={wishlistItem}
     setWishlistItem={setWishlistItem}
     setModal={setModal}
     getCartDetails={getCartDetails}
     handleNavigate={handleNavigate}
    />
    <Summary
     totalPrice={totalPrice}
     orderAmount={orderAmount}
     handleBuy={handleBuy}
    />
   </main>
   {modal === "buy-modal" ? (
    <BuyModal setModal={setModal} setIsExiting={setIsExiting} />
   ) : null}
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
 isExiting: PropTypes.bool,
 setIsExiting: PropTypes.func,
};

CartContents.propTypes = {
 cartItem: PropTypes.array,
 setCartItem: PropTypes.func,
 wishlistItem: PropTypes.array,
 setWishlistItem: PropTypes.func,
 getCartDetails: PropTypes.func,
 handleNavigate: PropTypes.func,
};

Summary.propTypes = {
 totalPrice: PropTypes.func,
 orderAmount: PropTypes.func,
 handleBuy: PropTypes.func,
};

export default CartMain;
