import styles from "./errorPage.module.css";

import { Link } from "react-router-dom";

const ErrorPage = () => {
 return (
  <section>
   <p>Path Not Found 404</p>
   <Link
    data-testid="return-button"
    className={styles["return-button"]}
    to={"/"}
   >
    Return to Home
   </Link>
  </section>
 );
};

export default ErrorPage;
