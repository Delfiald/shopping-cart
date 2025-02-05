import styles from "../Main/main.module.css";
import PropTypes from "prop-types";
import { ChevronDown, ChevronUp } from "lucide-react";

const ITEM_PER_PAGE = {
 FIVE: 5,
 TEN: 10,
 SHOW_ALL: Infinity,
};

function Toolbar(props) {
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

Toolbar.propTypes = {
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

export default Toolbar;
