import { describe, it, vi } from "vitest";
import Cart from "./Cart";
import { render } from "@testing-library/react";
import { MemoryRouter, Outlet, Route, Routes } from "react-router-dom";

const generateMockCartItem = (num) => {
 const products = [];
 for (let i = 1; i <= num; i++) {
  products.push({
   id: i,
   amount: 1,
  });
 }
 return products;
};

const generateMockProducts = (num) => {
 const products = [];
 for (let i = 1; i <= num; i++) {
  products.push({
   id: i,
   title: `product-${i}`,
   image: `/image/product-${i}.png`,
   price: 100 + (i % 10) * 10,
   category: `category-${(i % 5) + 1}`,
   description: `product bla bla bla number - ${i}`,
  });
 }
 return products;
};

const generateMockWishlist = (num) => {
 const products = [];
 for (let i = 1; i <= num; i++) {
  products.push({
   id: i,
  });
 }
 return products;
};

const MockRouter = () => {
 return (
  <MemoryRouter initialEntries={["/cart"]}>
   <Routes>
    <Route
     path="/"
     element={
      <Outlet
       context={{
        products: generateMockProducts(3),
        cartItem: generateMockCartItem(2),
        setCartItem: vi.fn(),
        wishlistItem: generateMockWishlist(2),
       }}
      />
     }
    >
     <Route path="/cart" element={<Cart />} />
    </Route>
   </Routes>
  </MemoryRouter>
 );
};

describe("Test Cart Page", () => {
 it("Should Render Cart Page", () => {
  const { container } = render(<MockRouter />);

  expect(container).toMatchSnapshot();
 });
});
