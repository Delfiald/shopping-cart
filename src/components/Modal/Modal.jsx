import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";

import styles from "./modal.module.css";
import { X } from "lucide-react";

export function BuyModal({ setModal, setIsExiting }) {
 const navigate = useNavigate();
 const handleRouteToShop = () => {
  setIsExiting(true);
  setTimeout(() => {
   setModal("");
   navigate("/shop");
   setIsExiting(false);
  }, 500);
 };
 return (
  <div className={styles["buy-modal"]}>
   <div className={styles["buy-modal-wrapper"]}>
    <div className={styles["buy-modal-container"]}>
     <div
      data-testid="close-button"
      className={styles["close-button"]}
      onClick={() => setModal("")}
     >
      <X title="close-button" size={16} />
     </div>
     <h3>Your purchase is complete! Would you like to continue shopping?</h3>
     <button data-testid="shop-button" onClick={handleRouteToShop}>
      <div className={styles.displayed}>Shop</div>
      <div className={styles.hovered}>Shop</div>
     </button>
    </div>
   </div>
  </div>
 );
}

BuyModal.propTypes = {
 setModal: PropTypes.func,
 setIsExiting: PropTypes.func,
};
