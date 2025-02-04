import { useNavigate } from "react-router-dom";
import styles from "./main.module.css";

import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import styled from "styled-components";
import createHandleNavigate from "../../utils/handleNavigate";

const CarouselLoading = styled.div.withConfig({
 shouldForwardProp: (prop) => prop !== "loadingDuration",
})`
 animation: ${(props) =>
  `carousel-bar ${props.loadingDuration} ease-in-out infinite`};

 @keyframes carousel-bar {
  0% {
   width: 0%;
  }

  100% {
   width: 100%;
  }
 }
`;

function HomeMain({ categories, products, isExiting, setIsExiting }) {
 const navigate = useNavigate();
 const handleNavigate = createHandleNavigate(setIsExiting, navigate);

 const [isVisible, setIsVisible] = useState(false);

 useEffect(() => {
  setIsVisible(true);
 }, []);

 //  Carousel Logic
 const [displayedProduct, setDisplayedProduct] = useState({
  id: -1,
  image: "",
  title: "",
 });

 const [loadingDuration, setLoadingDuration] = useState("7.5s");
 const [fadeIn, setFadeIn] = useState(false);
 const [ctaProductIndex, setCtaProductIndex] = useState(null);

 const handleDisplayedProduct = (
  displayedId,
  displayedImage,
  displayedTitle
 ) => {
  setFadeIn(false);
  setLoadingDuration("0s");
  setTimeout(() => {
   setDisplayedProduct({
    id: displayedId,
    image: displayedImage,
    title: displayedTitle,
   });
   setLoadingDuration("7.5s");
   setFadeIn(true);
  }, 300);
 };

 useEffect(() => {
  const startCarousel = () => {
   let currentIndex = products.findIndex((p) => p.id === displayedProduct.id);
   if (currentIndex === -1) {
    currentIndex = 0;
    handleDisplayedProduct(
     products[currentIndex].id,
     products[currentIndex].image,
     products[currentIndex].title
    );
   }

   const intervalId = setInterval(() => {
    currentIndex = (currentIndex + 1) % Math.min(products.length, 3);

    handleDisplayedProduct(
     products[currentIndex].id,
     products[currentIndex].image,
     products[currentIndex].title
    );
   }, 7500);

   return intervalId;
  };

  if (products.length > 0) {
   const intervalId = startCarousel();

   if (ctaProductIndex === null) {
    setCtaProductIndex(Math.floor(Math.random() * products.length));
   }

   return () => {
    clearInterval(intervalId);
   };
  }
 }, [ctaProductIndex, displayedProduct.id, products]);

 return (
  <main
   className={`${styles.home} ${isVisible ? styles["fade-out"] : ""} ${
    isExiting ? styles["fade-in"] : ""
   }`}
  >
   <div className={styles.hero}>
    <div data-testid="products-carousel-section" className={styles.carousel}>
     {products && products.length > 0 && (
      <>
       <div
        className={`${styles["item-display"]} ${
         fadeIn ? styles["fade-in"] : ""
        }`}
        onClick={() => handleNavigate(`/product/${displayedProduct.id}`)}
       >
        <div className={styles["displayed-image"]}>
         <img src={displayedProduct.image} alt={displayedProduct.title} />
        </div>
        <h2>{displayedProduct.title}</h2>
       </div>
       <div className={styles["carousel-item-wrapper"]}>
        <CarouselLoading
         key={displayedProduct.id}
         loadingDuration={loadingDuration}
         className={styles["loading-bar"]}
        ></CarouselLoading>
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
       onClick={() => handleNavigate(`/shop?category=${category}`)}
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
      onClick={() => handleNavigate("/shop")}
     >
      <div className={styles["displayed"]}>Shop Now</div>
      <div className={styles["hovered"]}>Shop Now</div>
     </button>
    </div>
    <div className={styles["cta-background-wrapper"]}>
     <img
      src={
       products.length > 0 && ctaProductIndex !== null
        ? products[ctaProductIndex].image
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
 isExiting: PropTypes.bool,
 setIsExiting: PropTypes.func,
};

export default HomeMain;
