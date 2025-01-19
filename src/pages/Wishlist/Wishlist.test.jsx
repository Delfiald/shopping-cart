import { render } from "@testing-library/react";
import { MemoryRouter, Outlet, Route, Routes } from "react-router-dom";
import Wishlist from "./Wishlist";

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
  <MemoryRouter initialEntries={["/wishlist"]}>
   <Routes>
    <Route
     path="/"
     element={
      <Outlet
       context={{
        products: generateMockProducts(3),
        wishlistItem: generateMockWishlist(2),
        setWishlistItem: vi.fn(),
       }}
      />
     }
    >
     <Route path="wishlist" element={<Wishlist />} />
    </Route>
   </Routes>
  </MemoryRouter>
 );
};

describe("Test Wishlist Page", () => {
 it("Should Render Wishlist Page", () => {
  const { container } = render(<MockRouter />);

  expect(container).toMatchSnapshot();
 });
});
