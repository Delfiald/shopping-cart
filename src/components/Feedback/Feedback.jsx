import PropTypes from "prop-types";
import Error from "./Error";
import Loading from "./Loading";

const Feedback = ({ error, setError, loading }) => {
 if (error && error !== "") return <Error error={error} setError={setError} />;

 if (loading) return <Loading />;

 return null;
};

Feedback.propTypes = {
 error: PropTypes.string,
 setError: PropTypes.func,
 loading: PropTypes.bool,
};

export default Feedback;
