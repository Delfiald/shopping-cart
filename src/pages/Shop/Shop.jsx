import PropTypes from "prop-types";
import ShopMain from "../../components/Main/ShopMain";
import { useNavigate, useOutletContext } from "react-router-dom";
import { useState } from "react";

function Aside({ categories }) {
 const navigate = useNavigate();

 const handleCategoryRouting = (category) => {
  navigate(`categories:/${category}`);
 };

 return (
  <aside>
   <div className="categories">
    <div>Categories</div>
    <div data-testid="category-lists" className="category-lists">
     {categories &&
      categories.map((category, index) => (
       <button
        onClick={() => handleCategoryRouting(category)}
        className="category"
        key={index}
       >
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

 const [page, setPage] = useState(1);
 const [itemPerPage, setItemPerPage] = useState(10);
 return (
  <>
   <Aside categories={categories} />
   <ShopMain
    products={products}
    page={page}
    setPage={setPage}
    itemPerPage={itemPerPage}
    setItemPerPage={setItemPerPage}
   />
  </>
 );
}

Aside.propTypes = {
 categories: PropTypes.array,
};

export default Shop;
