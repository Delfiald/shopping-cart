import { Heart, Minus, Plus, Trash } from "lucide-react";
import PropTypes from "prop-types";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BuyModal } from "../Modal/Modal";

function CartContents({
 cartItem = [],
 wishlistItem = [],
 setCartItem,
 setWishlistItem,
}) {
 const navigate = useNavigate();

 const handleRemoveCart = (productId) => {
  setCartItem((prevItem) => prevItem.filter((item) => item.id !== productId));
 };

 const handleAmount = (change, productId) => {
  setCartItem((prevItem) =>
   prevItem.map((item) =>
    item.id === productId
     ? { ...item, amount: Math.max(1, item.amount + change) }
     : item
   )
  );
 };

 const handleWishlistItem = (product) => {
  setWishlistItem((prevWishlistItem) => {
   const exists = prevWishlistItem.find((item) => item.id === product.id);

   if (exists) {
    return prevWishlistItem.filter((item) => item.id !== product.id);
   } else {
    const productWithoutAmount = { ...product };
    delete productWithoutAmount.amount;
    return [...prevWishlistItem, productWithoutAmount];
   }
  });
 };

 return (
  <section className="cart-contents">
   <div data-testid="item-list" className="item-list">
    {cartItem.map((item) => {
     const isWishlist = wishlistItem.some(
      (wishlist) => wishlist.id === item.id
     );
     return (
      <div className="item" key={item.id}>
       {/* Product Image */}
       <div
        className="product-image"
        onClick={() => navigate(`/product/${item.id}`)}
       >
        <img src={item.image} alt={item.title} />
       </div>

       {/* Product Title */}
       <div
        className="product-title"
        onClick={() => navigate(`/product/${item.id}`)}
       >
        {item.title}
       </div>

       {/* Product Price */}
       <div className="product-price">${item.price}</div>

       {/* Product Options */}
       <div className="product-option">
        {/* Wishlist Button */}
        <div
         data-testid={`wishlist-button-${item.id}`}
         className={`wishlist-button ${isWishlist ? "active" : "inactive"}`}
         onClick={() => handleWishlistItem(item)}
        >
         <Heart size={16} />
        </div>

        {/* Remove Button */}
        <div
         data-testid={`remove-button-${item.id}`}
         className="remove-button"
         onClick={() => handleRemoveCart(item.id)}
        >
         <Trash size={16} />
        </div>

        {/* Amount Control */}
        <div className="product-amount">
         <button
          data-testid={`reduce-button-${item.id}`}
          className="reduce-button"
          disabled={item.amount <= 1}
          onClick={() => handleAmount(-1, item.id)}
         >
          <Minus size={16} />
         </button>
         <div data-testid={`amount-${item.id}`} className="amount">
          {item.amount}
         </div>
         <button
          data-testid={`add-button-${item.id}`}
          className="add-button"
          onClick={() => handleAmount(1, item.id)}
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

function Summary({ totalPrice, orderAmount, setModal }) {
 return (
  <section className="summary">
   <div>Shopping Summary</div>
   <div className="total">
    <p>Total</p>
    <div data-testid="total-price">{totalPrice()}</div>
   </div>
   <button
    data-testid="buy-button"
    className="buy-button"
    onClick={() => setModal("buy-modal")}
   >
    Buy ({orderAmount()})
   </button>
  </section>
 );
}

function CartMain(props) {
 const [modal, setModal] = useState("");

 const totalPrice = () => {
  return props.cartItem.reduce(
   (prevItem, item) => prevItem + item.price * item.amount,
   0
  );
 };

 const orderAmount = () => {
  return props.cartItem.reduce((prevItem, item) => prevItem + item.amount, 0);
 };

 return (
  <>
   <main>
    <h2>Cart</h2>
    <CartContents
     cartItem={props.cartItem}
     setCartItem={props.setCartItem}
     wishlistItem={props.wishlistItem}
     setWishlistItem={props.setWishlistItem}
     setModal={setModal}
    />
    <Summary
     totalPrice={totalPrice}
     orderAmount={orderAmount}
     setModal={setModal}
    />
   </main>
   {modal === "buy-modal" ? <BuyModal setModal={setModal} /> : null}
  </>
 );
}

CartMain.propTypes = {
 cartItem: PropTypes.array,
 setCartItem: PropTypes.func,
 wishlistItem: PropTypes.array,
 setWishlistItem: PropTypes.func,
};

CartContents.propTypes = {
 cartItem: PropTypes.array,
 setCartItem: PropTypes.func,
 wishlistItem: PropTypes.array,
 setWishlistItem: PropTypes.func,
};

Summary.propTypes = {
 totalPrice: PropTypes.func,
 orderAmount: PropTypes.func,
 setModal: PropTypes.func,
};

export default CartMain;
