import { useNavigate } from "react-router-dom";
import styles from "./main.module.css";

import PropTypes from "prop-types";
import {
 ChevronDown,
 ChevronLeft,
 ChevronRight,
 ChevronUp,
} from "lucide-react";
import formatText from "../../utils/formatText";
import { useEffect, useState } from "react";

const ITEM_PER_PAGE = {
 FIVE: 5,
 TEN: 10,
 SHOW_ALL: Infinity,
};

function Card({ product, handleNavigate }) {
 return (
  <div
   onClick={() => handleNavigate(`/product/${product.id}`)}
   data-testid={`product-card-${product.id}`}
   className={styles.card}
  >
   <div className={styles["image-wrapper"]}>
    <img src={product.image} alt={product.title} />
   </div>
   <div className={styles["product-name"]}>{product.title}</div>
   <div className={styles["product-price"]}>
    {formatText.priceText(product.price)}
   </div>
  </div>
 );
}

function ProductListHeader(props) {
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
     {props.totalProducts > 0 &&
      `Showing ${
       props.page && !isNaN(props.itemPerPage)
        ? (props.page - 1) * props.itemPerPage + 1
        : 1
      } - ${
       props.totalProducts
        ? isNaN(props.itemPerPage)
          ? props.totalProducts
          : Math.min(props.page * props.itemPerPage, props.totalProducts)
        : 0
      } products${
       props.search && props.search !== "" ? ` of ${props.search}` : ""
      }`}
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

function ProductListWrapper(props) {
 if (!props.products) {
  return null;
 }

 const currentProducts = Number.isNaN(props.itemPerPage)
  ? props.products
  : props.products.slice(
     (props.page - 1) * props.itemPerPage,
     props.page * props.itemPerPage
    );

 if (!props.products.length > 0) {
  return (
   <div className={styles["empty-shop"]}>
    <div>{`There are no products for "${props.search}"`}</div>
   </div>
  );
 }

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
      handleNavigate={props.handleNavigate}
     />
    ))}
  </section>
 );
}

function ProductListBottom(props) {
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
     <div
      data-testid="current-page-button"
      className={`${styles["current-page-button"]} ${styles["active"]}`}
     >
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

function ShopMain(props) {
 const navigate = useNavigate();
 const [isVisible, setIsVisible] = useState(false);
 const handleNavigate = (path) => {
  props.setIsExiting(true);
  setTimeout(() => {
   navigate(path);
   props.setIsExiting(false);
  }, 500);
 };
 // Displayed Products Sorted
 const displayedProducts = props.products
  ? [...props.products].sort((a, b) => {
     switch (props.sort) {
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
  : props.products;

 useEffect(() => {
  setIsVisible(true);
 }, []);

 return (
  <main
   className={`${styles.shop} ${isVisible ? styles["fade-out"] : ""} ${
    props.isExiting ? styles["fade-in"] : ""
   }`}
  >
   <h2>
    {props.category && props.category !== "all"
     ? formatText.capitalizedWords(props.category)
     : "All Products"}
   </h2>
   {props.products && (
    <ProductListHeader
     totalProducts={props.products.length}
     page={props.page}
     itemPerPage={props.itemPerPage}
     setItemPerPage={props.setItemPerPage}
     sort={props.sort}
     setSort={props.setSort}
     hoverButton={props.hoverButton}
     setHoverButton={props.setHoverButton}
     search={props.search}
    />
   )}
   <ProductListWrapper
    products={displayedProducts}
    page={props.page}
    itemPerPage={props.itemPerPage}
    handleNavigate={handleNavigate}
    search={props.search}
   />
   {props.products && (
    <ProductListBottom
     totalProducts={props.products.length}
     page={props.page}
     setPage={props.setPage}
     itemPerPage={props.itemPerPage}
    />
   )}
  </main>
 );
}

ShopMain.propTypes = {
 category: PropTypes.string,
 products: PropTypes.array,
 page: PropTypes.number,
 setPage: PropTypes.func,
 itemPerPage: PropTypes.number,
 setItemPerPage: PropTypes.func,
 sort: PropTypes.string,
 setSort: PropTypes.func,
 hoverButton: PropTypes.string,
 setHoverButton: PropTypes.func,
 search: PropTypes.string,
 isExiting: PropTypes.bool,
 setIsExiting: PropTypes.func,
};

Card.propTypes = {
 product: PropTypes.object,
 handleNavigate: PropTypes.func,
};

ProductListHeader.propTypes = {
 totalProducts: PropTypes.number,
 page: PropTypes.number,
 itemPerPage: PropTypes.number,
 setItemPerPage: PropTypes.func,
 sort: PropTypes.string,
 setSort: PropTypes.func,
 hoverButton: PropTypes.string,
 setHoverButton: PropTypes.func,
 search: PropTypes.string,
};

ProductListWrapper.propTypes = {
 products: PropTypes.array,
 page: PropTypes.number,
 itemPerPage: PropTypes.number,
 handleNavigate: PropTypes.func,
 search: PropTypes.string,
};

ProductListBottom.propTypes = {
 totalProducts: PropTypes.number,
 page: PropTypes.number,
 setPage: PropTypes.func,
 itemPerPage: PropTypes.number,
};

export default ShopMain;
