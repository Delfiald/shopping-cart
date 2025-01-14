import PropTypes from "prop-types";
import ShopMain from "../../components/Main/ShopMain";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import { useState } from "react";
import { CrossIcon } from "lucide-react";

function Aside({ categories, category }) {
 const navigate = useNavigate();
 const handleCategoryRouting = (category) => {
  navigate(`/shop/categories/${category}`);
 };

 return (
  <aside>
   <div className="categories">
    <div>Categories</div>
    {category && (
     <div className="remove-category" onClick={() => navigate("/shop")}>
      <CrossIcon size={16} />
      <p>Remove Category</p>
     </div>
    )}
    <div data-testid="category-lists" className="category-lists">
     {categories &&
      categories.map((category, index) => (
       <button
        onClick={() => handleCategoryRouting(category)}
        className="category"
        key={index}
        data-testid={`category-button-${index}`}
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
 const { category } = useParams();
 const { categories, products, hoverButton, setHoverButton } =
  useOutletContext();

 const [page, setPage] = useState(1);
 const [itemPerPage, setItemPerPage] = useState(10);
 const [sort, setSort] = useState("name-asc");

 const displayedProducts = category
  ? products.filter((product) => product.category === category)
  : products;

 return (
  <>
   <Aside categories={categories} category={category} />
   <ShopMain
    category={category}
    products={displayedProducts}
    page={page}
    setPage={setPage}
    itemPerPage={itemPerPage}
    setItemPerPage={setItemPerPage}
    sort={sort}
    setSort={setSort}
    hoverButton={hoverButton}
    setHoverButton={setHoverButton}
   />
  </>
 );
}

Aside.propTypes = {
 categories: PropTypes.array,
 category: PropTypes.string,
 navigate: PropTypes.func,
};

export default Shop;
