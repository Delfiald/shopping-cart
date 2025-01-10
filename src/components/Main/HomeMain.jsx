import { useNavigate } from "react-router-dom";
import styles from "./main.module.css";

import PropTypes from "prop-types";

function HomeMain({ categories, products }) {
 const navigate = useNavigate();
 return (
  <main>
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
   <div className={styles["call-to-action"]}>
    <img src="" alt="Call to Action Background" />
    <button onClick={() => navigate("/shop")}>Shop Now</button>
   </div>
  </main>
 );
}

HomeMain.propTypes = {
 categories: PropTypes.array,
 products: PropTypes.array,
};

export default HomeMain;
