import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";

export function BuyModal({ setModal }) {
 const navigate = useNavigate();
 const handleRouteToShop = () => {
  setModal("");
  navigate("/shop");
 };
 return (
  <div className="buy-modal">
   <h3>Your purchase is complete! Would you like to continue shopping?</h3>
   <button onClick={handleRouteToShop}>Shop</button>
  </div>
 );
}

BuyModal.propTypes = {
 navigate: PropTypes.func,
 setModal: PropTypes.func,
};
