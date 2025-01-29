import styles from "./aside.module.css";
import PropTypes from "prop-types";
import { X } from "lucide-react";
import formatText from "../../utils/formatText";

function Aside({ categories, category, handleFilterChange }) {
 return (
  <aside>
   <div className={styles.categories}>
    <h2>Categories</h2>
    {category && category !== "all" && (
     <div
      data-testid="remove-category"
      className={styles["remove-category"]}
      onClick={() => handleFilterChange(`all`)}
     >
      <X size={16} />
      <p>{formatText.capitalizedWords(category)}</p>
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
        <div data-testid={category} className={styles.displayed}>
         {formatText.capitalizedWords(category)}
        </div>
        <div className={styles.hovered}>
         {formatText.capitalizedWords(category)}
        </div>
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
