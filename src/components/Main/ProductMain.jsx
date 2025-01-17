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
  <section className="media">
   <div className="display-image">
    <img
     data-testid="display-image"
     src={props.displayedImage}
     alt={props.title}
    />
   </div>
   <div className="image-carousel">
    <div className="left-arrow" onClick={handleScrollLeft}>
     <ChevronLeft size={16} />
    </div>
    {/* Use Map if Image more than one (in an array) */}
    <div className="carousel-track" ref={trackRef}>
     <div
      data-testid="image-1"
      className={`image ${
       props.image === props.displayedImage ? "displayed" : ""
      }`}
      onClick={() => props.setDisplayedImage(props.image)}
     >
      <img src={props.image} alt={props.title} />
     </div>
     <div
      data-testid="image-2"
      className={`image ${
       props.image === props.displayedImage ? "displayed" : ""
      }`}
      onClick={() => props.setDisplayedImage(props.image)}
     >
      <img src={props.image} alt={props.title} />
     </div>
     <div
      data-testid="image-3"
      className={`image ${
       props.image === props.displayedImage ? "displayed" : ""
      }`}
      onClick={() => props.setDisplayedImage(props.image)}
     >
      <img src={props.image} alt={props.title} />
     </div>
     <div
      data-testid="image-4"
      className={`image ${
       props.image === props.displayedImage ? "displayed" : ""
      }`}
      onClick={() => props.setDisplayedImage(props.image)}
     >
      <img src={props.image} alt={props.title} />
     </div>
    </div>
    <div className="right-arrow" onClick={handleScrollRight}>
     <ChevronRight size={16} />
    </div>
   </div>
  </section>
 );
}

function Detail(props) {
 return (
  <section className="detail">
   <div className="top-detail">
    <h2 className="product-title">{props.title}</h2>
    <div className="product-price">{props.price}</div>
   </div>
   <div className="main-detail">
    <div className="detail-option">
     <div
      data-testid="detail-button"
      className="detail-button"
      onClick={() => props.setDetail("detail")}
     >
      Detail
     </div>
     <div
      data-testid="info-button"
      className="info-button"
      onClick={() => props.setDetail("info")}
     >
      Important Information
     </div>
    </div>
    <div className="detail-content">
     {props.detail === "detail" ? (
      <div className="product-detail">
       <div className="min-order">Min Order: 1 Pcs</div>
       <div
        className="product-category"
        onClick={() => props.handleNavigate(`/shop?category=${props.category}`)}
       >
        Category: {props.category ? props.category : "-"}
       </div>
       <div className="product-description">{props.description}</div>
      </div>
     ) : (
      <div className="important-information">
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
   <div className="option-container">
    <div>Order Option</div>
    <div className="product-image">
     <img src={props.image} alt={props.title} />
    </div>
    <div className="order-amount">
     <button
      data-testid="reduce-amount"
      disabled={props.amount <= 1}
      className="reduce-amount"
      onClick={() => handleAmount(-1)}
     >
      <Minus size={16} />
     </button>
     <div data-testid="amount" className="amount">
      {props.amount}
     </div>
     <button
      data-testid="add-amount"
      className="add-amount"
      onClick={() => handleAmount(1)}
     >
      <Plus size={16} />
     </button>
    </div>
    <div className="sub-total">
     <p>Subtotal</p>
     <p data-testid="subtotal">{`$ ${props.price * props.amount}`}</p>
    </div>
    <button
     data-testid="add-to-cart"
     className="add-to-cart"
     onClick={props.handleAddToCart}
    >
     <Plus size={16} />
     Add to Cart
    </button>
    <div className="actions">
     <div
      data-testid="wishlist-button"
      className={`wishlist ${props.isWishlistItem ? "active" : "inactive"}`}
      onClick={props.handleWishListItem}
     >
      <Heart size={16} />
      Wishlist
     </div>
     <div className="share">
      <Share size={16} />
      Share
     </div>
    </div>
   </div>
  </aside>
 );
}

function ProductMain({
 product,
 setCartItem,
 isWishlistItem,
 setWishlistItem,
}) {
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

   if (exists) {
    return prevCartItem.map((item) =>
     item.id === product.id ? { ...item, amount: item.amount + amount } : item
    );
   }

   return [...prevCartItem, { ...product, amount: amount }];
  });
 };

 const handleWishListItem = () => {
  setWishlistItem((prevWishlistItem) => {
   const exists = prevWishlistItem.find((item) => item.id === product.id);

   if (exists) {
    return prevWishlistItem.filter((item) => item.id !== product.id);
   }

   return [...prevWishlistItem, product];
  });
 };

 return (
  <>
   <div data-testid="breadcrumb" className="breadcrumb">
    <div onClick={handleNavigate}>Home</div>
    <ChevronRight size={16} />
    <div onClick={() => handleNavigate("/shop")}>Shop</div>
    <ChevronRight size={16} />
    <div onClick={() => handleNavigate(`/shop?category=${product.category}`)}>
     {product.category}
    </div>
    <ChevronRight size={16} />
    {product.title}
   </div>
   <main>
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
     handleWishListItem={handleWishListItem}
     isWishlistItem={isWishlistItem}
    />
   </main>
  </>
 );
}

ProductMain.propTypes = {
 product: PropTypes.object,
 setCartItem: PropTypes.func,
 isWishlistItem: PropTypes.bool,
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
 handleWishListItem: PropTypes.func,
 isWishlistItem: PropTypes.bool,
};

export default ProductMain;
