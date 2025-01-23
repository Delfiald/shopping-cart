import { getItem, removeItem, setItem } from "./localStorage";
import { render, screen } from "@testing-library/react";
import ProductMain from "../components/Main/ProductMain";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { MemoryRouter } from "react-router-dom";
import CartMain from "../components/Main/CartMain";
import { format } from "date-fns";

const generateMockProducts = (num) => {
 const mockProducts = [];

 for (let i = 1; i <= num; i++) {
  mockProducts.push({
   id: i,
   title: `product-${i}`,
   image: `/image/product-${i}.png`,
   price: 100 + (i % 10) * 10,
   category: `category-${(i % 5) + 1}`,
  });
 }
 return mockProducts;
};

const generateMockCartItem = (num) => {
 const mockCartItem = [];

 for (let i = 1; i <= num; i++) {
  mockCartItem.push({
   id: i,
   amount: 1,
  });
 }
 return mockCartItem;
};

const timeStamp = Date.now();
const formattedDate = format(timeStamp, "dd/MM/yyyy HH:mm");

const mockNotification = {
 id: 1,
 message: `Purchase Complete, total Price: 360`,
 products: [...generateMockCartItem(3)],
 timeStamp: formattedDate,
 isRead: false,
};

const mockProduct = {
 id: 1,
 title: "product-1",
 image: "/image/product-1.png",
 price: 110,
 category: "category-1",
};

describe("Test Local Storage", () => {
 beforeEach(() => {
  localStorage.clear();
 });

 it("should store and retrieve item directly using localStorage", () => {
  const key = "cart";
  const value = [{ id: 1, name: "Apple" }];

  setItem(key, value);

  const storedValue = localStorage.getItem(key);
  expect(storedValue).toBe(JSON.stringify(value));

  const retrievedValue = getItem(key);
  expect(retrievedValue).toEqual(value);
 });

 it("should remove item directly using localStorage", () => {
  const key = "wishlist";
  const value = [{ id: 2, name: "Samsung Galaxy" }];

  setItem(key, value);

  removeItem(key);

  expect(localStorage.getItem(key)).toBeNull();
 });

 it("Should Save Cart and Wishlist to localStorage from Product Page", async () => {
  const user = userEvent.setup();

  const MockProductMain = () => {
   const [, setCartItem] = useState([]);
   const [wishlistItem, setWishlistItem] = useState([]);

   return (
    <MemoryRouter>
     <ProductMain
      product={mockProduct}
      setCartItem={setCartItem}
      wishlistItem={wishlistItem}
      setWishlistItem={setWishlistItem}
     />
    </MemoryRouter>
   );
  };

  render(<MockProductMain />);

  const addCartButton = screen.getByTestId("add-to-cart");
  expect(addCartButton).toBeInTheDocument();

  await user.click(addCartButton);

  const retrievedValue = getItem("cart");
  expect(retrievedValue).toEqual([{ amount: 1, id: 1 }]);

  const wishlistButton = screen.getByTestId("wishlist-button");
  expect(wishlistButton).toBeInTheDocument();

  await user.click(wishlistButton);

  let retrievedWishlistValue = getItem("wishlist");
  expect(retrievedWishlistValue).toEqual([{ id: 1 }]);

  await user.click(wishlistButton);

  retrievedWishlistValue = getItem("wishlist");
  expect(retrievedWishlistValue).toEqual([]);
 });

 it("Should Save notification localStorage cart Page", async () => {
  const user = userEvent.setup();

  const MockProductMain = () => {
   const [cartItem, setCartItem] = useState(generateMockCartItem(3));
   const [wishlistItem, setWishlistItem] = useState([]);
   const [, setNotificationItem] = useState([]);

   return (
    <MemoryRouter>
     <CartMain
      products={generateMockProducts(3)}
      cartItem={cartItem}
      setCartItem={setCartItem}
      wishlistItem={wishlistItem}
      setWishlistItem={setWishlistItem}
      setNotificationItem={setNotificationItem}
     />
    </MemoryRouter>
   );
  };

  render(<MockProductMain />);

  const buyButton = screen.getByTestId("buy-button");
  expect(buyButton).toBeInTheDocument();

  let retrievedNotificationValue = getItem("notification");
  expect(retrievedNotificationValue).toBeNull();

  await user.click(buyButton);

  retrievedNotificationValue = getItem("notification");
  expect(retrievedNotificationValue).toEqual([mockNotification]);
 });
});
