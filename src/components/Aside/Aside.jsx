import styles from "./aside.module.css";
import PropTypes from "prop-types";
import { CrossIcon } from "lucide-react";

function Aside({ categories, category, handleFilterChange }) {
 return (
  <aside>
   <div className={styles.categories}>
    <div>Categories</div>
    {category && category !== "all" && (
     <div
      data-testid="remove-category"
      className={styles["remove-category"]}
      onClick={() => handleFilterChange(`all`)}
     >
      <CrossIcon size={16} />
      <p>Remove Category</p>
     </div>
    )}
    <div data-testid="category-lists" className={styles["category-lists"]}>
     {categories &&
      categories.map((category, index) => (
       <button
        onClick={() => handleFilterChange(category)}
        className={styles.category}
        key={index}
        data-testid={`category-button-${index}`}
       >
        {category}
       </button>
      ))}
    </div>
   </div>
  </aside>
 );
}

Aside.propTypes = {
 categories: PropTypes.array,
 category: PropTypes.string,
 handleFilterChange: PropTypes.func,
};

export default Aside;
