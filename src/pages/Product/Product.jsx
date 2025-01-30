import { useOutletContext, useParams } from "react-router-dom";
import ProductMain from "../../components/Main/ProductMain";

function Product() {
 const {
  products = [],
  setCartItem,
  wishlistItem = [],
  setWishlistItem,
 } = useOutletContext();
 const { id } = useParams();

 const product =
  products.length > 0
   ? products.find((product) => product.id === parseInt(id))
   : null;

 if (products.length === 0) {
  return null;
 }

 return (
  <>
   <ProductMain
    product={product}
    setCartItem={setCartItem}
    wishlistItem={wishlistItem}
    setWishlistItem={setWishlistItem}
   />
  </>
 );
}

export default Product;
