const getDetails = (products) => {
 const getCartDetails = (cartItem) => {
  return cartItem.map((cart) => {
   const product = products.find((p) => p.id === cart.id);
   return {
    ...product,
    amount: cart.amount,
   };
  });
 };

 const getWishlistDetails = (wishlistItem) => {
  return wishlistItem.map((wishlist) => {
   const product = products.find((p) => p.id === wishlist.id);
   return {
    ...product,
   };
  });
 };

 const getNotificationItemDetails = (notificationProducts) => {
  return notificationProducts.map((item) => {
   const product = products.find((p) => p.id === item.id);
   return {
    ...product,
    amount: item.amount,
   };
  });
 };
 return {
  getCartDetails,
  getWishlistDetails,
  getNotificationItemDetails,
 };
};

export default getDetails;
