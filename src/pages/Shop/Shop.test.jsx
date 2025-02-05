import { MemoryRouter, Outlet, Route, Routes } from "react-router-dom";
import Shop from "./Shop";
import { render } from "@testing-library/react";

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
const mockCategories = ["category-1", "category-2"];

const MockRouter = () => {
 return (
  <MemoryRouter initialEntries={["/shop"]}>
   <Routes>
    <Route
     path="/"
     element={
      <Outlet
       context={{
        products: generateMockProducts(5),
        categories: mockCategories,
       }}
      />
     }
    >
     <Route path="shop" element={<Shop />} />
    </Route>
   </Routes>
  </MemoryRouter>
 );
};

describe("Test Home Page", () => {
 it("Should Render Home Page", () => {
  const { container } = render(<MockRouter />);

  expect(container).toMatchSnapshot();
 });
});
