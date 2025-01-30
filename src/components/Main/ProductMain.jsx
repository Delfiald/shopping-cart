import styles from "./main.module.css";

import {
 ChevronLeft,
 ChevronRight,
 Heart,
 Minus,
 Plus,
 Share,
} from "lucide-react";
import PropTypes from "prop-types";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { setItem } from "../../utils/localStorage";
import formatText from "../../utils/formatText";

function Media(props) {
 const trackRef = useRef(null);
 const handleScrollLeft = () => {
  if (trackRef.current) {
   trackRef.current.scrollBy({ left: -300, behavior: "smooth" });
  }
 };

 const handleScrollRight = () => {
  if (trackRef.current) {
   trackRef.current.scrollBy({ left: 300, behavior: "smooth" });
  }
 };

 return (
  <section className={styles.media}>
   <div className={styles["display-image"]}>
    <img
     data-testid="display-image"
     src={props.displayedImage}
     alt={props.title}
    />
   </div>
   <div className={styles["image-carousel"]}>
    <div className={styles["left-arrow"]} onClick={handleScrollLeft}>
     <ChevronLeft size={24} />
    </div>
    {/* Use Map if Image more than one (in an array) */}
    <div className={styles["carousel-track"]} ref={trackRef}>
     <div
      data-testid="image-1"
      className={`${styles.image} ${
       styles[props.image === props.displayedImage ? "displayed" : ""]
      }`}
      onClick={() => props.setDisplayedImage(props.image)}
     >
      <img src={props.image} alt={props.title} />
     </div>
     <div
      data-testid="image-2"
      className={`${styles.image} ${
       styles[props.image === props.displayedImage ? "displayed" : ""]
      }`}
      onClick={() => props.setDisplayedImage(props.image)}
     >
      <img src={props.image} alt={props.title} />
     </div>
     <div
      data-testid="image-3"
      className={`${styles.image} ${
       styles[props.image === props.displayedImage ? "displayed" : ""]
      }`}
      onClick={() => props.setDisplayedImage(props.image)}
     >
      <img src={props.image} alt={props.title} />
     </div>
     <div
      data-testid="image-4"
      className={`${styles.image} ${
       styles[props.image === props.displayedImage ? "displayed" : ""]
      }`}
      onClick={() => props.setDisplayedImage(props.image)}
     >
      <img src={props.image} alt={props.title} />
     </div>
    </div>
    <div className={styles["right-arrow"]} onClick={handleScrollRight}>
     <ChevronRight size={24} />
    </div>
   </div>
  </section>
 );
}

function Detail(props) {
 return (
  <section className={styles.detail}>
   <div className={styles["top-detail"]}>
    <h2 className={styles["product-title"]}>{props.title}</h2>
    <div className={styles["product-price"]}>
     {formatText.priceText(props.price)}
    </div>
   </div>
   <div className={styles["main-detail"]}>
    <div className={styles["detail-option"]}>
     <div
      data-testid="detail-button"
      className={`${styles["detail-button"]} ${
       styles[props.detail === "detail" ? "active" : ""]
      }`}
      onClick={() => props.setDetail("detail")}
     >
      Detail
     </div>
     <div
      data-testid="info-button"
      className={`${styles["info-button"]} ${
       styles[props.detail === "info" ? "active" : ""]
      }`}
      onClick={() => props.setDetail("info")}
     >
      Important Information
     </div>
    </div>
    <div className={styles["detail-content"]}>
     {props.detail === "detail" ? (
      <div className={styles["product-detail"]}>
       <div className={styles["min-order"]}>Min Order: 1 Pcs</div>
       <div
        className={styles["product-category"]}
        onClick={() => props.handleNavigate(`/shop?category=${props.category}`)}
       >
        Category:
        <div>
         {props.category ? formatText.capitalizedWords(props.category) : "-"}
        </div>
       </div>
       <div className={styles["product-description"]}>{props.description}</div>
      </div>
     ) : (
      <div className={styles["important-information"]}>
       <div>
        Lorem ipsum, dolor sit amet consectetur adipisicing elit. Cumque
        mollitia doloribus quo consequatur nostrum quod.
       </div>
      </div>
     )}
    </div>
   </div>
  </section>
 );
}

