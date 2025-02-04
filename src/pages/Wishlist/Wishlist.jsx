import { useOutletContext, useSearchParams } from "react-router-dom";
import { useEffect } from "react";
import WishlistMain from "../../components/Main/WishlistMain";
import getDetails from "../../utils/getDetails";
import {
 createHandleItemsPerPageChange,
 createHandlePageChange,
 createHandleSortChange,
} from "../../utils/searchParamsUtils";

function Wishlist() {
 const {
  products,
  setCartItem,
  wishlistItem,
  setWishlistItem,
  hoverButton,
  setHoverButton,
  isExiting,
  setIsExiting,
 } = useOutletContext();

 const [searchParams, setSearchParams] = useSearchParams();
 const page = searchParams.get("page");
 const itemPerPage = searchParams.get("itemsPerPage");
 const sort = searchParams.get("sort");

 const handleItemsPerPageChange =
  createHandleItemsPerPageChange(setSearchParams);
 const handlePageChange = createHandlePageChange(setSearchParams);
 const handleSortChange = createHandleSortChange(setSearchParams);

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

 if (products.length === 0) {
  return null;
 }

 return (
  <>
   <WishlistMain
    products={getDetails(products).getWishlistDetails(wishlistItem)}
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
    isExiting={isExiting}
    setIsExiting={setIsExiting}
   />
  </>
 );
}

export default Wishlist;
