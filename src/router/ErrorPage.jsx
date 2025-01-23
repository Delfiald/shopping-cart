import { Link } from "react-router-dom";

const ErrorPage = () => {
 return (
  <section>
   <p>Path Not Found 404</p>
   <Link data-testid="return-button" className="return-button" to={"/"}>
    Return to Home
   </Link>
  </section>
 );
};

export default ErrorPage;
