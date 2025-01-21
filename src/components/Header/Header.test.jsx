import { act, render, screen } from "@testing-library/react";
import Header from "./Header";
import { MemoryRouter, Outlet, Route, Routes } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { expect, it } from "vitest";
import Product from "../../pages/Product/Product";
import Home from "../../pages/Home/Home";
import Cart from "../../pages/Cart/Cart";
import Wishlist from "../../pages/Wishlist/Wishlist";
import Notification from "../../pages/Notification/Notification";

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

const generateMockNotification = (num) => {
 const mockNotification = [];

 for (let i = 1; i <= num; i++) {
  mockNotification.push({
   id: i,
   message: `Purchase complete - Order ${i}`,
   products: [],
   timeStamp: new Date().toLocaleString(),
   isRead: false,
  });
 }
 return mockNotification;
};

const MockNavigate = () => {
 const [hoverButton, setHoverButton] = useState(null);
 const [searchInput, setSearchInput] = useState("");

 return (
  <MemoryRouter initialEntries={["/"]}>
   <Header
    products={generateMockProducts(3)}
    cartItem={mockCartItem}
    notificationItem={mockNotificationItem}
    wishlistItem={mockWishlistItem}
    hoverButton={hoverButton}
    setHoverButton={setHoverButton}
    searchInput={searchInput}
    setSearchInput={setSearchInput}
   />
   <Routes>
    <Route
     path="/"
     element={
      <Outlet
       context={{
        products: generateMockProducts(3),
        wishlistItem: [...mockWishlistItem],
        hoverButton,
        setHoverButton,
        cartItem: mockCartItem,
       }}
      />
     }
    >
     <Route index element={<Home />} />
     <Route path="/cart" element={<Cart />} />
     <Route path="/product/:id" element={<Product />} />
     <Route path="/wishlist" element={<Wishlist />} />
    </Route>
   </Routes>
  </MemoryRouter>
 );
};

