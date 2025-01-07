import { render, screen } from "@testing-library/react";
import Home from "./Home";
import { MemoryRouter, Outlet, Route, Routes } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import Cart from "../Cart/Cart";
import App from "../../App";
import { useState } from "react";

const MockRouter = () => {
 return (
  <MemoryRouter initialEntries={["/"]}>
   <Routes>
    <Route path="/" element={<App />}>
     <Route index element={<Home />} />
     <Route path="cart" element={<Cart />} />
    </Route>
   </Routes>
  </MemoryRouter>
 );
};

function CartButtonMock() {
 const [cartOpen, setCartOpen] = useState(false);

 return (
  <MemoryRouter initialEntries={["/"]}>
   <Routes>
    <Route path="/" element={<Outlet context={{ cartOpen, setCartOpen }} />}>
     <Route index element={<Home />} />
     <Route path="cart" element={<Cart />} />
    </Route>
   </Routes>
  </MemoryRouter>
 );
}

describe("Home Page Test", () => {
 it("Renders Home Page", async () => {
  const { container } = render(<MockRouter />);
  expect(container).toMatchSnapshot();
 });

 it("Renders Header from Home Page", () => {
  render(<MockRouter />);

  const header = screen.getByRole("heading", { name: /shoppers/i });
  expect(header).toBeInTheDocument();
 });

 it("Renders search bar from Home Page", () => {
  render(<MockRouter />);

  const searchLabel = screen.getByTitle("Search Icon");
  expect(searchLabel).toBeInTheDocument();
  const search = screen.getByRole("textbox");
  expect(search).toBeInTheDocument();
 });

 it("Renders Cart Button", () => {
  render(<MockRouter />);

  const shoppingCart = screen.getByTestId("cart-button");
  expect(shoppingCart).toBeInTheDocument();

  const cartIcon = screen.getByTitle("Cart Button");
  expect(cartIcon).toBeInTheDocument();
 });

 it("Cart Button Routes to Cart Page when Clicked", async () => {
  const user = userEvent.setup();
  render(<MockRouter />);

  const shoppingCartButton = screen.getByTestId("cart-button");
  await user.click(shoppingCartButton);

  const cartHeading = screen.getByText(/cart/i);

  expect(cartHeading).toBeInTheDocument();
 });

 it(`Doesn't Render Item Counter in Cart`, () => {
  const cartItem = [];

  render(
   <MemoryRouter initialEntries={["/"]}>
    <Routes>
     <Route path="/" element={<Outlet context={{ cartItem }} />}>
      <Route index element={<Home />} />
      <Route path="cart" element={<Cart />} />
     </Route>
    </Routes>
   </MemoryRouter>
  );

  const itemCounter = screen.queryByTestId("item-count");
  expect(itemCounter).not.toBeInTheDocument();
 });

 it("Render Item Counter in Cart", () => {
  const cartItem = ["item1", "item2"];
  render(
   <MemoryRouter initialEntries={["/"]}>
    <Routes>
     <Route path="/" element={<Outlet context={{ cartItem }} />}>
      <Route index element={<Home />} />
      <Route path="cart" element={<Cart />} />
     </Route>
    </Routes>
   </MemoryRouter>
  );

  const itemCounter = screen.getByTestId("item-count");
  expect(itemCounter).toBeInTheDocument();
  expect(itemCounter).toHaveTextContent(2);
 });

 it("Open Cart when Hovered and Close it when not", async () => {
  const event = userEvent.setup();

  render(<CartButtonMock />);

  const shoppingCartButton = screen.getByTestId("cart-button");

  await event.hover(shoppingCartButton);
  const cartItems = screen.getAllByText(/item/i);
  expect(cartItems).toHaveLength(3);

  await event.unhover(shoppingCartButton);
  expect(screen.queryAllByText(/item/i)).toHaveLength(0);
 });
});
