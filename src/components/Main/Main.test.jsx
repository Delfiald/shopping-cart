import { act, render, screen } from "@testing-library/react";
import HomeMain from "./HomeMain";
import { MemoryRouter, Outlet, Route, Routes } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import ShopMain from "./ShopMain";
import Shop from "../../pages/Shop/Shop";
import Product from "../../pages/Product/Product";
import { useState } from "react";
import PropTypes from "prop-types";
import Home from "../../pages/Home/Home";
import ProductMain from "./ProductMain";
import CartMain from "./CartMain";
import Cart from "../../pages/Cart/Cart";
import WishlistMain from "./WishlistMain";
import Wishlist from "../../pages/Wishlist/Wishlist";
import Header from "../Header/Header";
import NotificationMain from "./NotificationMain";

import styles from "./main.module.css";

const mockCategories = ["category-1", "category-2", "category-3", "category-4"];

const mockProducts = [
 {
  id: 1,
  title: "product-1",
  image: "/image/product-1.png",
  price: 100,
  category: "category-1",
 },
 {
  id: 2,
  title: "product-2",
  image: "/image/product-2.png",
  price: 135,
  category: "category-2",
 },
 {
  id: 3,
  title: "product-3",
  image: "/image/product-3.png",
  price: 120,
  category: "category-3",
 },
 {
  id: 4,
  title: "product-4",
  image: "/image/product-4.png",
  price: 90,
  category: "category-4",
 },
];

describe("Test Main component of Home", () => {
 it("Should Render Categories Section", () => {
  render(
   <MemoryRouter>
    <HomeMain categories={mockCategories} products={mockProducts} />
   </MemoryRouter>
  );

  const categoriesContainer = screen.getByTestId("categories-section");
  const categoriesHeader = screen.getByRole("heading", { name: "Categories" });

  expect(categoriesContainer.children).toHaveLength(5);
  expect(categoriesHeader).toBeInTheDocument();

  mockCategories.forEach((category) => {
   expect(screen.queryByText(category)).toBeInTheDocument();
   expect(screen.queryByAltText(category)).toBeInTheDocument();
  });
 });

 it(`Shouldn't Render categories list when theres no category`, () => {
  render(
   <MemoryRouter>
    <HomeMain categories={[]} products={mockProducts} />
   </MemoryRouter>
  );

  const categoriesContainer = screen.getByTestId("categories-section");
  expect(categoriesContainer.children).toHaveLength(1);

  mockCategories.forEach((category) => {
   expect(screen.queryByText(category)).not.toBeInTheDocument();
  });
 });

 it("Should Render Carousel", () => {
  render(
   <MemoryRouter>
    <HomeMain categories={mockCategories} products={mockProducts} />
   </MemoryRouter>
  );

  const carousel = screen.getByTestId("products-carousel-section");
  expect(carousel.children).toHaveLength(2);

  for (let i = 0; i < 3; i++) {
   const imgElement = screen.getByTitle(mockProducts[0].title);
   expect(imgElement).toBeInTheDocument();
   expect(imgElement).toHaveAttribute("src", mockProducts[0].image);
  }
 });

 it("Should not render carousel", () => {
  render(
   <MemoryRouter>
    <HomeMain categories={mockCategories} products={[]} />
   </MemoryRouter>
  );

  const carousel = screen.getByTestId("products-carousel-section");
  expect(carousel.children).toHaveLength(0);

  mockProducts.forEach((product) => {
   expect(
    screen.queryByRole("heading", { name: product.title })
   ).not.toBeInTheDocument();
  });
 });

 it("Should Render Call to Action Section", async () => {
  render(
   <MemoryRouter initialEntries={["/"]}>
    <Routes>
     <Route
      path="/"
      element={
       <Outlet
        context={{
         products: mockProducts,
         categories: mockCategories,
        }}
       />
      }
     >
      <Route index element={<Home />} />
      <Route path="shop" element={<Shop />} />
     </Route>
    </Routes>
   </MemoryRouter>
  );

  const ctaButton = screen.getByRole("button", { name: "Shop Now" });
  expect(ctaButton).toBeInTheDocument();

  await userEvent.click(ctaButton);

  expect(screen.getByText("All Products")).toBeInTheDocument();
 });
});

