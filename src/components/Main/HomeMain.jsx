import { useNavigate } from "react-router-dom";
import styles from "./main.module.css";

import PropTypes from "prop-types";
import { useEffect, useState } from "react";

function HomeMain({ categories, products }) {
 const navigate = useNavigate();
 const [displayedProduct, setDisplayedProduct] = useState({
  id: -1,
  image: "",
  title: "",
 });

 const handleDisplayedProduct = (
  displayedId,
  displayedImage,
  displayedTitle
 ) => {
  setDisplayedProduct({
   id: displayedId,
   image: displayedImage,
   title: displayedTitle,
  });
 };

 useEffect(() => {
  if (products.length > 0) {
   setDisplayedProduct({
    id: products[0].id || -1,
    image: products[0].image || "",
    title: products[0].title || "",
   });
  }
 }, [products]);

 return (
  <main>
   <div className={styles.hero}>
    <div data-testid="products-carousel-section" className={styles.carousel}>
     {products && products.length > 0 && (
      <>
       <div
        className={styles["item-display"]}
        onClick={() => navigate(`/product/${displayedProduct.id}`)}
       >
        <div className={styles["displayed-image"]}>
         <img src={displayedProduct.image} alt={displayedProduct.title} />
        </div>
        <h2>{displayedProduct.title}</h2>
       </div>
       <div className={styles["carousel-item-wrapper"]}>
        <div className={styles["loading-bar"]}></div>
        {products.slice(0, 3).map((product) => (
         <div
          key={product.id}
          className={`${styles["carousel-item"]} ${
           styles[displayedProduct.id === product.id ? "active" : ""]
          }`}
          onClick={() =>
           handleDisplayedProduct(product.id, product.image, product.title)
          }
         >
          <div className={styles["image-wrapper"]}>
           <img title={product.title} src={product.image} alt={product.title} />
          </div>
         </div>
        ))}
       </div>
      </>
     )}
    </div>
   </div>
   <div data-testid="categories-section" className={styles.categories}>
    <h2>Categories</h2>
    {categories &&
     categories.map((category, index) => (
      <div
       key={index}
       className={styles.category}
       onClick={() => navigate(`/shop?category=${category}`)}
      >
       <img src={`Categories/${category}.jpg`} alt={category} />
       <h3>{category}</h3>
      </div>
     ))}
   </div>
   <div className={styles["call-to-action"]}>
    <div className={styles["cta-wrapper"]}>
     <div className={styles["premises-text"]}>
      <h2>{`Don’t miss out on exclusive deals!`}</h2>
      <div>Tap the button and start your shopping journey</div>
     </div>
     <button
      data-testid="cta-button"
      className={styles["cta-button"]}
      onClick={() => navigate("/shop")}
     >
      <div className={styles["displayed"]}>Shop Now</div>
      <div className={styles["hovered"]}>Shop Now</div>
     </button>
    </div>
    <div className={styles["cta-background-wrapper"]}>
     <img
      src={
       products.length > 0
        ? products[Math.floor(Math.random() * products.length)].image
        : ""
      }
      alt="Call to Action Background"
     />
    </div>
   </div>
  </main>
 );
}

HomeMain.propTypes = {
 categories: PropTypes.array,
 products: PropTypes.array,
};

export default HomeMain;
