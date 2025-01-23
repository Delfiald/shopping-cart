import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";

function Error({ error, setError }) {
 const navigate = useNavigate();

 const handleReturn = () => {
  setError("");
  navigate("/");
 };
 return (
  <section className="error">
   <div className="error-message">{error}</div>
   <button
    data-testid="return-button"
    className="return-button"
    onClick={handleReturn}
   >
    Return to Home
   </button>
  </section>
 );
}

Error.propTypes = {
 error: PropTypes.string,
 setError: PropTypes.func,
};

export default Error;
