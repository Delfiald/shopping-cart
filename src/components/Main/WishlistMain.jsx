import styles from "./main.module.css";
import { Link, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import {
 ChevronDown,
 ChevronLeft,
 ChevronRight,
 ChevronUp,
 Heart,
 Plus,
} from "lucide-react";
import { setItem } from "../../utils/localStorage";

const ITEM_PER_PAGE = {
 FIVE: 5,
 TEN: 10,
 SHOW_ALL: Infinity,
};

function Card({ product, setCartItem, wishlistItem, setWishlistItem }) {
 const handleAddToCart = () => {
  setCartItem((prevCartItem) => {
   const exists = prevCartItem.find((item) => item.id === product.id);

   let updatedCart;

   if (exists) {
    updatedCart = prevCartItem.map((item) =>
     item.id === product.id ? { ...item, amount: item.amount + 1 } : item
    );
   } else {
    updatedCart = [...prevCartItem, { id: product.id, amount: 1 }];
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
  <div className={styles.card}>
   <Link
    data-testid={`product-card-${product.id}`}
    to={`/product/${product.id}`}
   >
    <div className={styles["image-wrapper"]}>
     <img src={product.image} alt={product.title} />
    </div>
    <div className={styles["product-name"]}>{product.title}</div>
    <div className={styles["product-price"]}>{product.price}</div>
   </Link>
   <div className={styles["card-action"]}>
    <button
     data-testid={`wishlist-button-${product.id}`}
     className={`${styles["wishlist-button"]} ${
      styles[isWishlist() ? "active" : "inactive"]
     }`}
     onClick={handleWishlistItem}
    >
     <Heart size={20} />
    </button>
    <button
     data-testid={`add-to-cart-button-${product.id}`}
     className={styles["add-to-cart"]}
     onClick={handleAddToCart}
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

function WishlistListHeader(props) {
 const sortValue = () => {
  if (props.sort === "name-asc") {
   return "Name Asc";
  } else if (props.sort === "name-desc") {
   return "Name Desc";
  } else if (props.sort === "price-asc") {
   return "Lowest Price";
  } else if (props.sort === "price-desc") {
   return "Highest Price";
  }
 };

 const handleMouseLeave = () => {
  props.setHoverButton("");
 };

 const handleItemPerPageDropdown = (value) => {
  props.setItemPerPage(value);
 };

 return (
  <div className={styles["product-list-header"]}>
   <div data-testid="list-header">
    <div className={styles["item-information"]}>
     {`Showing ${props.page && (props.page - 1) * props.itemPerPage + 1} - ${
      props.totalProducts &&
      Math.min(props.page * props.itemPerPage, props.totalProducts)
     } products`}
    </div>
    <div className={styles["option-wrapper"]}>
     <div
      data-testid="sort-button"
      className={styles["sort-button"]}
      onMouseEnter={() => props.setHoverButton("sort")}
      onMouseLeave={handleMouseLeave}
     >
      <div data-testid="sort-value">
       <p>{props.sort && sortValue()}</p>
       {props.hoverButton && props.hoverButton === "sort" ? (
        <ChevronUp size={16} />
       ) : (
        <ChevronDown size={16} />
       )}
      </div>
      {props.hoverButton && props.hoverButton === "sort" && (
       <div data-testid="sort-dropdown" className={styles["dropdown-wrapper"]}>
        <div
         data-testid="sort-option-1"
         onClick={() => props.setSort("name-asc")}
        >
         <div>Name Asc</div>
        </div>
        <div
         data-testid="sort-option-2"
         onClick={() => props.setSort("name-desc")}
        >
         <div>Name Desc</div>
        </div>
        <div
         data-testid="sort-option-3"
         onClick={() => props.setSort("price-asc")}
        >
         <div>Lowest Price</div>
        </div>
        <div
         data-testid="sort-option-4"
         onClick={() => props.setSort("price-desc")}
        >
         <div>Highest Price</div>
        </div>
       </div>
      )}
     </div>
     <div
      data-testid="item-per-page"
      className={styles["item-per-page"]}
      onMouseEnter={() => props.setHoverButton("item-per-page")}
      onMouseLeave={handleMouseLeave}
     >
      <div
       data-testid="item-per-page-value"
       className={styles["item-per-page-value"]}
      >
       <p>
        {!Number.isNaN(parseInt(props.itemPerPage))
         ? props.itemPerPage
         : "Show All"}
       </p>
       {props.hoverButton && props.hoverButton === "item-per-page" ? (
        <ChevronUp size={16} />
       ) : (
        <ChevronDown size={16} />
       )}
      </div>
      {props.hoverButton && props.hoverButton === "item-per-page" && (
       <div
        data-testid="item-per-page-dropdown"
        className={styles["dropdown-wrapper"]}
       >
        <div
         data-testid="item-per-page-option-1"
         onClick={() => handleItemPerPageDropdown(ITEM_PER_PAGE.FIVE)}
        >
         <div>5</div>
        </div>
        <div
         data-testid="item-per-page-option-2"
         onClick={() => handleItemPerPageDropdown(ITEM_PER_PAGE.TEN)}
        >
         <div>10</div>
        </div>
        <div
         data-testid="item-per-page-option-3"
         onClick={() => handleItemPerPageDropdown(ITEM_PER_PAGE.SHOW_ALL)}
        >
         <div>Show All</div>
        </div>
       </div>
      )}
     </div>
    </div>
   </div>
  </div>
 );
}

function WishlistListWrapper(props) {
 const navigate = useNavigate();
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
     onClick={() => navigate("/shop")}
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
     />
    ))}
  </section>
 );
}

function WishlistListBottom(props) {
 if (!props.itemPerPage) {
  return null;
 }
 const totalPage = Math.ceil(props.totalProducts / props.itemPerPage);

 if (!totalPage && totalPage <= 1) {
  return null;
 }

 return (
  <div className={styles["product-list-bottom"]}>
   <div className={styles.pagination}>
    <div className={styles["arrow-button"]}>
     {props.page > 1 && (
      <button
       data-testid="prev-button"
       className={styles["prev-button"]}
       onClick={() => props.setPage(props.page - 1)}
      >
       <ChevronLeft size={16} />
      </button>
     )}
     {props.page < totalPage && (
      <button
       data-testid="next-button"
       className={styles["next-button"]}
       onClick={() => props.setPage(props.page + 1)}
      >
       <ChevronRight size={16} />
      </button>
     )}
    </div>
    <div className={styles["number-button"]}>
     {/* If Current Page not 1 or Last it Render 1 and last Page Number */}
     {props.page !== 1 && (
      <div data-testid="first-page-button" onClick={() => props.setPage(1)}>
       1
      </div>
     )}
     {/* If Current Page more than 3 or less than 2 of last Page it Renders ... */}
     {totalPage > 4 && props.page > 3 && (
      <div data-testid="dots-before">...</div>
     )}

     {/* If Total Page More than 3 and current page is the last then render current page - 2 */}
     {totalPage > 3 && props.page === totalPage && (
      <div
       data-testid="prev-prev-page-button"
       onClick={() => props.setPage(props.page - 2)}
      >
       {props.page - 2}
      </div>
     )}

     {/* If Current Page more than 2 it render previous of current page number */}
     {props.page > 2 && (
      <div
       data-testid="prev-page-button"
       onClick={() => props.setPage(props.page - 1)}
      >
       {props.page - 1}
      </div>
     )}

     {/* It render current Page Number */}
     <div data-testid="current-page-button" className={styles["active"]}>
      {props.page}
     </div>

     {/* If current Page less than total page - 1, then render next of current page number */}
     {props.page < totalPage - 1 && (
      <div
       data-testid="next-page-button"
       onClick={() => props.setPage(props.page + 1)}
      >
       {props.page + 1}
      </div>
     )}

     {/* If Total Page more than 3 and current Page is 1 then render +2 from current Page Number */}
     {totalPage > 3 && props.page === 1 && (
      <div
       data-testid="next-next-page-button"
       onClick={() => props.setPage(props.page + 2)}
      >
       {props.page + 2}
      </div>
     )}

     {/* If current page less than total page -2 render ... */}
     {totalPage > 4 && props.page < totalPage - 2 && (
      <div data-testid="dots-after">...</div>
     )}
     {/* If Current Page not 1 or Last it Render 1 and last Page Number */}
     {props.page !== totalPage && (
      <div
       data-testid="last-page-button"
       onClick={() => props.setPage(totalPage)}
      >
       {totalPage}
      </div>
     )}
    </div>
   </div>
  </div>
 );
}

function WishlistMain({
 products = [],
 setCartItem,
 wishlistItem = [],
 setWishlistItem,
 page = 1,
 setPage,
 itemPerPage = 5,
 setItemPerPage,
 sort = "name-asc",
 setSort,
 hoverButton,
 setHoverButton,
}) {
 const displayedProducts = products
  ? [...products].sort((a, b) => {
     switch (sort) {
      case "name-asc":
       return a.title.localeCompare(b.title);
      case "name-desc":
       return b.title.localeCompare(a.title);
      case "price-asc":
       return a.price - b.price;
      case "price-desc":
       return b.price - a.price;
      default:
       return 0;
     }
    })
  : products;

 return (
  <main className={styles.wishlist}>
   <h2>Wishlist</h2>
   {products && (
    <WishlistListHeader
     totalProducts={products.length}
     page={page}
     itemPerPage={itemPerPage}
     setItemPerPage={setItemPerPage}
     sort={sort}
     setSort={setSort}
     hoverButton={hoverButton}
     setHoverButton={setHoverButton}
    />
   )}
   <WishlistListWrapper
    products={displayedProducts}
    page={page}
    itemPerPage={itemPerPage}
    setCartItem={setCartItem}
    wishlistItem={wishlistItem}
    setWishlistItem={setWishlistItem}
   />
   {products && (
    <WishlistListBottom
     totalProducts={products.length}
     page={page}
     setPage={setPage}
     itemPerPage={itemPerPage}
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
};

Card.propTypes = {
 product: PropTypes.object,
 setCartItem: PropTypes.func,
 wishlistItem: PropTypes.array,
 setWishlistItem: PropTypes.func,
};

WishlistListHeader.propTypes = {
 totalProducts: PropTypes.number,
 page: PropTypes.number,
 itemPerPage: PropTypes.number,
 setItemPerPage: PropTypes.func,
 sort: PropTypes.string,
 setSort: PropTypes.func,
 hoverButton: PropTypes.string,
 setHoverButton: PropTypes.func,
};

WishlistListWrapper.propTypes = {
 products: PropTypes.array,
 page: PropTypes.number,
 itemPerPage: PropTypes.number,
 setCartItem: PropTypes.func,
 wishlistItem: PropTypes.array,
 setWishlistItem: PropTypes.func,
};

WishlistListBottom.propTypes = {
 totalProducts: PropTypes.number,
 page: PropTypes.number,
 setPage: PropTypes.func,
 itemPerPage: PropTypes.number,
};

export default WishlistMain;
