import { useLocation, useMatch } from "react-router-dom";
import styles from "./main.module.css";

import PropTypes from "prop-types";
import ErrorPage from "../../router/ErrorPage";

function HomeMain({ categories, products }) {
 return (
  <>
   <div className={styles.hero}>
    <div data-testid="products-carousel-section" className={styles.carousel}>
     {products &&
      products.slice(0, 5).map((product) => (
       <div key={product.id}>
        <img src={product.image} alt={product.title} />
        <h2>{product.title}</h2>
       </div>
      ))}
    </div>
   </div>
   <div data-testid="categories-section" className={styles.categories}>
    <h2>Categories</h2>
    {categories &&
     categories.map((category, index) => (
      <div key={index}>
       <img src="" alt={category} />
       <h3>{category}</h3>
      </div>
     ))}
   </div>
  </>
 );
}

function ShopMain() {
 return (
  <>
   <h2>Shop Main</h2>
  </>
 );
}

function ProductMain() {
 return (
  <>
   <h2>Product Main</h2>
  </>
 );
}

function CartMain() {
 return (
  <>
   <h2>Cart Main</h2>
  </>
 );
}

function Main({ categories, products }) {
 const location = useLocation();
 const matchProduct = useMatch("/product/:id");
 return (
  <main>
   {location.pathname === "/" ? (
    <HomeMain categories={categories} products={products} />
   ) : location.pathname === "/shop" ? (
    <ShopMain />
   ) : matchProduct ? (
    <ProductMain />
   ) : location.pathname === "/cart" ? (
    <CartMain />
   ) : (
    <ErrorPage />
   )}
  </main>
 );
}

Main.propTypes = {
 categories: PropTypes.array,
 products: PropTypes.array,
};

HomeMain.propTypes = {
 categories: PropTypes.array,
 products: PropTypes.array,
};

export default Main;
