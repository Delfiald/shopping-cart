import { act, render, screen } from "@testing-library/react";
import HomeMain from "./HomeMain";
import { MemoryRouter, Outlet, Route, Routes } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import ShopMain from "./ShopMain";
import Shop from "../../pages/Shop/Shop";
import Product from "../../pages/Product/Product";
import { useState } from "react";
import PropTypes from "prop-types";
import Home from "../../pages/Home/Home";
import ProductMain from "./ProductMain";

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
  expect(carousel.children).toHaveLength(4);

  mockProducts.forEach((product) => {
   expect(
    screen.getByRole("heading", { name: product.title })
   ).toBeInTheDocument();
  });

  mockProducts.forEach((product) => {
   const imgElement = screen.getByAltText(product.title);
   expect(imgElement).toBeInTheDocument();
   expect(imgElement).toHaveAttribute("src", product.image);
  });
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
     <Route path="/" element={<Outlet context={{ products: mockProducts }} />}>
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

describe("Test Main component of Product", () => {
 it("Should Render Product Main Detail", async () => {
  const user = userEvent.setup();
  render(
   <MemoryRouter>
    <ProductMain product={mockProducts[0]} />
   </MemoryRouter>
  );

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
});
