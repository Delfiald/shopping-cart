import PropTypes from "prop-types";

function Header(props = { name: "Hello World React" }) {
 const handleHeroChange = () => {
  props.setName((prevName) => prevName + " Clicked!");
 };

 return (
  <header>
   <h1 onClick={handleHeroChange}>{props.name}</h1>
  </header>
 );
}

Header.propTypes = {
 name: PropTypes.string,
 setName: PropTypes.func.isRequired,
};

export default Header;
