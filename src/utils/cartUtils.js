import { setItem } from "./localStorage/localStorage";

export const handleAddToCart = (setCartItem, product, amount) => {
 setCartItem((prevCartItem) => {
  const exists = prevCartItem.find((item) => item.id == product.id);

  let updatedCart;

  if (exists) {
   updatedCart = prevCartItem.map((item) =>
    item.id === product.id ? { ...item, amount: item.amount + amount } : item
   );
  } else {
   updatedCart = [...prevCartItem, { id: product.id, amount: amount }];
  }

  setItem("cart", updatedCart);

  return updatedCart;
 });
};

export const orderAmount = (cartItem) => {
 return cartItem.reduce((prevItem, item) => prevItem + item.amount, 0);
};
