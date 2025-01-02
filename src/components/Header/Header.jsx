import PropTypes from "prop-types";

function Header(props) {
 return (
  <header>
   <h1>{props.name}</h1>
  </header>
 );
}

Header.propTypes = {
 name: PropTypes.string,
};

Header.defaultProps = {
 name: "Hello World React",
};

export default Header;
