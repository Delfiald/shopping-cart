import ShopMain from "../../components/Main/ShopMain";
import Aside from "../../components/Aside/Aside";
import { useOutletContext, useSearchParams } from "react-router-dom";
import { useEffect } from "react";

function Shop() {
 const [searchParams, setSearchParams] = useSearchParams();
 const category = searchParams.get("category");
 const { categories, products, hoverButton, setHoverButton } =
  useOutletContext();

 const page = searchParams.get("page");
 const itemPerPage = searchParams.get("itemsPerPage");
 const sort = searchParams.get("sort");

 const displayedProducts =
  category && category !== "all"
   ? products.filter((product) => product.category === category)
   : products;

 const handleFilterChange = (newCategory) => {
  setSearchParams((prevParams) => {
   const params = new URLSearchParams(prevParams);
   params.set("category", newCategory);
   params.set("page", 1);
   return params;
  });
 };

 const handlePageChange = (page) => {
  setSearchParams((prevParams) => {
   const params = new URLSearchParams(prevParams);
   params.set("page", page);
   return params;
  });
 };

 const handleItemsPerPageChange = (itemsPerPage) => {
  setSearchParams((prevParams) => {
   const params = new URLSearchParams(prevParams);
   params.set("page", 1);
   params.set("itemsPerPage", itemsPerPage);

   return params;
  });
 };

 const handleSortChange = (sort) => {
  setSearchParams((prevParams) => {
   const params = new URLSearchParams(prevParams);
   params.set("sort", sort);
   return params;
  });
 };

 useEffect(() => {
  const defaultParams = {
   category: "all",
   sort: "name-asc",
   page: 1,
   itemsPerPage: 10,
  };

  const updatedParams = { ...defaultParams };
  for (const [key, value] of searchParams.entries()) {
   updatedParams[key] = value;
  }

  if (
   JSON.stringify(updatedParams) !==
   JSON.stringify(Object.fromEntries(searchParams))
  ) {
   setSearchParams(updatedParams);
  }
 }, [searchParams, setSearchParams]);

 return (
  <>
   <Aside
    categories={categories}
    category={category}
    handleFilterChange={handleFilterChange}
   />
   <ShopMain
    category={category}
    products={displayedProducts}
    page={parseInt(page)}
    setPage={handlePageChange}
    itemPerPage={parseInt(itemPerPage)}
    setItemPerPage={handleItemsPerPageChange}
    sort={sort}
    setSort={handleSortChange}
    hoverButton={hoverButton}
    setHoverButton={setHoverButton}
   />
  </>
 );
}

export default Shop;
