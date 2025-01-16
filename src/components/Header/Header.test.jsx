import { render, screen } from "@testing-library/react";
import Header from "./Header";
import { MemoryRouter, useNavigate } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import { useState } from "react";

const MockHeader = () => {
 return (
  <MemoryRouter>
   <Header
    cartItem={[]}
    notificationItem={[]}
    hoverButton={null}
    setHoverButton={() => vi.fn()}
    searchInput={""}
    setSearchInput={() => vi.fn()}
   />
  </MemoryRouter>
 );
};

vi.mock("react-router-dom", async () => {
 const actual = await vi.importActual("react-router-dom");
 return {
  ...actual,
  useNavigate: vi.fn(),
 };
});

function HoverCartButtonTest() {
 const [hoverButton, setHoverButton] = useState(null);

 return (
  <MemoryRouter>
   <Header
    cartItem={mockCartItem}
    hoverButton={hoverButton}
    setHoverButton={setHoverButton}
   />
  </MemoryRouter>
 );
}

function HoverNotificationButtonTest() {
 const [hoverButton, setHoverButton] = useState(null);

 return (
  <MemoryRouter>
   <Header
    notificationItem={mockNotificationItem}
    hoverButton={hoverButton}
    setHoverButton={setHoverButton}
   />
  </MemoryRouter>
 );
}

function SearchInputTest() {
 const [searchInput, setSearchInput] = useState("");

 return (
  <MemoryRouter>
   <Header searchInput={searchInput} setSearchInput={setSearchInput} />
  </MemoryRouter>
 );
}

const mockCartItem = [
 { id: 1, description: "item1" },
 { id: 2, description: "item2" },
 { id: 3, description: "item3" },
];

const mockNotificationItem = [
 { id: 1, description: "message1" },
 { id: 2, description: "message2" },
];

describe("Test Header", () => {
 const mockNavigate = vi.fn();

 beforeEach(() => {
  vi.resetAllMocks();
  useNavigate.mockImplementation(() => mockNavigate);
 });

 it("Should Render Header", () => {
  render(<MockHeader />);

  const headerText = screen.getByRole("heading", { name: "Shoppers" });
  expect(headerText).toBeInTheDocument();
 });

 it("Renders search bar", () => {
  render(<MockHeader />);

  const searchLabel = screen.getByTitle("Search Icon");
  expect(searchLabel).toBeInTheDocument();
  const search = screen.getByRole("textbox");
  expect(search).toBeInTheDocument();
 });

 it("Renders Cart Button", () => {
  render(<MockHeader />);

  const shoppingCart = screen.getByTestId("cart-button");
  expect(shoppingCart).toBeInTheDocument();

  const cartIcon = screen.getByTitle("Cart Button");
  expect(cartIcon).toBeInTheDocument();
 });

 it("Cart Button Routes to Cart Page when Clicked", async () => {
  const user = userEvent.setup();
  render(<MockHeader />);

  const shoppingCartButton = screen.getByTestId("cart-button");

  await user.click(shoppingCartButton);

  expect(mockNavigate).toHaveBeenCalledWith("/cart");
  expect(mockNavigate).toHaveBeenCalledOnce();
 });

 it(`Doesn't Render Item Counter in Cart`, () => {
  render(
   <MemoryRouter>
    <Header cartItem={[]} />
   </MemoryRouter>
  );

  const itemCounter = screen.queryByTestId("item-count");
  expect(itemCounter).not.toBeInTheDocument();
 });

 it("Render Item Counter in Cart", () => {
  render(
   <MemoryRouter>
    <Header cartItem={mockCartItem} />
   </MemoryRouter>
  );

  const itemCounter = screen.getByTestId("item-count");
  expect(itemCounter).toBeInTheDocument();
  expect(itemCounter).toHaveTextContent(mockCartItem.length);
 });

 it("Open Cart when Hovered and Close it when not", async () => {
  const event = userEvent.setup();

  render(<HoverCartButtonTest />);

  const shoppingCartButton = screen.getByTestId("cart-button");

  await event.hover(shoppingCartButton);
  const cartItems = screen.getAllByText(/item/i);
  expect(cartItems).toHaveLength(mockCartItem.length);

  await event.unhover(shoppingCartButton);
  expect(screen.queryAllByText(/item/i)).toHaveLength(0);
 });

 it("Render Notifications Button", () => {
  render(<MockHeader />);

  const notificationButton = screen.getByTestId("notification-button");
  expect(notificationButton).toBeInTheDocument();
 });

 it(`Doesn't render notification Counter`, () => {
  render(
   <MemoryRouter>
    <Header notificationItem={[]} />
   </MemoryRouter>
  );

  const notificationCounter = screen.queryByTestId("notification-count");
  expect(notificationCounter).not.toBeInTheDocument();
 });

 it("Render Notification Counter", () => {
  render(
   <MemoryRouter>
    <Header notificationItem={mockNotificationItem} />
   </MemoryRouter>
  );

  const notificationCounter = screen.getByTestId("notification-count");
  expect(notificationCounter).toBeInTheDocument();
  expect(notificationCounter).toHaveTextContent(mockNotificationItem.length);
 });

 it("Open notifications when hover and close it when not", async () => {
  const event = userEvent.setup();

  render(
   <HoverNotificationButtonTest notificationItem={mockNotificationItem} />
  );

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
