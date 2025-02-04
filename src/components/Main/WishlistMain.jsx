import styles from "./main.module.css";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { Heart, Plus } from "lucide-react";

import { setItem } from "../../utils/localStorage/localStorage";
import formatText from "../../utils/formatText";
import createHandleNavigate from "../../utils/handleNavigate";
import displayedProducts from "../../utils/sortProductsHandler";
import Toolbar from "../Toolbar/Toolbar";
import Pagination from "../Pagination/Pagination";
import { handleAddToCart } from "../../utils/cartUtils";
import handleWishlistItem, { isWishlist } from "../../utils/handleWishlistItem";

function Card({
 product,
 setCartItem,
 wishlistItem,
 setWishlistItem,
 handleNavigate,
}) {
 return (
  <div className={styles.card}>
   <div
    data-testid={`product-card-${product.id}`}
    onClick={() => handleNavigate(`/product/${product.id}`)}
   >
    <div className={styles["image-wrapper"]}>
     <img src={product.image} alt={product.title} />
    </div>
    <div className={styles["product-name"]}>{product.title}</div>
    <div className={styles["product-price"]}>
     {formatText.priceText(product.price)}
    </div>
   </div>
   <div className={styles["card-action"]}>
    <button
     data-testid={`wishlist-button-${product.id}`}
     className={`${styles["wishlist-button"]} ${
      styles[isWishlist(wishlistItem, product) ? "active" : "inactive"]
     }`}
     onClick={() => handleWishlistItem(setWishlistItem, product, setItem)}
    >
     <Heart size={20} />
    </button>
    <button
     data-testid={`add-to-cart-button-${product.id}`}
     className={styles["add-to-cart"]}
     onClick={() => handleAddToCart(setCartItem, product, 1)}
    >
     <div className={styles.displayed}>
      <Plus size={16} />
      <p>Cart</p>
     </div>
     <div className={styles.hovered}>
      <Plus size={16} />
      <p>Cart</p>
     </div>
    </button>
   </div>
  </div>
 );
}

function WishlistListWrapper(props) {
 if (!props.products || props.products.length === 0) {
  return (
   <div data-testid="no-wishlist" className={styles["no-wishlist"]}>
    <div>
     You have no items in your wishlist. Browse products and add them to your
     favorites!
    </div>
    <button
     data-testid="shop-button"
     className={styles["shop-button"]}
     onClick={() => props.handleNavigate("/shop")}
    >
     <div className={styles.displayed}>Explore Products</div>
     <div className={styles.hovered}>Explore Products</div>
    </button>
   </div>
  );
 }

 const currentProducts = Number.isNaN(props.itemPerPage)
  ? props.products
  : props.products.slice(
     (props.page - 1) * props.itemPerPage,
     props.page * props.itemPerPage
    );

 return (
  <section
   data-testid="product-card"
   className={styles["product-list-wrapper"]}
  >
   {props.products &&
    currentProducts.map((product) => (
     <Card
      key={product.id}
      product={product}
      setCartItem={props.setCartItem}
      wishlistItem={props.wishlistItem}
      setWishlistItem={props.setWishlistItem}
      handleNavigate={props.handleNavigate}
     />
    ))}
  </section>
 );
}

function WishlistMain(props) {
 const navigate = useNavigate();
 const handleNavigate = createHandleNavigate(props.setIsExiting, navigate);

 const [isVisible, setIsVisible] = useState(false);

 useEffect(() => {
  setIsVisible(true);
 }, []);

 return (
  <main
   className={`${styles.wishlist} ${isVisible ? styles["fade-out"] : ""} ${
    props.isExiting ? styles["fade-in"] : ""
   }`}
  >
   <h2>Wishlist</h2>
   {props.products && (
    <Toolbar
     totalProducts={props.products.length}
     page={props.page}
     itemPerPage={props.itemPerPage}
     setItemPerPage={props.setItemPerPage}
     sort={props.sort}
     setSort={props.setSort}
     hoverButton={props.hoverButton}
     setHoverButton={props.setHoverButton}
    />
   )}
   <WishlistListWrapper
    products={displayedProducts(props.products, props.sort)}
    page={props.page}
    itemPerPage={props.itemPerPage}
    setCartItem={props.setCartItem}
    wishlistItem={props.wishlistItem}
    setWishlistItem={props.setWishlistItem}
    handleNavigate={handleNavigate}
   />
   {props.products && (
    <Pagination
     totalProducts={props.products.length}
     page={props.page}
     setPage={props.setPage}
     itemPerPage={props.itemPerPage}
    />
   )}
  </main>
 );
}

WishlistMain.propTypes = {
 products: PropTypes.array,
 setCartItem: PropTypes.func,
 wishlistItem: PropTypes.array,
 setWishlistItem: PropTypes.func,
 page: PropTypes.number,
 setPage: PropTypes.func,
 itemPerPage: PropTypes.number,
 setItemPerPage: PropTypes.func,
 sort: PropTypes.string,
 setSort: PropTypes.func,
 hoverButton: PropTypes.string,
 setHoverButton: PropTypes.func,
 isExiting: PropTypes.bool,
 setIsExiting: PropTypes.func,
};

Card.propTypes = {
 product: PropTypes.object,
 setCartItem: PropTypes.func,
 wishlistItem: PropTypes.array,
 setWishlistItem: PropTypes.func,
 handleNavigate: PropTypes.func,
};

WishlistListWrapper.propTypes = {
 products: PropTypes.array,
 page: PropTypes.number,
 itemPerPage: PropTypes.number,
 setCartItem: PropTypes.func,
 wishlistItem: PropTypes.array,
 setWishlistItem: PropTypes.func,
 handleNavigate: PropTypes.func,
};

export default WishlistMain;
