import ShopMain from "../../components/Main/ShopMain";
import Aside from "../../components/Aside/Aside";
import { useOutletContext, useSearchParams } from "react-router-dom";
import { useEffect } from "react";

function Shop() {
 const [searchParams, setSearchParams] = useSearchParams();
 const category = searchParams.get("category");
 const {
  categories,
  products,
  hoverButton,
  setHoverButton,
  isExiting,
  setIsExiting,
 } = useOutletContext();

 const page = searchParams.get("page");
 const itemPerPage = searchParams.get("itemsPerPage");
 const sort = searchParams.get("sort");
 const search = searchParams.get("search") || "";

 const displayedProducts = products
  .filter((product) => {
   if (category && category !== "all") {
    return product.category === category;
   }
   return true;
  })
  .filter((product) => {
   if (search) {
    return product.title
     .toLowerCase()
     .replace(/\s+/g, "")
     .includes(search.toLowerCase());
   }
   return true;
  });

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
  const validCategory = categories.includes(category) ? category : "all";
  const validSort = [
   "name-asc",
   "name-desc",
   "price-asc",
   "price-desc",
  ].includes(sort)
   ? sort
   : "name-asc";
  const totalItems = displayedProducts.length;
  const maxPage =
   itemPerPage === "Infinity" ? 1 : Math.ceil(totalItems / (itemPerPage || 10));
  const validPage = Math.max(1, Math.min(parseInt(page) || 1, maxPage));
  const validItemsPerPage =
   itemPerPage === "Infinity"
    ? Infinity
    : [5, 10].includes(parseInt(itemPerPage))
    ? itemPerPage
    : 10;

  const defaultParams = {
   category: validCategory,
   sort: validSort,
   page: validPage,
   itemsPerPage: validItemsPerPage,
   search: search,
  };

  const updatedParams = { ...defaultParams };

  if (
   JSON.stringify(updatedParams) !==
   JSON.stringify(Object.fromEntries(searchParams))
  ) {
   setSearchParams(updatedParams, { replace: true });
  }
 }, [
  categories,
  category,
  displayedProducts.length,
  itemPerPage,
  page,
  products,
  products.length,
  search,
  searchParams,
  setSearchParams,
  sort,
 ]);

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
    search={search}
    isExiting={isExiting}
    setIsExiting={setIsExiting}
   />
  </>
 );
}

export default Shop;
