import styles from "../Main/main.module.css";
import PropTypes from "prop-types";
import { ChevronLeft, ChevronRight } from "lucide-react";

function Pagination(props) {
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

Pagination.propTypes = {
 totalProducts: PropTypes.number,
 page: PropTypes.number,
 setPage: PropTypes.func,
 itemPerPage: PropTypes.number,
};

export default Pagination;
