const handleWishlistItem = (setWishlistItem, product, setItem) => {
 setWishlistItem((prevWishlistItem) => {
  const exists = prevWishlistItem.find((item) => item.id === product.id);

  const updatedWishlist = exists
   ? prevWishlistItem.filter((item) => item.id !== product.id)
   : [...prevWishlistItem, { id: product.id }];

  setItem("wishlist", updatedWishlist);
  return updatedWishlist;
 });
};

export const isWishlist = (wishlistItem, product) =>
 wishlistItem.some((wishlist) => wishlist.id === product.id);

export default handleWishlistItem;
