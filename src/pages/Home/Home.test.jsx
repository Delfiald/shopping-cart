import { render, screen } from "@testing-library/react";
import Home from "./Home";
import { MemoryRouter, Outlet, Route, Routes } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import Cart from "../Cart/Cart";
import PropTypes from "prop-types";
import Shop from "../Shop/Shop";

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

const mockCategories = ["category-1", "category-2", "category-3", "category-4"];

const MockRouter = () => {
 return (
  <MemoryRouter initialEntries={["/"]}>
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
     <Route index element={<Home />} />
     <Route path="cart" element={<Cart />} />
     <Route path="shop" element={<Shop />} />
    </Route>
   </Routes>
  </MemoryRouter>
 );
};

MockRouter.propTypes = {
 context: PropTypes.object,
};

describe("Home Page Test", () => {
 it("Renders Home Page", async () => {
  const { container } = render(<MockRouter />);
  expect(container).toMatchSnapshot();
 });

 it("Should Render Call to Action Section", async () => {
  const event = userEvent.setup();
  render(<MockRouter />);

  const ctaButton = screen.getByRole("button", { name: "Shop Now" });
  expect(ctaButton).toBeInTheDocument();

  await event.click(ctaButton);

  const shopMainHeading = screen.getByText("All Products");
  expect(shopMainHeading).toBeInTheDocument();
 });
});
