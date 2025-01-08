import { render, screen } from "@testing-library/react";
import Home from "./Home";
import { MemoryRouter, Outlet, Route, Routes } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import Cart from "../Cart/Cart";
import { useState } from "react";
import PropTypes from "prop-types";

const MockRouter = ({
 context = {
  cartItem: [],
  notificationItem: [],
  hoverButton: null,
  setHoverButton: () => {},
  searchInput: "",
  setSearchInput: () => {},
 },
}) => {
 return (
  <MemoryRouter initialEntries={["/"]}>
   <Routes>
    <Route path="/" element={<Outlet context={context} />}>
     <Route index element={<Home />} />
     <Route path="cart" element={<Cart />} />
    </Route>
   </Routes>
  </MemoryRouter>
 );
};

function HoverButtonTest({ cartItem, notificationItem }) {
 const [hoverButton, setHoverButton] = useState(null);

 return (
  <MockRouter
   context={{ hoverButton, setHoverButton, cartItem, notificationItem }}
  />
 );
}

function SearchInputTest() {
 const [searchInput, setSearchInput] = useState("");

 return (
  <MockRouter
   context={{ searchInput: searchInput, setSearchInput: setSearchInput }}
  />
 );
}

MockRouter.propTypes = {
 context: PropTypes.object,
};

HoverButtonTest.propTypes = {
 cartItem: PropTypes.array,
 notificationItem: PropTypes.array,
};

const mockCartItem = [
 { id: 1, description: "item1" },
 { id: 2, description: "item2" },
 { id: 3, description: "item3" },
];
const mockNotificationItem = [
 { id: 1, description: "message1" },
 { id: 2, description: "message2" },
];

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
  render(<MockRouter context={{ cartItem: [] }} />);

  const itemCounter = screen.queryByTestId("item-count");
  expect(itemCounter).not.toBeInTheDocument();
 });

 it("Render Item Counter in Cart", () => {
  render(<MockRouter context={{ cartItem: mockCartItem }} />);

  const itemCounter = screen.getByTestId("item-count");
  expect(itemCounter).toBeInTheDocument();
  expect(itemCounter).toHaveTextContent(mockCartItem.length);
 });

 it("Open Cart when Hovered and Close it when not", async () => {
  const event = userEvent.setup();

  render(<HoverButtonTest cartItem={mockCartItem} />);

  const shoppingCartButton = screen.getByTestId("cart-button");

  await event.hover(shoppingCartButton);
  const cartItems = screen.getAllByText(/item/i);
  expect(cartItems).toHaveLength(mockCartItem.length);

  await event.unhover(shoppingCartButton);
  expect(screen.queryAllByText(/item/i)).toHaveLength(0);
 });

 it("Render Notifications Button", () => {
  render(<MockRouter />);

  const notificationButton = screen.getByTestId("notification-button");
  expect(notificationButton).toBeInTheDocument();
 });

 it(`Doesn't render notification Counter`, () => {
  render(<MockRouter context={{ notificationItem: [] }} />);

  const notificationCounter = screen.queryByTestId("notification-counter");
  expect(notificationCounter).not.toBeInTheDocument();
 });

 it("Render Notification Counter", () => {
  render(<MockRouter context={{ notificationItem: mockNotificationItem }} />);

  const notificationCounter = screen.getByTestId("notification-count");
  expect(notificationCounter).toBeInTheDocument();
  expect(notificationCounter).toHaveTextContent(mockNotificationItem.length);
 });

 it("Open notifications when hover and close it when not", async () => {
  const event = userEvent.setup();

  render(<HoverButtonTest notificationItem={mockNotificationItem} />);

  const notificationButton = screen.getByTestId("notification-button");

  await event.hover(notificationButton);
  const notificationItem = screen.getAllByText(/message/i);
  expect(notificationItem).toHaveLength(mockNotificationItem.length);
  await event.unhover(notificationButton);

  expect(screen.queryAllByText(/message/i)).toHaveLength(0);
 });

 it("Change Input Value for Search Box", async () => {
  const event = userEvent.setup();

  render(<SearchInputTest />);

  const searchInput = screen.getByRole("textbox");

  await event.type(searchInput, "Hello World");
  expect(searchInput).toHaveValue("Hello World");
 });
});
