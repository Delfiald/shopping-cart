import styles from "./errorPage.module.css";

import { Link } from "react-router-dom";

const ErrorPage = () => {
 return (
  <section className={styles["error-page"]}>
   <p>Path Not Found 404</p>
   <Link
    data-testid="return-button"
    className={styles["return-button"]}
    to={"/"}
   >
    <div className={styles.displayed}>Return to Home</div>
    <div className={styles.hovered}>Return to Home</div>
   </Link>
  </section>
 );
};

export default ErrorPage;
