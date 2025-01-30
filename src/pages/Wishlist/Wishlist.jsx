import { useOutletContext, useSearchParams } from "react-router-dom";
import WishlistMain from "../../components/Main/WishlistMain";
import { useEffect } from "react";

function Wishlist() {
 const [searchParams, setSearchParams] = useSearchParams();
 const {
  products,
  setCartItem,
  wishlistItem,
  setWishlistItem,
  hoverButton,
  setHoverButton,
 } = useOutletContext();

 const page = searchParams.get("page");
 const itemPerPage = searchParams.get("itemsPerPage");
 const sort = searchParams.get("sort");

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

 const getWishlistDetails = () => {
  return wishlistItem.map((wishlist) => {
   const product = products.find((p) => p.id === wishlist.id);
   return {
    ...product,
   };
  });
 };

 useEffect(() => {
  const validSort = [
   "name-asc",
   "name-desc",
   "price-asc",
   "price-desc",
  ].includes(sort)
   ? sort
   : "name-asc";
  const totalItems = wishlistItem.length;
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
   sort: validSort,
   page: validPage,
   itemsPerPage: validItemsPerPage,
  };

  const updatedParams = { ...defaultParams };

  if (
   JSON.stringify(updatedParams) !==
   JSON.stringify(Object.fromEntries(searchParams))
  ) {
   setSearchParams(updatedParams, { replace: true });
  }
 }, [
  page,
  itemPerPage,
  searchParams,
  setSearchParams,
  wishlistItem.length,
  sort,
 ]);

 return (
  <>
   <WishlistMain
    products={getWishlistDetails()}
    setCartItem={setCartItem}
    wishlistItem={wishlistItem}
    setWishlistItem={setWishlistItem}
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

export default Wishlist;
