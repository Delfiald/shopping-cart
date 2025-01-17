import { useOutletContext, useParams } from "react-router-dom";
import ProductMain from "../../components/Main/ProductMain";

function Product() {
 const { products, setCartItem, wishlistItem, setWishlistItem } =
  useOutletContext();
 const { id } = useParams();

 const product = products.find((product) => product.id === parseInt(id));

 const isWishlistItem =
  wishlistItem && wishlistItem.some((item) => item.id === product.id);

 return (
  <>
   <ProductMain
    product={product}
    setCartItem={setCartItem}
    isWishlistItem={isWishlistItem}
    setWishlistItem={setWishlistItem}
   />
  </>
 );
}

export default Product;