const MockHeader = () => {
 return (
  <MemoryRouter>
   <Header
    products={[]}
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

function HoverCartButtonTest() {
 const [hoverButton, setHoverButton] = useState(null);

 return (
  <MemoryRouter>
   <Header
    products={generateMockProducts(4)}
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
    products={generateMockProducts(4)}
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
   <Header
    products={[]}
    searchInput={searchInput}
    setSearchInput={setSearchInput}
   />
  </MemoryRouter>
 );
}

const mockCartItem = [
 { id: 1, amount: 1 },
 { id: 2, amount: 2 },
 { id: 3, amount: 3 },
];

const mockNotificationItem = [
 { id: 1, message: "message1", timeStamp: "20/01/2025 15:45", isRead: false },
 { id: 2, message: "message2", timeStamp: "22/01/2025 12:45", isRead: false },
];

const mockWishlistItem = [{ id: 1 }, { id: 2 }];

describe("Test Header", () => {
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
  render(<MockNavigate />);

  const shoppingCartButton = screen.getByTestId("cart-button");

  await user.click(shoppingCartButton);

  expect(screen.getByRole("heading", { name: "Cart" })).toBeInTheDocument();
 });

 it(`Doesn't Render Item Counter in Cart`, () => {
  render(
   <MemoryRouter>
    <Header products={[]} cartItem={[]} />
   </MemoryRouter>
  );

  const itemCounter = screen.queryByTestId("item-count");
  expect(itemCounter).not.toBeInTheDocument();
 });

 it("Render Item Counter in Cart", () => {
  render(
   <MemoryRouter>
    <Header products={[]} cartItem={mockCartItem} />
   </MemoryRouter>
  );

  const itemCounter = screen.getByTestId("item-count");
  expect(itemCounter).toBeInTheDocument();
  expect(itemCounter).toHaveTextContent(6);
 });

 it("Open Cart when Hovered and Close it when not", async () => {
  const event = userEvent.setup();

  render(<HoverCartButtonTest />);

  const shoppingCartButton = screen.getByTestId("cart-button");

  await event.hover(shoppingCartButton);
  const cartItems = screen.getAllByText(/product/i);
  expect(cartItems).toHaveLength(mockCartItem.length);

  await event.unhover(shoppingCartButton);
  expect(screen.queryAllByText(/product/i)).toHaveLength(0);
 });

 it("Render Notifications Button", () => {
  render(<MockHeader />);

  const notificationButton = screen.getByTestId("notification-button");
  expect(notificationButton).toBeInTheDocument();
 });

 it(`Doesn't render notification Counter`, () => {
  render(
   <MemoryRouter>
    <Header products={[]} notificationItem={[]} />
   </MemoryRouter>
  );

  const notificationCounter = screen.queryByTestId("notification-count");
  expect(notificationCounter).not.toBeInTheDocument();
 });

 it("Render Notification Counter", () => {
  render(
   <MemoryRouter>
    <Header products={[]} notificationItem={mockNotificationItem} />
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

 it("Should Navigate to Cart Page When Click See All Button when Hover on Cart Button", async () => {
  const user = userEvent.setup();

  render(<MockNavigate />);

  const cartButtonWrapper = screen.getByTestId("cart-button-wrapper");
  await user.hover(cartButtonWrapper);

  const seeAllButton = screen.getByRole("button", { name: "See All" });
  expect(seeAllButton).toBeInTheDocument();
  const productOne = screen.getByTestId("product-1");
  expect(productOne).toBeInTheDocument();

  await act(async () => {
   await user.hover(cartButtonWrapper);
   await user.click(seeAllButton);
   await user.unhover(cartButtonWrapper);
  });

  expect(screen.getByRole("heading", { name: "Cart" })).toBeInTheDocument();
 });

 it("Should Navigate to Product Page when Click Product on Cart Button when Hovered", async () => {
  const user = userEvent.setup();

  render(<MockNavigate />);

  const cartButtonWrapper = screen.getByTestId("cart-button-wrapper");
  await user.hover(cartButtonWrapper);

  const productOne = screen.getByTestId("product-1");
  expect(productOne).toBeInTheDocument();

  await act(async () => {
   await user.click(productOne);
   await user.unhover(cartButtonWrapper);
  });

  expect(screen.getByTestId("display-image")).toBeInTheDocument();
 });

 it("Should Navigate to Wishlist Page when Click Wishlist Icon", async () => {
  const user = userEvent.setup();

  render(<MockNavigate />);

  const wishlistButton = screen.getByTestId("wishlist-button");
  await user.click(wishlistButton);

  expect(screen.getByRole("heading", { name: "Wishlist" })).toBeInTheDocument();
 });

 it("Should Navigate to Wishlist Page When Click See All Button when Hover on Wishlist Button", async () => {
  const user = userEvent.setup();

  render(<MockNavigate />);

  const wishlistButtonWrapper = screen.getByTestId("wishlist-button-wrapper");
  await user.hover(wishlistButtonWrapper);

  const seeAllButton = screen.getByRole("button", { name: "See All" });
  expect(seeAllButton).toBeInTheDocument();
  const productOne = screen.getByTestId("product-1");
  expect(productOne).toBeInTheDocument();

  await act(async () => {
   await user.hover(wishlistButtonWrapper);
   await user.click(seeAllButton);
   await user.unhover(wishlistButtonWrapper);
  });

  expect(screen.getByRole("heading", { name: "Wishlist" })).toBeInTheDocument();
 });

 it("Should Navigate to Wishlist Page when Click on Wishlist Button", async () => {
  const user = userEvent.setup();

  render(<MockNavigate />);

  const wishlistButtonWrapper = screen.getByTestId("wishlist-button-wrapper");
  await user.hover(wishlistButtonWrapper);

  const productOne = screen.getByTestId("product-1");
  expect(productOne).toBeInTheDocument();

  await act(async () => {
   await user.click(productOne);
   await user.unhover(wishlistButtonWrapper);
  });

  expect(screen.getByTestId("display-image")).toBeInTheDocument();
 });

 it("Should Route to Notification Page when clicked notification Button", async () => {
  const user = userEvent.setup();

  const MockRoute = () => {
   const [hoverButton, setHoverButton] = useState(null);
   const [searchInput, setSearchInput] = useState("");
   const [notificationItem, setNotificationItem] = useState(
    generateMockNotification(3)
   );

   return (
    <MemoryRouter initialEntries={["/"]}>
     <Header
      products={generateMockProducts(3)}
      cartItem={mockCartItem}
      notificationItem={notificationItem}
      setNotificationItem={setNotificationItem}
      wishlistItem={mockWishlistItem}
      hoverButton={hoverButton}
      setHoverButton={setHoverButton}
      searchInput={searchInput}
      setSearchInput={setSearchInput}
     />
     <Routes>
      <Route
       path="/"
       element={
        <Outlet
         context={{
          products: generateMockProducts(3),
          wishlistItem: [...mockWishlistItem],
          hoverButton,
          setHoverButton,
          cartItem: mockCartItem,
         }}
        />
       }
      >
       <Route index element={<Home />} />
       <Route path="/notification" element={<Notification />} />
      </Route>
     </Routes>
    </MemoryRouter>
   );
  };

  render(<MockRoute />);

  const notificationButton = screen.getByTestId("notification-button");
  expect(notificationButton).toBeInTheDocument();

  await user.click(notificationButton);

  expect(
   screen.getByRole("heading", { name: "Notifications" })
  ).toBeInTheDocument();
 });

 it("Should marks notification read when hover on notification item", async () => {
  const user = userEvent.setup();

  const MockRoute = () => {
   const [hoverButton, setHoverButton] = useState(null);
   const [searchInput, setSearchInput] = useState("");
   const [notificationItem, setNotificationItem] = useState(
    generateMockNotification(3)
   );

   return (
    <MemoryRouter initialEntries={["/"]}>
     <Header
      products={generateMockProducts(3)}
      cartItem={mockCartItem}
      notificationItem={notificationItem}
      setNotificationItem={setNotificationItem}
      wishlistItem={mockWishlistItem}
      hoverButton={hoverButton}
      setHoverButton={setHoverButton}
      searchInput={searchInput}
      setSearchInput={setSearchInput}
     />
     <Routes>
      <Route
       path="/"
       element={
        <Outlet
         context={{
          products: generateMockProducts(3),
          wishlistItem: [...mockWishlistItem],
          hoverButton,
          setHoverButton,
          cartItem: mockCartItem,
         }}
        />
       }
      >
       <Route index element={<Home />} />
       <Route path="/notification" element={<Notification />} />
      </Route>
     </Routes>
    </MemoryRouter>
   );
  };

  render(<MockRoute />);

  const notificationButtonWrapper = screen.getByTestId(
   "notification-button-wrapper"
  );
  expect(notificationButtonWrapper).toBeInTheDocument();

  await user.hover(notificationButtonWrapper);

  const notificationItemOne = screen.getByTestId("notification-item-1");
  expect(notificationItemOne).toBeInTheDocument();
  expect(notificationItemOne).toHaveClass("notification-item unread");

  await act(async () => {
   await user.hover(notificationButtonWrapper);
   await user.hover(notificationItemOne);
  });

  expect(notificationItemOne).toHaveClass("notification-item read");
 });

 it("Should Clear notification when click clear button", async () => {
  const user = userEvent.setup();

  const MockRoute = () => {
   const [hoverButton, setHoverButton] = useState(null);
   const [searchInput, setSearchInput] = useState("");
   const [notificationItem, setNotificationItem] = useState(
    generateMockNotification(3)
   );

   return (
    <MemoryRouter initialEntries={["/"]}>
     <Header
      products={generateMockProducts(3)}
      cartItem={mockCartItem}
      notificationItem={notificationItem}
      setNotificationItem={setNotificationItem}
      wishlistItem={mockWishlistItem}
      hoverButton={hoverButton}
      setHoverButton={setHoverButton}
      searchInput={searchInput}
      setSearchInput={setSearchInput}
     />
     <Routes>
      <Route
       path="/"
       element={
        <Outlet
         context={{
          products: generateMockProducts(3),
          wishlistItem: [...mockWishlistItem],
          hoverButton,
          setHoverButton,
          cartItem: mockCartItem,
         }}
        />
       }
      >
       <Route index element={<Home />} />
       <Route path="/notification" element={<Notification />} />
      </Route>
     </Routes>
    </MemoryRouter>
   );
  };

  render(<MockRoute />);

  const notificationButtonWrapper = screen.getByTestId(
   "notification-button-wrapper"
  );
  await user.hover(notificationButtonWrapper);

  const notificationItemOne = screen.getByTestId("notification-item-1");
  expect(notificationItemOne).toBeInTheDocument();
  const clearButton = screen.getByTestId("clear-notification-button");
  expect(clearButton).toBeInTheDocument();

  await act(async () => {
   await user.hover(notificationButtonWrapper);
   await user.click(clearButton);
  });

  expect(screen.queryByTestId("notification-item-1")).not.toBeInTheDocument();
 });

 it("Should Navigate to Notification Page when click see all button", async () => {
  const user = userEvent.setup();

  const MockRoute = () => {
   const [hoverButton, setHoverButton] = useState(null);
   const [searchInput, setSearchInput] = useState("");
   const [notificationItem, setNotificationItem] = useState(
    generateMockNotification(3)
   );

   return (
    <MemoryRouter initialEntries={["/"]}>
     <Header
      products={generateMockProducts(3)}
      cartItem={mockCartItem}
      notificationItem={notificationItem}
      setNotificationItem={setNotificationItem}
      wishlistItem={mockWishlistItem}
      hoverButton={hoverButton}
      setHoverButton={setHoverButton}
      searchInput={searchInput}
      setSearchInput={setSearchInput}
     />
     <Routes>
      <Route
       path="/"
       element={
        <Outlet
         context={{
          products: generateMockProducts(3),
          wishlistItem: [...mockWishlistItem],
          hoverButton,
          setHoverButton,
          cartItem: mockCartItem,
         }}
        />
       }
      >
       <Route index element={<Home />} />
       <Route path="/notification" element={<Notification />} />
      </Route>
     </Routes>
    </MemoryRouter>
   );
  };

  render(<MockRoute />);

  const notificationButtonWrapper = screen.getByTestId(
   "notification-button-wrapper"
  );
  await user.hover(notificationButtonWrapper);

  const notificationItemOne = screen.getByTestId("notification-item-1");
  expect(notificationItemOne).toBeInTheDocument();
  const seeAllButton = screen.getByRole("button", { name: "See All" });
  expect(seeAllButton).toBeInTheDocument();

  await act(async () => {
   await user.hover(notificationButtonWrapper);
   await user.click(seeAllButton);
  });

  expect(
   screen.getByRole("heading", { name: "Notifications" })
  ).toBeInTheDocument();
 });
});
