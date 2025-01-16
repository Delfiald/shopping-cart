import { render } from "@testing-library/react";
import Product from "./Product";
import { expect } from "vitest";
import { MemoryRouter, Outlet, Route, Routes } from "react-router-dom";

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

const MockRouter = () => {
 return (
  <MemoryRouter initialEntries={["/product/1"]}>
   <Routes>
    <Route
     path="/"
     element={<Outlet context={{ products: generateMockProducts(5) }} />}
    >
     <Route path="/product/:id" element={<Product />} />
    </Route>
   </Routes>
  </MemoryRouter>
 );
};

describe("Test Product Page", () => {
 it("Should Render Product Page Component", () => {
  const { container } = render(<MockRouter />);

  expect(container).toMatchSnapshot();
 });
});
