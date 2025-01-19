import { useOutletContext } from "react-router-dom";
import WishlistMain from "../../components/Main/WishlistMain";

function Wishlist() {
 const { products, wishlistItem, setWishlistItem } = useOutletContext();
 return (
  <>
   <WishlistMain
    products={products}
    wishlistItem={wishlistItem}
    setWishlistItem={setWishlistItem}
   />
  </>
 );
}

export default Wishlist;
