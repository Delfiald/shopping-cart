import { useNavigate } from "react-router-dom";
import styles from "./main.module.css";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";

import formatText from "../../utils/formatText";
import createHandleNavigate from "../../utils/handleNavigate";
import displayedProducts from "../../utils/sortProductsHandler";
import Toolbar from "../Toolbar/Toolbar";
import Pagination from "../Pagination/Pagination";

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

function ShopMain(props) {
 const navigate = useNavigate();
 const handleNavigate = createHandleNavigate(props.setIsExiting, navigate);

 const [isVisible, setIsVisible] = useState(false);

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
    <Toolbar
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
    products={displayedProducts(props.products, props.sort)}
    page={props.page}
    itemPerPage={props.itemPerPage}
    handleNavigate={handleNavigate}
    search={props.search}
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

ProductListWrapper.propTypes = {
 products: PropTypes.array,
 page: PropTypes.number,
 itemPerPage: PropTypes.number,
 handleNavigate: PropTypes.func,
 search: PropTypes.string,
};

export default ShopMain;
