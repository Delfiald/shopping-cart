import PropTypes from "prop-types";
import ShopMain from "../../components/Main/ShopMain";
import { useOutletContext } from "react-router-dom";

function Aside({ categories }) {
 return (
  <aside>
   <div className="categories">
    <div>Categories</div>
    <div data-testid="category-lists" className="category-lists">
     {categories &&
      categories.map((category, index) => (
       <button className="category" key={index}>
        {category}
       </button>
      ))}
    </div>
   </div>
   <div className="filter"></div>
  </aside>
 );
}

function Shop() {
 const { categories, products } = useOutletContext();
 return (
  <>
   <Aside categories={categories} />
   <ShopMain products={products} />
  </>
 );
}

Aside.propTypes = {
 categories: PropTypes.array,
};

export default Shop;
