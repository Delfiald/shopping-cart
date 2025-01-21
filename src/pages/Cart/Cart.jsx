import { useOutletContext } from "react-router-dom";
import CartMain from "../../components/Main/CartMain";

function Cart() {
 const {
  products,
  cartItem,
  setCartItem,
  wishlistItem,
  setWishlistItem,
  setNotificationItem,
 } = useOutletContext();
 return (
  <>
   <CartMain
    products={products}
    cartItem={cartItem}
    setCartItem={setCartItem}
    wishlistItem={wishlistItem}
    setWishlistItem={setWishlistItem}
    setNotificationItem={setNotificationItem}
   />
  </>
 );
}

export default Cart;
