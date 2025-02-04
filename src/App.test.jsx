import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import Cart from "./pages/Cart/Cart";
import Shop from "./pages/Shop/Shop";
import App from "./App";
import Product from "./pages/Product/Product";
import Home from "./pages/Home/Home";
import PropTypes from "prop-types";
import ErrorPage from "./router/ErrorPage";
import userEvent from "@testing-library/user-event";
import { beforeAll, expect } from "vitest";

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
 beforeAll(() => {
  globalThis.window.scrollTo = vi.fn();
 });
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

 it("Return to Home when click return button on ErrorPage when path not found", async () => {
  const user = userEvent.setup();
  render(<MockRouter initialPath={"/err"} />);

  const errorPage = screen.getByText("Path Not Found 404");
  expect(errorPage).toBeInTheDocument();

  const returnButton = screen.getByTestId("return-button");
  expect(returnButton).toBeInTheDocument();

  await user.click(returnButton);

  expect(screen.getAllByText("Shoppers")[0]).toBeInTheDocument();
 });

 it("Should Routes to Cart Page when Click Cart Button on Header", async () => {
  const user = userEvent.setup();
  render(<MockRouter />);

  const shoppingCartButton = screen.getByTestId("cart-button");
  await user.click(shoppingCartButton);

  await waitFor(() => {
   const cartHeading = screen.getByText("Cart");
   expect(cartHeading).toBeInTheDocument();
  });

  const cartMain = screen.getByRole("heading", { name: "Cart" });
  expect(cartMain).toBeInTheDocument();
 });

 it("Should Routes to Shop Page when Click CTA Button on Home Main", async () => {
  const user = userEvent.setup();
  render(<MockRouter />);

  const ctaButton = screen.getByTestId("cta-button");
  await user.click(ctaButton);

  await waitFor(() => {
   const shopHeading = screen.getByText("All Products");

   expect(shopHeading).toBeInTheDocument();
  });
 });
});