const PaginationButtonTest = ({ newProduct }) => {
 const localProduct = newProduct ? [...newProduct] : [...mockProducts];

 return (
  <MemoryRouter initialEntries={["/shop"]}>
   <Routes>
    <Route
     path="/"
     element={
      <Outlet
       context={{
        products: localProduct,
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

const DropdownTest = () => {
 const [hoverButton, setHoverButton] = useState(null);
 const [itemPerPage, setItemPerPage] = useState(1);
 const [sort, setSort] = useState("name-asc");

 return (
  <MemoryRouter>
   <ShopMain
    products={mockProducts}
    page={1}
    itemPerPage={itemPerPage}
    setItemPerPage={setItemPerPage}
    sort={sort}
    setSort={setSort}
    hoverButton={hoverButton}
    setHoverButton={setHoverButton}
   />
  </MemoryRouter>
 );
};

PaginationButtonTest.propTypes = {
 newProduct: PropTypes.array,
};

const generateMockProducts = (num) => {
 const products = [];
 for (let i = 1; i <= num; i++) {
  products.push({
   id: i,
   title: `product-${i}`,
   image: `/image/product-${i}.png`,
   price: 100 + (i % 10) * 10,
   category: `category-${(i % 5) + 1}`,
   description: `lorem lorem lorem lorem lorem lorem`,
  });
 }
 return products;
};

describe("Test Main component of Shop", () => {
 it("Should Render Shop Main Product Card", () => {
  render(
   <MemoryRouter>
    <ShopMain
     products={mockProducts}
     page={1}
     setPage={() => vi.fn()}
     itemPerPage={1}
     setItemPerPage={() => vi.fn()}
    />
   </MemoryRouter>
  );

  expect(
   screen.getByRole("heading", { name: "All Products" })
  ).toBeInTheDocument();

  expect(screen.getByTestId("product-card").children).toHaveLength(1);

  expect(
   screen.getByTestId(`product-card-${mockProducts[0].id}`)
  ).toBeInTheDocument();
  expect(screen.getByAltText(mockProducts[0].title)).toBeInTheDocument();
  expect(screen.getByText(mockProducts[0].title)).toBeInTheDocument();
  expect(screen.getByText(mockProducts[0].price)).toBeInTheDocument();
 });

 it("Should Route to Product Page when clicked Product", async () => {
  const event = userEvent.setup();

  render(
   <MemoryRouter initialEntries={["/shop"]}>
    <Routes>
     <Route
      path="/"
      element={
       <Outlet
        context={{ products: mockProducts, categories: mockCategories }}
       />
      }
     >
      <Route path="/shop" element={<Shop />} />
      <Route path="/product/:id" element={<Product />} />
     </Route>
    </Routes>
   </MemoryRouter>
  );

  const productLink = screen.getByTestId("product-card-1");
  expect(productLink).toBeInTheDocument();
  await event.click(productLink);

  expect(
   screen.getByRole("heading", { name: "product-1" })
  ).toBeInTheDocument();
 });

 it("Should Render Product List Header", () => {
  render(
   <MemoryRouter>
    <ShopMain products={mockProducts} page={1} itemPerPage={10} />
   </MemoryRouter>
  );

  let productListHeader = screen.getByTestId("list-header");
  expect(productListHeader).toBeInTheDocument();
  expect(screen.getByText("Showing 1 - 4 products")).toBeInTheDocument();

  render(
   <MemoryRouter>
    <ShopMain products={mockProducts} page={2} itemPerPage={3} />
   </MemoryRouter>
  );

  expect(productListHeader).toBeInTheDocument();
  expect(screen.getByText("Showing 4 - 4 products")).toBeInTheDocument();
 });

 it("Should Render Pagination Arrow Buttons Based on Current Page", async () => {
  const event = userEvent.setup();

  render(<PaginationButtonTest newProduct={generateMockProducts(15)} />);

  let nextArrowButton = screen.queryByTestId("next-button");
  let prevArrowButton = screen.queryByTestId("prev-button");

  expect(prevArrowButton).not.toBeInTheDocument();
  expect(nextArrowButton).toBeInTheDocument();

  await event.click(nextArrowButton);

  prevArrowButton = screen.queryByTestId("prev-button");
  nextArrowButton = screen.queryByTestId("next-button");

  expect(prevArrowButton).toBeInTheDocument();
  expect(nextArrowButton).not.toBeInTheDocument();
 });

 it("Should Render Pagination Page Number Button Based on Current Page", async () => {
  const event = userEvent.setup();
  render(<PaginationButtonTest newProduct={generateMockProducts(50)} />);

  let firstPageButton = screen.queryByTestId("first-page-button");
  let dotsBefore = screen.queryByTestId("dots-before");
  let prevPrevPageButton = screen.queryByTestId("prev-prev-page-button");
  let prevPageButton = screen.queryByTestId("prev-page-button");
  let currentPageButton = screen.queryByTestId("current-page-button");
  let nextPageButton = screen.queryByTestId("next-page-button");
  let nextNextPageButton = screen.queryByTestId("next-next-page-button");
  let dotsAfter = screen.queryByTestId("dots-after");
  let lastPageButton = screen.queryByTestId("last-page-button");

  expect(currentPageButton).toBeInTheDocument();
  expect(firstPageButton).not.toBeInTheDocument();
  expect(dotsBefore).not.toBeInTheDocument();
  expect(prevPrevPageButton).not.toBeInTheDocument();
  expect(prevPageButton).not.toBeInTheDocument();
  expect(currentPageButton).toBeInTheDocument();
  expect(currentPageButton).toHaveTextContent("1");
  expect(nextPageButton).toBeInTheDocument();
  expect(nextPageButton).toHaveTextContent("2");
  expect(nextNextPageButton).toBeInTheDocument();
  expect(nextNextPageButton).toHaveTextContent("3");
  expect(dotsAfter).toBeInTheDocument();
  expect(lastPageButton).toBeInTheDocument();
  expect(lastPageButton).toHaveTextContent("5");

  // Click Next Page Button
  await event.click(nextPageButton);

  firstPageButton = screen.queryByTestId("first-page-button");
  dotsBefore = screen.queryByTestId("dots-before");
  prevPrevPageButton = screen.queryByTestId("prev-prev-page-button");
  prevPageButton = screen.queryByTestId("prev-page-button");
  currentPageButton = screen.queryByTestId("current-page-button");
  nextPageButton = screen.queryByTestId("next-page-button");
  nextNextPageButton = screen.queryByTestId("next-next-page-button");
  dotsAfter = screen.queryByTestId("dots-after");
  lastPageButton = screen.queryByTestId("last-page-button");

  expect(firstPageButton).toBeInTheDocument();
  expect(firstPageButton).toHaveTextContent("1");
  expect(dotsBefore).not.toBeInTheDocument();
  expect(prevPrevPageButton).not.toBeInTheDocument();
  expect(prevPageButton).not.toBeInTheDocument();
  expect(currentPageButton).toBeInTheDocument();
  expect(currentPageButton).toHaveTextContent("2");
  expect(nextPageButton).toBeInTheDocument();
  expect(nextPageButton).toHaveTextContent("3");
  expect(nextNextPageButton).not.toBeInTheDocument();
  expect(dotsAfter).toBeInTheDocument();
  expect(lastPageButton).toBeInTheDocument();
  expect(lastPageButton).toHaveTextContent("5");

  // Click Next Button
  await event.click(nextPageButton);

  firstPageButton = screen.queryByTestId("first-page-button");
  dotsBefore = screen.queryByTestId("dots-before");
  prevPrevPageButton = screen.queryByTestId("prev-prev-page-button");
  prevPageButton = screen.queryByTestId("prev-page-button");
  currentPageButton = screen.queryByTestId("current-page-button");
  nextPageButton = screen.queryByTestId("next-page-button");
  nextNextPageButton = screen.queryByTestId("next-next-page-button");
  dotsAfter = screen.queryByTestId("dots-after");
  lastPageButton = screen.queryByTestId("last-page-button");

  expect(firstPageButton).toBeInTheDocument();
  expect(firstPageButton).toHaveTextContent("1");
  expect(dotsBefore).not.toBeInTheDocument();
  expect(prevPrevPageButton).not.toBeInTheDocument();
  expect(prevPageButton).toBeInTheDocument();
  expect(currentPageButton).toBeInTheDocument();
  expect(currentPageButton).toHaveTextContent("3");
  expect(nextPageButton).toBeInTheDocument();
  expect(nextNextPageButton).not.toBeInTheDocument();
  expect(dotsAfter).not.toBeInTheDocument();
  expect(lastPageButton).toBeInTheDocument();
  expect(lastPageButton).toHaveTextContent("5");

  // Click Last Page Button
  await event.click(lastPageButton);

  firstPageButton = screen.queryByTestId("first-page-button");
  dotsBefore = screen.queryByTestId("dots-before");
  prevPrevPageButton = screen.queryByTestId("prev-prev-page-button");
  prevPageButton = screen.queryByTestId("prev-page-button");
  currentPageButton = screen.queryByTestId("current-page-button");
  nextPageButton = screen.queryByTestId("next-page-button");
  nextNextPageButton = screen.queryByTestId("next-next-page-button");
  dotsAfter = screen.queryByTestId("dots-after");
  lastPageButton = screen.queryByTestId("last-page-button");

  expect(firstPageButton).toBeInTheDocument();
  expect(firstPageButton).toHaveTextContent("1");
  expect(dotsBefore).toBeInTheDocument();
  expect(prevPrevPageButton).toBeInTheDocument();
  expect(prevPrevPageButton).toBeInTheDocument("2");
  expect(prevPageButton).toBeInTheDocument();
  expect(prevPageButton).toHaveTextContent("4");
  expect(currentPageButton).toBeInTheDocument();
  expect(currentPageButton).toHaveTextContent("5");
  expect(nextPageButton).not.toBeInTheDocument();
  expect(nextNextPageButton).not.toBeInTheDocument();
  expect(dotsAfter).not.toBeInTheDocument();
  expect(lastPageButton).not.toBeInTheDocument();
 });

 it("Should Render Dots on Pagination", async () => {
  const event = userEvent.setup();

  render(<PaginationButtonTest newProduct={generateMockProducts(50)} />);

  // Should Only Render Before Dots
  let lastPageButton = screen.queryByTestId("last-page-button");

  await event.click(lastPageButton);

  let firstPageButton = screen.queryByTestId("first-page-button");
  let dotsBefore = screen.queryByTestId("dots-before");
  let prevPrevPageButton = screen.queryByTestId("prev-prev-page-button");
  let prevPageButton = screen.queryByTestId("prev-page-button");
  let currentPageButton = screen.queryByTestId("current-page-button");
  let nextPageButton = screen.queryByTestId("next-page-button");
  let nextNextPageButton = screen.queryByTestId("next-next-page-button");
  let dotsAfter = screen.queryByTestId("dots-after");
  lastPageButton = screen.queryByTestId("last-page-button");

  expect(firstPageButton).toBeInTheDocument();
  expect(firstPageButton).toHaveTextContent("1");
  expect(dotsBefore).toBeInTheDocument();
  expect(prevPrevPageButton).toBeInTheDocument();
  expect(prevPrevPageButton).toBeInTheDocument("3");
  expect(prevPageButton).toBeInTheDocument();
  expect(prevPageButton).toHaveTextContent("4");
  expect(currentPageButton).toBeInTheDocument();
  expect(currentPageButton).toHaveTextContent("5");
  expect(nextPageButton).not.toBeInTheDocument();
  expect(nextNextPageButton).not.toBeInTheDocument();
  expect(dotsAfter).not.toBeInTheDocument();
  expect(lastPageButton).not.toBeInTheDocument();

  // Should Only Render After Dots
  await event.click(firstPageButton);

  firstPageButton = screen.queryByTestId("first-page-button");
  dotsBefore = screen.queryByTestId("dots-before");
  prevPrevPageButton = screen.queryByTestId("prev-prev-page-button");
  prevPageButton = screen.queryByTestId("prev-page-button");
  currentPageButton = screen.queryByTestId("current-page-button");
  nextPageButton = screen.queryByTestId("next-page-button");
  nextNextPageButton = screen.queryByTestId("next-next-page-button");
  dotsAfter = screen.queryByTestId("dots-after");
  lastPageButton = screen.queryByTestId("last-page-button");

  expect(firstPageButton).not.toBeInTheDocument();
  expect(dotsBefore).not.toBeInTheDocument();
  expect(prevPrevPageButton).not.toBeInTheDocument();
  expect(prevPageButton).not.toBeInTheDocument();
  expect(currentPageButton).toBeInTheDocument();
  expect(currentPageButton).toHaveTextContent("1");
  expect(nextPageButton).toBeInTheDocument();
  expect(nextPageButton).toHaveTextContent("2");
  expect(nextNextPageButton).toBeInTheDocument();
  expect(nextNextPageButton).toHaveTextContent("3");
  expect(dotsAfter).toBeInTheDocument();
  expect(lastPageButton).toBeInTheDocument();
  expect(lastPageButton).toHaveTextContent("5");

  // Should not render any dots
  await event.click(nextNextPageButton);

  firstPageButton = screen.queryByTestId("first-page-button");
  dotsBefore = screen.queryByTestId("dots-before");
  prevPrevPageButton = screen.queryByTestId("prev-prev-page-button");
  prevPageButton = screen.queryByTestId("prev-page-button");
  currentPageButton = screen.queryByTestId("current-page-button");
  nextPageButton = screen.queryByTestId("next-page-button");
  nextNextPageButton = screen.queryByTestId("next-next-page-button");
  dotsAfter = screen.queryByTestId("dots-after");
  lastPageButton = screen.queryByTestId("last-page-button");

  expect(firstPageButton).toBeInTheDocument();
  expect(firstPageButton).toHaveTextContent("1");
  expect(dotsBefore).not.toBeInTheDocument();
  expect(prevPrevPageButton).not.toBeInTheDocument();
  expect(prevPageButton).toBeInTheDocument();
  expect(prevPageButton).toHaveTextContent("2");
  expect(currentPageButton).toBeInTheDocument();
  expect(currentPageButton).toHaveTextContent("3");
  expect(nextPageButton).toBeInTheDocument();
  expect(nextPageButton).toHaveTextContent("4");
  expect(nextNextPageButton).not.toBeInTheDocument();
  expect(dotsAfter).not.toBeInTheDocument();
  expect(lastPageButton).toBeInTheDocument();
  expect(lastPageButton).toHaveTextContent("5");
 });

 it("Should Render Item Per Page Downdown and Change Value", async () => {
  const event = userEvent.setup();

  render(<DropdownTest />);

  const itemPerPageButton = screen.getByTestId("item-per-page");
  let itemPerPageValue = screen.getByTestId("item-per-page-value");

  expect(itemPerPageButton).toBeInTheDocument();
  expect(itemPerPageValue.children[0]).toHaveTextContent("1");
  expect(screen.getByTestId("product-card").children).toHaveLength(1);

  await event.hover(itemPerPageButton);

  let itemPerPageOption = screen.queryByTestId("item-per-page-dropdown");
  expect(itemPerPageOption).toBeInTheDocument();
  const itemPerPageOptionThree = screen.getByTestId("item-per-page-option-3");
  expect(itemPerPageOptionThree).toBeInTheDocument();

  expect(screen.getByTestId("item-per-page-dropdown")).toBeInTheDocument();

  await act(async () => {
   await event.hover(itemPerPageButton);
   await event.click(itemPerPageOptionThree);
  });

  itemPerPageValue = screen.queryByTestId("item-per-page-value");
  expect(itemPerPageValue).toHaveTextContent("Show All");

  expect(screen.getByTestId("product-card").children).toHaveLength(4);

  await act(async () => {
   await event.hover(itemPerPageButton);
   await userEvent.unhover(itemPerPageButton);
  });

  expect(
   screen.queryByTestId("item-per-page-dropdown")
  ).not.toBeInTheDocument();
 });

 it("Should Render Item Per Page Downdown and Change Value", async () => {
  const event = userEvent.setup();

  render(<DropdownTest />);

  const sortButton = screen.getByTestId("sort-button");
  let sortButtonValue = screen.getByTestId("sort-value");
  expect(sortButtonValue).toHaveTextContent("Name Asc");

  await event.hover(sortButton);

  const sortDropdown = screen.getByTestId("sort-dropdown");
  expect(sortDropdown).toBeInTheDocument();
  expect(sortDropdown.children).toHaveLength(4);

  const sortOption = screen.getByTestId("sort-option-2");
  expect(sortOption).toBeInTheDocument();

  await act(async () => {
   await event.hover(sortButton);
   await event.click(sortOption);
  });

  sortButtonValue = screen.getByTestId("sort-value");

  expect(sortButtonValue).toHaveTextContent("Name Desc");

  await act(async () => {
   await event.hover(sortButton);
   await event.unhover(sortButton);
  });

  expect(screen.queryByTestId("sort-dropdown")).not.toBeInTheDocument();

  expect(screen.getByText("product-4")).toBeInTheDocument();
 });

 it("Should Update Shop Main Title When a Category Is Selected", async () => {
  const user = userEvent.setup();

  render(
   <MemoryRouter initialEntries={["/shop"]}>
    <Routes>
     <Route
      path="/"
      element={
       <Outlet
        context={{
         products: mockProducts,
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

  // Test Shop Main Title with content All Products
  let shopMainTitle = screen.getByRole("heading", { name: "All Products" });
  expect(shopMainTitle).toBeInTheDocument();

  // Is Categories Button on Aside
  const categoriesButtonLists = screen.getByTestId("category-lists");
  expect(categoriesButtonLists).toBeInTheDocument();
  expect(categoriesButtonLists.children).toHaveLength(4);
  expect(categoriesButtonLists.children[0]).toHaveTextContent("category-1");

  await user.click(screen.getByTestId("category-button-0"));

  shopMainTitle = screen.getByRole("heading", { name: "category-1" });
  expect(shopMainTitle).toBeInTheDocument();

  expect(screen.getByTestId("product-card-1")).toBeInTheDocument();

  expect(screen.getByTestId("remove-category")).toBeInTheDocument();
  await user.click(screen.getByTestId("remove-category"));

  shopMainTitle = screen.getByRole("heading", { name: "All Products" });

  expect(screen.getByTestId("product-card").children).toHaveLength(
   mockProducts.length
  );
 });
});

const MockProductMain = () => {
 const product = { ...mockProducts[0] };
 const [cartItem, setCartItem] = useState([]);
 const [wishlistItem, setWishlistItem] = useState([]);

 return (
  <MemoryRouter>
   <ProductMain
    product={product}
    cartItem={cartItem}
    setCartItem={setCartItem}
    wishlistItem={wishlistItem}
    setWishlistItem={setWishlistItem}
   />
  </MemoryRouter>
 );
};

describe("Test Main component of Product", () => {
 it("Should Render Product Main Detail", async () => {
  const user = userEvent.setup();
  render(<MockProductMain />);

  // Test Product Detail Title
  const productTitle = screen.getByRole("heading", {
   name: mockProducts[0].title,
  });
  expect(productTitle).toBeInTheDocument();

  expect(screen.getByText("Min Order: 1 Pcs")).toBeInTheDocument();
  const infoButton = screen.getByTestId("info-button");
  expect(screen.queryByText(/lorem/i)).not.toBeInTheDocument();

  await user.click(infoButton);

  expect(screen.queryByText("Min Order: 1 Pcs")).not.toBeInTheDocument();
  expect(screen.getByText(/lorem/i)).toBeInTheDocument();
 });

 it("Should Render Breadcrumb on Product Page and Navigate to Correct Route on Click", async () => {
  const user = userEvent.setup();
  render(
   <MemoryRouter initialEntries={["/product/1"]}>
    <Routes>
     <Route
      path="/"
      element={
       <Outlet
        context={{ products: mockProducts, categories: mockCategories }}
       />
      }
     >
      <Route path="/shop" element={<Shop />} />
      <Route path="/product/:id" element={<Product />} />
     </Route>
    </Routes>
   </MemoryRouter>
  );

  // Test Breadcrumb
  const productTitle = screen.getByTestId("breadcrumb");
  expect(productTitle).toBeInTheDocument();

  const categoriesButton = screen.getByText(mockProducts[0].category);
  expect(categoriesButton).toBeInTheDocument();

  // Route to Category By clicking Category Button in Breadcrumb
  await user.click(categoriesButton);

  expect(
   screen.getByRole("heading", { name: mockProducts[0].category })
  ).toBeInTheDocument();
 });

 it("Should Render Media for Product", async () => {
  const user = userEvent.setup();
  render(<MockProductMain />);

  let displayImage = screen.getByTestId("display-image");
  expect(displayImage).toBeInTheDocument();

  const image2 = screen.getByTestId("image-2");
  await user.click(image2);

  displayImage = screen.getByTestId("display-image");
  expect(displayImage).toBeInTheDocument();
 });

 it("Should Render Option Section", async () => {
  const user = userEvent.setup();

  render(<MockProductMain />);

  let productAmount = screen.getByTestId("amount");
  expect(productAmount).toBeInTheDocument();
  expect(productAmount).toHaveTextContent(1);

  let subtotal = screen.getByTestId("subtotal");
  expect(subtotal).toHaveTextContent(mockProducts[0].price * 1);

  // Reduce button disabled
  let reduceButton = screen.getByTestId("reduce-amount");
  expect(reduceButton).toHaveAttribute("disabled", "");

  // User Click that disabled reduce button
  await user.click(reduceButton);

  // amount value doesn't change
  productAmount = screen.getByTestId("amount");
  expect(productAmount).toHaveTextContent(1);

  const addButton = screen.getByTestId("add-amount");
  expect(addButton).toBeInTheDocument();

  // User click add amount button
  await user.click(addButton);

  // Amount value added by 1
  productAmount = screen.getByTestId("amount");
  expect(productAmount).toHaveTextContent(2);
  subtotal = screen.getByTestId("subtotal");
  expect(subtotal).toHaveTextContent(mockProducts[0].price * 2);

  // Reduce button remove disabled attribute
  reduceButton = screen.getByTestId("reduce-amount");
  expect(reduceButton).not.toHaveAttribute("disabled");

  // User click active reduce button
  await user.click(reduceButton);
  // Amount value reduced by 1
  productAmount = screen.getByTestId("amount");
  expect(productAmount).toHaveTextContent(1);
  subtotal = screen.getByTestId("subtotal");
  expect(subtotal).toHaveTextContent(mockProducts[0].price * 1);

  const addToCartButton = screen.getByTestId("add-to-cart");

  await user.click(addToCartButton);

  await user.click(addButton);
  await user.click(addButton);

  expect(productAmount).toHaveTextContent(3);

  await user.click(addToCartButton);
 });

 it("Should Toggle wishlist Item", async () => {
  const user = userEvent.setup();

  render(<MockProductMain />);

  let wishlistButton = screen.getByTestId("wishlist-button");
  expect(wishlistButton).toBeInTheDocument();
  expect(wishlistButton).toHaveClass(`${styles.wishlist} ${styles.inactive}`);

  await user.click(wishlistButton);

  wishlistButton = screen.getByTestId("wishlist-button");
  expect(wishlistButton).toBeInTheDocument();

  expect(wishlistButton).toHaveClass(`${styles.wishlist} ${styles.active}`);
 });
});

const generateMockCartItem = (num) => {
 const products = [];
 for (let i = 1; i <= num; i++) {
  products.push({
   id: i,
   amount: 1,
  });
 }
 return products;
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

const MockCartMain = () => {
 const [products, setProducts] = useState([...generateMockProducts(5)]);
 const [cartItem, setCartItem] = useState([...generateMockCartItem(3)]);
 const [wishlistItem, setWishlistItem] = useState([...generateMockWishlist(2)]);
 const [notificationItem, setNotificationItem] = useState([]);

 return (
  <MemoryRouter>
   <CartMain
    products={products}
    setProducts={setProducts}
    cartItem={cartItem}
    setCartItem={setCartItem}
    wishlistItem={wishlistItem}
    setWishlistItem={setWishlistItem}
    notificationItem={notificationItem}
    setNotificationItem={setNotificationItem}
   />
  </MemoryRouter>
 );
};

describe("Test Main component of Cart", () => {
 it("Should Render Cart Contents", () => {
  const mockCartItem = [...generateMockCartItem(3)];

  render(<MockCartMain />);

  const itemList = screen.getByTestId("item-list");

  expect(itemList.children).toHaveLength(3);

  mockCartItem.map((item) => {
   expect(screen.getByTestId(`wishlist-button-${item.id}`)).toBeInTheDocument();
   expect(screen.getByTestId(`remove-button-${item.id}`)).toBeInTheDocument();
   expect(screen.getByTestId(`reduce-button-${item.id}`)).toBeInTheDocument();
   expect(screen.getByTestId(`add-button-${item.id}`)).toBeInTheDocument();
  });
 });

 it("Should toggle wishlist status when button is clicked on a product", async () => {
  const user = userEvent.setup();

  render(<MockCartMain />);

  const wishlistButtonOne = screen.getByTestId("wishlist-button-1");

  expect(wishlistButtonOne).toBeInTheDocument();
  expect(wishlistButtonOne).toHaveClass(
   `${styles["wishlist-button"]} ${styles.active}`
  );

  await user.click(wishlistButtonOne);

  expect(wishlistButtonOne).toHaveClass(
   `${styles["wishlist-button"]} ${styles.inactive}`
  );

  const wishlistButtonThree = screen.getByTestId("wishlist-button-3");

  await user.click(wishlistButtonThree);

  expect(screen.getByTestId("wishlist-button-3")).toHaveClass(
   `${styles["wishlist-button"]} ${styles.active}`
  );
 });

 it("Should remove item from cart when remove button is clicked", async () => {
  const user = userEvent.setup();

  render(<MockCartMain />);

  const removeButtonOne = screen.getByTestId("remove-button-1");
  expect(removeButtonOne).toBeInTheDocument();
  // Remove item 1
  await user.click(removeButtonOne);
  // remove button for item 1 not exists anymore
  expect(screen.queryByTestId("remove-button-1")).not.toBeInTheDocument();
 });

 it("Should update item amount when reduce or add button is clicked", async () => {
  const user = userEvent.setup();

  render(<MockCartMain />);

  const reduceButtonProductOne = screen.getByTestId("reduce-button-1");
  expect(reduceButtonProductOne).toBeInTheDocument();
  const addButtonProductOne = screen.getByTestId("add-button-1");
  expect(addButtonProductOne).toBeInTheDocument();
  const amountProductOne = screen.getByTestId("amount-1");
  expect(amountProductOne).toBeInTheDocument();
  expect(amountProductOne).toHaveTextContent(1);

  // Reduce Button disabled
  expect(reduceButtonProductOne).toHaveAttribute("disabled");

  // Try Click Reduce button but not reduce amount
  await user.click(reduceButtonProductOne);
  expect(amountProductOne).toHaveTextContent(1);

  // Click Add Button to add amount of product
  await user.click(addButtonProductOne);
  expect(amountProductOne).toHaveTextContent(2);
  expect(reduceButtonProductOne).not.toHaveAttribute("disabled");

  // Reduce amount of product by clicking reduce button
  await user.click(reduceButtonProductOne);
  expect(amountProductOne).toHaveTextContent(1);
  expect(reduceButtonProductOne).toHaveAttribute("disabled");
 });

 it("Should navigate to the product page when the image or title is clicked", async () => {
  const user = userEvent.setup();

  const MockRoute = () => {
   const [cartItem, setCartItem] = useState(generateMockCartItem(3));
   const [products, setProducts] = useState(generateMockProducts(4));
   const [wishlist, setWishlistItem] = useState([]);
   return (
    <MemoryRouter initialEntries={["/cart"]}>
     <Routes>
      <Route
       path="/"
       element={
        <Outlet
         context={{
          products: products,
          setProducts: setProducts,
          cartItem: cartItem,
          setCartItem: setCartItem,
          wishlistItem: wishlist,
          setWishlistItem: setWishlistItem,
         }}
        />
       }
      >
       <Route path="/product/:id" element={<Product />} />
       <Route path="/cart" element={<Cart />} />
      </Route>
     </Routes>
    </MemoryRouter>
   );
  };

  render(<MockRoute />);

  const productImageOne = screen.getByAltText("product-1");
  expect(productImageOne).toBeInTheDocument();

  await user.click(productImageOne);

  expect(
   screen.getByRole("heading", { name: "product-1" })
  ).toBeInTheDocument();
 });

 it("Should Render Summary Section", () => {
  render(<MockCartMain />);

  expect(screen.getByText("Shopping Summary")).toBeInTheDocument();

  expect(screen.getByTestId("total-price")).toBeInTheDocument();

  const buyButton = screen.getByTestId("buy-button");
  expect(buyButton).toBeInTheDocument();
  expect(buyButton).toHaveTextContent("Buy (3)");
 });

 it("Should update the total price when the product amount changes or a product is removed", async () => {
  const user = userEvent.setup();
  render(<MockCartMain />);

  // Total Price
  const totalPrice = screen.getByTestId("total-price");
  expect(totalPrice).toBeInTheDocument();
  expect(totalPrice).toHaveTextContent("360");

  // Add Button
  const addButtonProductOne = screen.getByTestId("add-button-1");
  expect(addButtonProductOne).toBeInTheDocument();

  await user.click(addButtonProductOne);

  // Total Price Change
  expect(totalPrice).toHaveTextContent("470");

  // Remove Button
  const removeButtonProductTwo = screen.getByTestId("remove-button-2");
  expect(removeButtonProductTwo).toBeInTheDocument();

  await user.click(removeButtonProductTwo);

  expect(totalPrice).toHaveTextContent("350");
 });

 it("Should update buy button text content when the product amount changes", async () => {
  const user = userEvent.setup();
  render(<MockCartMain />);

  const buyButton = screen.getByTestId("buy-button");
  expect(buyButton).toBeInTheDocument();
  expect(buyButton).toHaveTextContent("Buy (3)");

  // Add Button
  const addButtonProductOne = screen.getByTestId("add-button-1");
  expect(addButtonProductOne).toBeInTheDocument();

  await user.click(addButtonProductOne);

  // Buy Button text Change
  expect(buyButton).toHaveTextContent("Buy (4)");

  // Remove Button
  const removeButtonProductTwo = screen.getByTestId("remove-button-2");
  expect(removeButtonProductTwo).toBeInTheDocument();

  await user.click(removeButtonProductTwo);

  expect(buyButton).toHaveTextContent("Buy (3)");
 });

 it("Should display modal when buy button is clicked and clear products from cart page", async () => {
  const user = userEvent.setup();
  render(<MockCartMain />);

  const buyButton = screen.getByTestId("buy-button");
  expect(buyButton).toBeInTheDocument();
  expect(buyButton).toHaveTextContent("Buy (3)");

  await user.click(buyButton);

  expect(
   screen.queryByRole("heading", { name: /complete/i })
  ).toBeInTheDocument();

  expect(screen.getByTestId("buy-button")).toHaveTextContent("Buy (0)");

  expect(screen.getByRole("button", { name: "Shop" })).toBeInTheDocument();
 });

 it("Should navigate to shop when shop button is clicked in modal", async () => {
  const user = userEvent.setup();

  const MockRoute = () => {
   const [cartItem, setCartItem] = useState(generateMockCartItem(3));
   const [products, setProducts] = useState(generateMockProducts(4));
   const [wishlist, setWishlistItem] = useState([]);
   const [notificationItem, setNotificationItem] = useState([]);
   return (
    <MemoryRouter initialEntries={["/cart"]}>
     <Routes>
      <Route
       path="/"
       element={
        <Outlet
         context={{
          products: products,
          categories: mockCategories,
          setProducts: setProducts,
          cartItem: cartItem,
          setCartItem: setCartItem,
          wishlistItem: wishlist,
          setWishlistItem: setWishlistItem,
          notificationItem: notificationItem,
          setNotificationItem: setNotificationItem,
         }}
        />
       }
      >
       <Route path="/shop" element={<Shop />} />
       <Route path="/cart" element={<Cart />} />
      </Route>
     </Routes>
    </MemoryRouter>
   );
  };

  render(<MockRoute />);

  const buyButton = screen.getByTestId("buy-button");
  expect(buyButton).toBeInTheDocument();

  await user.click(buyButton);

  const shopButton = screen.getByRole("button", { name: "Shop" });
  expect(shopButton).toBeInTheDocument();

  await user.click(shopButton);

  expect(
   screen.getByRole("heading", { name: "All Products" })
  ).toBeInTheDocument();
 });

 it("Should Add notification Item After Buying Product", async () => {
  const user = userEvent.setup();

  const MockRoute = () => {
   const [cartItem, setCartItem] = useState(generateMockCartItem(3));
   const [products, setProducts] = useState(generateMockProducts(4));
   const [wishlist, setWishlistItem] = useState([]);
   const [notificationItem, setNotificationItem] = useState([]);
   const [hoverButton, setHoverButton] = useState(null);
   return (
    <MemoryRouter initialEntries={["/cart"]}>
     <Header
      products={mockProducts}
      cartItem={cartItem}
      notificationItem={notificationItem}
      hoverButton={hoverButton}
      setHoverButton={setHoverButton}
     />
     <Routes>
      <Route
       path="/"
       element={
        <Outlet
         context={{
          products: products,
          categories: mockCategories,
          setProducts: setProducts,
          cartItem: cartItem,
          setCartItem: setCartItem,
          wishlistItem: wishlist,
          setWishlistItem: setWishlistItem,
          setNotificationItem: setNotificationItem,
         }}
        />
       }
      >
       <Route path="/shop" element={<Shop />} />
       <Route path="/cart" element={<Cart />} />
      </Route>
     </Routes>
    </MemoryRouter>
   );
  };

  render(<MockRoute />);

  const buyButton = screen.getByTestId("buy-button");
  expect(buyButton).toBeInTheDocument();

  await user.click(buyButton);

  const notificationButtonWrapper = screen.getByTestId(
   "notification-button-wrapper"
  );
  expect(notificationButtonWrapper).toBeInTheDocument();

  await user.hover(notificationButtonWrapper);

  const notificationItem = screen.getByTestId("notification-item-1");

  expect(notificationItem).toBeInTheDocument();
  expect(notificationItem.children).toHaveLength(2);

  expect(screen.getByTestId("notification-message-1")).toHaveTextContent(
   /360/i
  );
 });
});

describe("Test Main Component of Wishlist", () => {
 it("Should Render Wishlist Main Product", () => {
  render(
   <MemoryRouter>
    <WishlistMain
     products={mockProducts}
     wishlistItem={generateMockWishlist(2)}
     page={1}
     setPage={() => vi.fn()}
     itemPerPage={1}
     setItemPerPage={() => vi.fn()}
    />
   </MemoryRouter>
  );

  expect(screen.getByRole("heading", { name: "Wishlist" })).toBeInTheDocument();

  expect(
   screen.getByTestId(`product-card-${mockProducts[0].id}`)
  ).toBeInTheDocument();
  expect(screen.getByAltText(mockProducts[0].title)).toBeInTheDocument();
  expect(screen.getByText(mockProducts[0].title)).toBeInTheDocument();
  expect(screen.getByText(mockProducts[0].price)).toBeInTheDocument();
 });

 it("Should Route to Product Page when clicked Product on Wishlist Page", async () => {
  const user = userEvent.setup();

  render(
   <MemoryRouter initialEntries={["/wishlist"]}>
    <Routes>
     <Route
      path="/"
      element={
       <Outlet
        context={{
         products: generateMockProducts(4),
         wishlistItem: generateMockWishlist(3),
        }}
       />
      }
     >
      <Route path="/wishlist" element={<Wishlist />} />
      <Route path="/product/:id" element={<Product />} />
     </Route>
    </Routes>
   </MemoryRouter>
  );

  const productLink = screen.getByTestId("product-card-1");
  expect(productLink).toBeInTheDocument();
  await user.click(productLink);

  expect(
   screen.getByRole("heading", { name: "product-1" })
  ).toBeInTheDocument();
 });

 it("Should remove Product from wishlist when clicked wishlist button", async () => {
  const user = userEvent.setup();

  const MockRoute = () => {
   const [cartItem, setCartItem] = useState([]);
   const [wishlist, setWishlistItem] = useState(generateMockWishlist(2));
   return (
    <MemoryRouter initialEntries={["/wishlist"]}>
     <Routes>
      <Route
       path="/"
       element={
        <Outlet
         context={{
          products: generateMockProducts(4),
          setCartItem: setCartItem,
          wishlistItem: wishlist,
          setWishlistItem: setWishlistItem,
         }}
        />
       }
      >
       <Route path="/wishlist" element={<Wishlist />} />
       <Route path="/cart" element={<Cart cartItem={cartItem} />} />
      </Route>
     </Routes>
    </MemoryRouter>
   );
  };

  render(<MockRoute />);

  let wishlistButtonProductOne = screen.getByTestId("wishlist-button-1");
  expect(wishlistButtonProductOne).toBeInTheDocument();
  expect(wishlistButtonProductOne).toHaveClass(styles.active);

  await user.click(wishlistButtonProductOne);

  wishlistButtonProductOne = screen.queryByTestId("wishlist-button-1");
  expect(wishlistButtonProductOne).not.toBeInTheDocument();
 });

 it("Should Render No Wishlist when no Wishlist Item", () => {
  render(
   <MemoryRouter>
    <WishlistMain
     products={[]}
     wishlistItem={[]}
     page={1}
     setPage={() => vi.fn()}
     itemPerPage={1}
     setItemPerPage={() => vi.fn()}
    />
   </MemoryRouter>
  );

  const noWishlist = screen.getByTestId("no-wishlist");

  expect(noWishlist).toBeInTheDocument();
 });

 it("Should Add product to cart when click cart button on card in wishlist Page", async () => {
  const user = userEvent.setup();

  const MockRoute = () => {
   const [cartItem, setCartItem] = useState([]);
   const [wishlist, setWishlistItem] = useState(generateMockWishlist(5));

   const mockProducts = generateMockProducts(6);
   return (
    <MemoryRouter initialEntries={["/wishlist"]}>
     <Header
      products={mockProducts}
      cartItem={cartItem}
      setHoverButton={vi.fn()}
     />
     <Routes>
      <Route
       path="/"
       element={
        <Outlet
         context={{
          products: mockProducts,
          cartItem: cartItem,
          setCartItem: setCartItem,
          wishlistItem: wishlist,
          setWishlistItem: setWishlistItem,
         }}
        />
       }
      >
       <Route path="/wishlist" element={<Wishlist />} />
       <Route path="/cart" element={<Cart />} />
      </Route>
     </Routes>
    </MemoryRouter>
   );
  };

  render(<MockRoute />);

  const productOne = screen.getByTestId("product-card-1");
  expect(productOne).toBeInTheDocument();
  const productOneCartButton = screen.getByTestId("add-to-cart-button-1");
  expect(productOneCartButton).toBeInTheDocument();

  await user.click(productOneCartButton);

  const cartButton = screen.getByTestId("cart-button");
  expect(cartButton).toBeInTheDocument();

  await user.click(cartButton);

  const buyButton = screen.getByTestId("buy-button");
  expect(buyButton).toBeInTheDocument();
  expect(buyButton).toHaveTextContent("Buy (1)");
 });

 it("Should Route to valid Query Path", async () => {
  const user = userEvent.setup();
  const MockRoute = () => {
   const [cartItem, setCartItem] = useState([]);
   const [wishlist, setWishlistItem] = useState(generateMockWishlist(50));
   return (
    <MemoryRouter
     initialEntries={["/wishlist?sort=name-asc&page=-1&itemsPerPage=99"]}
    >
     <Routes>
      <Route
       path="/"
       element={
        <Outlet
         context={{
          products: generateMockProducts(60),
          setCartItem: setCartItem,
          wishlistItem: wishlist,
          setWishlistItem: setWishlistItem,
         }}
        />
       }
      >
       <Route path="/wishlist" element={<Wishlist />} />
       <Route path="/cart" element={<Cart cartItem={cartItem} />} />
      </Route>
     </Routes>
    </MemoryRouter>
   );
  };

  render(<MockRoute />);

  expect(screen.getByTestId("current-page-button")).toHaveTextContent("1");

  const lastPageButton = screen.getByTestId("last-page-button");
  expect(lastPageButton).toHaveTextContent("5");

  await user.click(lastPageButton);

  expect(screen.getByTestId("current-page-button")).toHaveTextContent("5");
 });
});

const generateMockNotification = (num) => {
 const mockNotification = [];

 for (let i = 1; i <= num; i++) {
  mockNotification.push({
   id: i,
   message: `Purchase complete - Order ${i}`,
   products: [...generateMockCartItem(2)],
   timeStamp: new Date().toLocaleString(),
   isRead: false,
  });
 }
 return mockNotification;
};

describe("Test Main Component of Notification Page", () => {
 it("Should render Main Component of Notification", () => {
  render(
   <MemoryRouter>
    <NotificationMain
     products={generateMockProducts(30)}
     notificationItem={generateMockNotification(3)}
     setNotificationItem={vi.fn()}
    />
   </MemoryRouter>
  );

  expect(
   screen.getByRole("heading", { name: "Notifications" })
  ).toBeInTheDocument();

  expect(screen.getByTestId("notification-item-1")).toBeInTheDocument();
 });

 it("Renders notification list properly", () => {
  const mockNotification = generateMockNotification(3);
  render(
   <MemoryRouter>
    <NotificationMain
     products={generateMockProducts(30)}
     notificationItem={mockNotification}
     setNotificationItem={vi.fn()}
    />
   </MemoryRouter>
  );

  mockNotification.map((notification) => {
   expect(
    screen.getByTestId(`notification-item-${notification.id}`)
   ).toBeInTheDocument();
   expect(
    screen.queryByTestId(`detail-button-${notification.id}`)
   ).toBeInTheDocument();
  });
 });

 it("Marks all Notifications as read when click Marks all Read Button", async () => {
  const user = userEvent.setup();

  const MockNotificationList = () => {
   const [notificationItem, setNotificationItem] = useState(
    generateMockNotification(3)
   );
   return (
    <MemoryRouter>
     <NotificationMain
      products={generateMockProducts(30)}
      notificationItem={notificationItem}
      setNotificationItem={setNotificationItem}
     />
    </MemoryRouter>
   );
  };
  render(<MockNotificationList />);

  const marksAllReadButton = screen.getByTestId("marks-all-read");
  expect(marksAllReadButton).toBeInTheDocument();
  expect(marksAllReadButton).toHaveTextContent("Marks All Read (3)");
  await user.click(marksAllReadButton);

  expect(marksAllReadButton).toHaveTextContent("Marks All Read (0)");
 });

 it("Marks notification as read on hover", async () => {
  const user = userEvent.setup();

  const MockNotificationList = () => {
   const [notificationItem, setNotificationItem] = useState(
    generateMockNotification(3)
   );
   return (
    <MemoryRouter>
     <NotificationMain
      products={generateMockProducts(30)}
      notificationItem={notificationItem}
      setNotificationItem={setNotificationItem}
     />
    </MemoryRouter>
   );
  };
  render(<MockNotificationList />);

  const notificationItemOne = screen.getByTestId("notification-item-1");
  const notificationItemTwo = screen.getByTestId("notification-item-2");
  expect(notificationItemOne).toBeInTheDocument();
  expect(notificationItemTwo).toBeInTheDocument();
  expect(notificationItemOne).toHaveClass(
   `${styles["notification-item"]} ${styles["unread"]}`
  );
  expect(notificationItemTwo).toHaveClass(
   `${styles["notification-item"]} ${styles["unread"]}`
  );

  // Hover on notification item 1
  await user.hover(notificationItemOne);

  // notification item 1 class set to read
  expect(notificationItemOne).toHaveClass(
   `${styles["notification-item"]} ${styles["read"]}`
  );
  // notification item 2 class still unread
  expect(notificationItemTwo).toHaveClass(
   `${styles["notification-item"]} ${styles["unread"]}`
  );
 });

 it("Opens notification details when clicking the detail button", async () => {
  const user = userEvent.setup();

  const MockNotificationList = () => {
   const [notificationItem, setNotificationItem] = useState(
    generateMockNotification(3)
   );
   return (
    <MemoryRouter>
     <NotificationMain
      products={generateMockProducts(30)}
      notificationItem={notificationItem}
      setNotificationItem={setNotificationItem}
     />
    </MemoryRouter>
   );
  };
  render(<MockNotificationList />);

  const detailButtonOne = screen.getByTestId("detail-button-1");
  const detailButtonTwo = screen.getByTestId("detail-button-2");
  expect(detailButtonOne).toBeInTheDocument();
  expect(detailButtonOne).toHaveClass(styles.closed);
  expect(detailButtonTwo).toBeInTheDocument();
  expect(detailButtonTwo).toHaveClass(styles.closed);

  await user.click(detailButtonOne);

  expect(detailButtonOne).toHaveClass(styles.open);
  expect(detailButtonTwo).toHaveClass(styles.closed);

  const notificationDetailOne = screen.getByTestId("notification-1");
  expect(notificationDetailOne).toBeInTheDocument();
  expect(screen.queryByTestId("notification-2")).not.toBeInTheDocument();

  expect(screen.getByTestId("total-1")).toBeInTheDocument();

  // Click other details
  await user.click(detailButtonTwo);

  expect(detailButtonOne).toHaveClass(styles.closed);
  expect(detailButtonTwo).toHaveClass(styles.open);

  expect(screen.queryByTestId("notification-1")).not.toBeInTheDocument();
  const notificationDetailTwo = screen.getByTestId("notification-2");
  expect(notificationDetailTwo).toBeInTheDocument();

  expect(screen.getByTestId("total-2")).toBeInTheDocument();

  // Click Again the same detail to close
  await user.click(detailButtonTwo);

  expect(detailButtonOne).toHaveClass(styles.closed);
  expect(detailButtonTwo).toHaveClass(styles.closed);

  expect(screen.queryByTestId("notification-1")).not.toBeInTheDocument();
  expect(screen.queryByTestId("notification-2")).not.toBeInTheDocument();
 });

 it("Removes notifications when click remove button", async () => {
  const user = userEvent.setup();

  const MockNotificationList = () => {
   const [notificationItem, setNotificationItem] = useState(
    generateMockNotification(3)
   );
   return (
    <MemoryRouter>
     <NotificationMain
      products={generateMockProducts(30)}
      notificationItem={notificationItem}
      setNotificationItem={setNotificationItem}
     />
    </MemoryRouter>
   );
  };
  render(<MockNotificationList />);

  const notificationItemOne = screen.getByTestId("notification-item-1");
  expect(notificationItemOne).toBeInTheDocument();

  const clearButton = screen.getByTestId("clear-notification-button");
  expect(clearButton).toBeInTheDocument();

  await user.click(clearButton);

  expect(screen.queryByTestId("notification-item-1")).not.toBeInTheDocument();
 });
});
