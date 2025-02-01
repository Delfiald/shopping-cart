import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";

import styles from "./feedback.module.css";

function Error({ error, setError }) {
 const navigate = useNavigate();

 const handleReturn = () => {
  setError("");
  navigate("/");
 };
 return (
  <section className={styles.error}>
   <div className={styles["error-wrapper"]}>
    <div className={styles["error-container"]}>
     <div className={styles["error-message"]}>{error}</div>
     <button
      data-testid="return-button"
      className={styles["return-button"]}
      onClick={handleReturn}
     >
      <div className={styles.displayed}>Return to Home</div>
      <div className={styles.hovered}>Return to Home</div>
     </button>
    </div>
   </div>
  </section>
 );
}

Error.propTypes = {
 error: PropTypes.string,
 setError: PropTypes.func,
};

export default Error;