function Option(props) {
 const handleAmount = (change) => {
  const newAmount = props.amount + change;
  if (newAmount > 0) {
   props.setAmount(newAmount);
  }
 };

 return (
  <aside>
   <div className={styles["option-container"]}>
    <div>Order Option</div>
    <div className={styles["product-image"]}>
     <img src={props.image} alt={props.title} />
    </div>
    <div className={styles["order-amount"]}>
     <button
      data-testid="reduce-amount"
      disabled={props.amount <= 1}
      className={styles["reduce-amount"]}
      onClick={() => handleAmount(-1)}
     >
      <Minus size={16} />
     </button>
     <div data-testid="amount" className={styles.amount}>
      {props.amount}
     </div>
     <button
      data-testid="add-amount"
      className={styles["add-amount"]}
      onClick={() => handleAmount(1)}
     >
      <Plus size={16} />
     </button>
    </div>
    <div className={styles["subtotal"]}>
     <p>Subtotal</p>
     <p data-testid="subtotal">
      {formatText.priceText(props.price * props.amount)}
     </p>
    </div>
    <button
     data-testid="add-to-cart"
     className={styles["add-to-cart"]}
     onClick={props.handleAddToCart}
    >
     <div className={styles.displayed}>
      <Plus size={16} />
      Add to Cart
     </div>
     <div className={styles.hovered}>
      <Plus size={16} />
      Add to Cart
     </div>
    </button>
    <div className={styles.actions}>
     <div
      data-testid="wishlist-button"
      className={`${styles.wishlist} ${
       styles[props.isWishlistItem() ? "active" : "inactive"]
      }`}
      onClick={props.handleWishlistItem}
     >
      <div className={styles["heart-icon"]}>
       <Heart size={16} />
       {props.isWishlistItem() && (
        <Heart className={styles["active-icon"]} size={16} />
       )}
      </div>
      Wishlist
     </div>
     <div className={styles.share}>
      <Share size={16} />
      Share
     </div>
    </div>
   </div>
  </aside>
 );
}

function ProductMain({ product, setCartItem, wishlistItem, setWishlistItem }) {
 const navigate = useNavigate();
 const [detail, setDetail] = useState("detail");
 const [displayedImage, setDisplayedImage] = useState(product.image);
 const [amount, setAmount] = useState(1);

 const handleNavigate = (entries = "/") => {
  navigate(entries);
 };

 const handleAddToCart = () => {
  setCartItem((prevCartItem) => {
   const exists = prevCartItem.find((item) => item.id == product.id);

   let updatedCart;

   if (exists) {
    updatedCart = prevCartItem.map((item) =>
     item.id === product.id ? { ...item, amount: item.amount + amount } : item
    );
   } else {
    updatedCart = [...prevCartItem, { id: product.id, amount: amount }];
   }

   setItem("cart", updatedCart);

   return updatedCart;
  });
 };

 const isWishlist = () =>
  wishlistItem.some((wishlist) => wishlist.id === product.id);

 const handleWishlistItem = () => {
  setWishlistItem((prevWishlistItem) => {
   const exists = prevWishlistItem.find((item) => item.id === product.id);

   const updatedWishlist = exists
    ? prevWishlistItem.filter((item) => item.id !== product.id)
    : [...prevWishlistItem, { id: product.id }];

   setItem("wishlist", updatedWishlist);

   return updatedWishlist;
  });
 };

 return (
  <main className={styles.product}>
   <div data-testid="breadcrumb" className={styles.breadcrumb}>
    <div onClick={handleNavigate}>Home</div>
    <ChevronRight size={16} />
    <div onClick={() => handleNavigate("/shop")}>Shop</div>
    <ChevronRight size={16} />
    <div onClick={() => handleNavigate(`/shop?category=${product.category}`)}>
     {formatText.capitalizedWords(product.category)}
    </div>
    <ChevronRight size={16} />
    {product.title}
   </div>
   <div className={styles["product-overview"]}>
    <Media
     image={product.image}
     title={product.title}
     displayedImage={displayedImage}
     setDisplayedImage={setDisplayedImage}
    />
    <Detail
     title={product.title}
     price={product.price}
     description={product.description}
     category={product.category}
     detail={detail}
     setDetail={setDetail}
     handleNavigate={handleNavigate}
    />
    <Option
     title={product.title}
     price={product.price}
     image={product.image}
     amount={amount}
     setAmount={setAmount}
     handleAddToCart={handleAddToCart}
     handleWishlistItem={handleWishlistItem}
     isWishlistItem={isWishlist}
    />
   </div>
  </main>
 );
}

ProductMain.propTypes = {
 product: PropTypes.object.isRequired,
 setCartItem: PropTypes.func,
 wishlistItem: PropTypes.array.isRequired,
 setWishlistItem: PropTypes.func,
};

Media.propTypes = {
 image: PropTypes.string,
 title: PropTypes.string,
 displayedImage: PropTypes.string,
 setDisplayedImage: PropTypes.func,
};

Detail.propTypes = {
 title: PropTypes.string,
 price: PropTypes.number,
 category: PropTypes.string,
 description: PropTypes.string,
 detail: PropTypes.string,
 setDetail: PropTypes.func,
 handleNavigate: PropTypes.func,
};

Option.propTypes = {
 title: PropTypes.string,
 price: PropTypes.number,
 image: PropTypes.string,
 amount: PropTypes.number,
 setAmount: PropTypes.func,
 handleAddToCart: PropTypes.func,
 handleWishlistItem: PropTypes.func,
 isWishlistItem: PropTypes.func,
};

export default ProductMain;
