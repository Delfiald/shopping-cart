import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";

import styles from "./modal.module.css";

export function BuyModal({ setModal }) {
 const navigate = useNavigate();
 const handleRouteToShop = () => {
  setModal("");
  navigate("/shop");
 };
 return (
  <div className={styles["buy-modal"]}>
   <div className={styles["buy-modal-wrapper"]}>
    <div className={styles["buy-modal-container"]}>
     <h3>Your purchase is complete! Would you like to continue shopping?</h3>
     <button onClick={handleRouteToShop}>
      <div className={styles.displayed}>Shop</div>
      <div className={styles.hovered}>Shop</div>
     </button>
    </div>
   </div>
  </div>
 );
}

BuyModal.propTypes = {
 navigate: PropTypes.func,
 setModal: PropTypes.func,
};
