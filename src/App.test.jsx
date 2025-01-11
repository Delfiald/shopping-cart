import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import Cart from "./pages/Cart/Cart";
import Shop from "./pages/Shop/Shop";
import App from "./App";
import Product from "./pages/Product/Product";
import Home from "./pages/Home/Home";
import PropTypes from "prop-types";
import ErrorPage from "./router/ErrorPage";
import userEvent from "@testing-library/user-event";

const MockRouter = ({ initialPath = "/" }) => {
 return (
  <MemoryRouter initialEntries={[initialPath]}>
   <Routes>
    <Route path="/" element={<App />}>
     <Route index element={<Home />} />
     <Route path="cart" element={<Cart />} />
     <Route path="shop" element={<Shop />} />
     <Route path="product/:id" element={<Product />} />
    </Route>
    <Route path="*" element={<ErrorPage />} />
   </Routes>
  </MemoryRouter>
 );
};

MockRouter.propTypes = {
 initialPath: PropTypes.string,
};

describe("It Render App", () => {
 it("render app", () => {
  const { container } = render(<MockRouter />);
  expect(container).toMatchSnapshot();
 });

 it("Renders Header, Footer, and Home page correctly", () => {
  render(<MockRouter />);

  const header = screen.getByRole("heading", { name: /shoppers/i });
  expect(header).toBeInTheDocument();

  const copyrightText = screen.getByText(/mag 2025/i);
  expect(copyrightText).toBeInTheDocument();

  const categoriesHeader = screen.getByRole("heading", { name: "Categories" });
  expect(categoriesHeader).toBeInTheDocument();
 });

 it("Render ErrorPage when path not found", () => {
  render(<MockRouter initialPath={"/err"} />);

  const errorPage = screen.getByText("Path Not Found 404");
  expect(errorPage).toBeInTheDocument();
 });

 it("Should Routes to Cart Page when Click Cart Button on Header", async () => {
  const user = userEvent.setup();
  render(<MockRouter />);

  const shoppingCartButton = screen.getByTestId("cart-button");
  await user.click(shoppingCartButton);

  const cartHeading = screen.getByText("Cart");

  expect(cartHeading).toBeInTheDocument();

  const cartMain = screen.getByText("Cart Main");
  expect(cartMain).toBeInTheDocument();
 });

 it("Should Routes to Shop Page when Click CTA Button on Home Main", async () => {
  const user = userEvent.setup();
  render(<MockRouter />);

  const ctaButton = screen.getByRole("button", { name: "Shop Now" });
  await user.click(ctaButton);

  const shopHeading = screen.getByText("All Products");

  expect(shopHeading).toBeInTheDocument();
 });
});
