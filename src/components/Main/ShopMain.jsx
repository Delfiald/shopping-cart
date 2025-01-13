import { Link } from "react-router-dom";
import styles from "./main.module.css";

import PropTypes from "prop-types";
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";

function Card({ product }) {
 return (
  <Link
   to={`/product/${product.id}`}
   data-testid={`product-card-${product.id}`}
   className={styles.card}
  >
   <img src={product.image} alt={product.title} />
   <div className={styles["product-name"]}>{product.title}</div>
   <div className={styles["product-price"]}>{product.price}</div>
  </Link>
 );
}

function ProductListHeader(props) {
 return (
  <div className="product-list-header">
   <div data-testid="list-header">
    <div className="item-information">
     {`Showing ${props.page && (props.page - 1) * props.itemPerPage + 1} - ${
      props.totalProducts &&
      Math.min(props.page * props.itemPerPage, props.totalProducts)
     } products`}
    </div>
    <div className="sort-wrapper">
     <p>Sort:</p>
     <div className="sort-button">
      <div>
       Lowest Price <ChevronDown size={16} />
      </div>
      <div className="dropdown-wrapper">
       <div className="item">Name Asc</div>
       <div className="item">Name Desc</div>
       <div className="item">Highest Price</div>
       <div className="item">Lowest Price</div>
      </div>
     </div>
    </div>
    <div className="item-per-page">
     <div className="show">
      {props.itemPerPage} <ChevronDown size={16} />
     </div>
     <div className="dropdown-wrapper">
      <div>5</div>
      <div>10</div>
      <div>Show All</div>
     </div>
    </div>
   </div>
  </div>
 );
}

function ProductListBottom(props) {
 const totalPage = Math.ceil(props.totalProducts / props.itemPerPage);

 if (totalPage <= 1) {
  return null;
 }
 return (
  <div className="product-list-bottom">
   <div className="pagination">
    <div className="arrow-button">
     {props.page > 1 && (
      <button
       data-testid="prev-button"
       className="prev-button"
       onClick={() => props.setPage(props.page - 1)}
      >
       <ChevronLeft size={16} />
      </button>
     )}
     {props.page < totalPage && (
      <button
       data-testid="next-button"
       className="next-button"
       onClick={() => props.setPage(props.page + 1)}
      >
       <ChevronRight size={16} />
      </button>
     )}
    </div>
    <div className="number-button">
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
     <div data-testid="current-page-button" className="active">
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
 return (
  <main>
   <h2>All Products</h2>
   {props.products && (
    <ProductListHeader
     totalProducts={props.products.length}
     page={props.page}
     itemPerPage={props.itemPerPage}
    />
   )}
   <section
    data-testid="product-card"
    className={styles["product-list-wrapper"]}
   >
    {props.products &&
     props.products.map((product) => (
      <Card key={product.id} product={product} />
     ))}
   </section>
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
 products: PropTypes.array,
 page: PropTypes.number,
 setPage: PropTypes.func,
 itemPerPage: PropTypes.number,
 setItemPerPage: PropTypes.func,
};

Card.propTypes = {
 product: PropTypes.object,
};

ProductListHeader.propTypes = {
 totalProducts: PropTypes.number,
 page: PropTypes.number,
 itemPerPage: PropTypes.number,
};

ProductListBottom.propTypes = {
 totalProducts: PropTypes.number,
 page: PropTypes.number,
 setPage: PropTypes.func,
 itemPerPage: PropTypes.number,
};

export default ShopMain;
