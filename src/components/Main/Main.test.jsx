import { render, screen } from "@testing-library/react";
import HomeMain from "./HomeMain";
import {
 MemoryRouter,
 Outlet,
 Route,
 Routes,
 useNavigate,
} from "react-router-dom";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import ShopMain from "./ShopMain";
import Shop from "../../pages/Shop/Shop";
import Product from "../../pages/Product/Product";
import { useState } from "react";
import PropTypes from "prop-types";

const mockCategories = ["category-1", "category-2", "category-3", "category-4"];

const mockProducts = [
 {
  id: 1,
  title: "product-1",
  image: "/image/product-1.png",
  price: 100,
 },
 {
  id: 2,
  title: "product-2",
  image: "/image/product-2.png",
  price: 135,
 },
 {
  id: 3,
  title: "product-3",
  image: "/image/product-3.png",
  price: 120,
 },
 {
  id: 4,
  title: "product-4",
  image: "/image/product-4.png",
  price: 90,
 },
];

vi.mock("react-router-dom", async () => {
 const actual = await vi.importActual("react-router-dom");
 return {
  ...actual,
  useNavigate: vi.fn(),
 };
});

describe("Test Main component of Home", () => {
 const mockNavigate = vi.fn();

 beforeEach(() => {
  vi.resetAllMocks();
  useNavigate.mockImplementation(() => mockNavigate);
 });

 it("Should Render Categories Section", () => {
  render(<HomeMain categories={mockCategories} products={mockProducts} />);

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
  render(<HomeMain categories={[]} products={mockProducts} />);

  const categoriesContainer = screen.getByTestId("categories-section");
  expect(categoriesContainer.children).toHaveLength(1);

  mockCategories.forEach((category) => {
   expect(screen.queryByText(category)).not.toBeInTheDocument();
  });
 });

 it("Should Render Carousel", () => {
  render(<HomeMain categories={mockCategories} products={mockProducts} />);

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
  render(<HomeMain categories={mockCategories} products={[]} />);

  const carousel = screen.getByTestId("products-carousel-section");
  expect(carousel.children).toHaveLength(0);

  mockProducts.forEach((product) => {
   expect(
    screen.queryByRole("heading", { name: product.title })
   ).not.toBeInTheDocument();
  });
 });

 it("Should Render Call to Action Section", async () => {
  const event = userEvent.setup();
  render(<HomeMain categories={[]} products={[]} />);

  const ctaButton = screen.getByRole("button", { name: "Shop Now" });
  expect(ctaButton).toBeInTheDocument();

  await event.click(ctaButton);

  expect(mockNavigate).toHaveBeenCalledWith("/shop");
  expect(mockNavigate).toHaveBeenCalledOnce();
 });
});

const PaginationButtonTest = ({ newProduct }) => {
 const [page, setPage] = useState(2);
 const [itemPerPage, setItemPerPage] = useState(1);

 const localProduct = newProduct
  ? [...mockProducts, newProduct]
  : [...mockProducts];

 return (
  <MemoryRouter>
   <ShopMain
    products={localProduct}
    page={page}
    setPage={setPage}
    itemPerPage={itemPerPage}
    setItemPerPage={setItemPerPage}
   />
  </MemoryRouter>
 );
};

PaginationButtonTest.propTypes = {
 newProduct: PropTypes.object,
};

describe("Test Main component of Shop", () => {
 it("Should Render Shop Main Product Card", () => {
  render(
   <MemoryRouter>
    <ShopMain products={mockProducts} />
   </MemoryRouter>
  );

  expect(
   screen.getByRole("heading", { name: "All Products" })
  ).toBeInTheDocument();

  expect(screen.getByTestId("product-card").children).toHaveLength(
   mockProducts.length
  );

  mockProducts.forEach((product) => {
   expect(screen.getByTestId(`product-card-${product.id}`)).toBeInTheDocument();
   expect(screen.getByAltText(product.title)).toBeInTheDocument();
   expect(screen.getByText(product.title)).toBeInTheDocument();
   expect(screen.getByText(product.price)).toBeInTheDocument();
  });
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
  render(<PaginationButtonTest />);
  let prevArrowButton = screen.queryByTestId("prev-button");
  let nextArrowButton = screen.queryByTestId("next-button");

  expect(prevArrowButton).toBeInTheDocument();
  expect(nextArrowButton).toBeInTheDocument();

  await event.click(prevArrowButton);

  prevArrowButton = screen.queryByTestId("prev-button");
  nextArrowButton = screen.queryByTestId("next-button");

  expect(prevArrowButton).not.toBeInTheDocument();
  expect(nextArrowButton).toBeInTheDocument();

  await event.click(nextArrowButton);

  prevArrowButton = screen.queryByTestId("prev-button");
  nextArrowButton = screen.queryByTestId("next-button");

  expect(prevArrowButton).toBeInTheDocument();
  expect(nextArrowButton).toBeInTheDocument();

  await event.click(nextArrowButton);
  await event.click(nextArrowButton);
  await event.click(nextArrowButton);

  prevArrowButton = screen.queryByTestId("prev-button");
  nextArrowButton = screen.queryByTestId("next-button");

  expect(prevArrowButton).toBeInTheDocument();
  expect(nextArrowButton).not.toBeInTheDocument();
 });

 it("Should Render Pagination Page Number Button Based on Current Page", async () => {
  const event = userEvent.setup();
  render(<PaginationButtonTest />);

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

  // Not Rendered (current page 2)
  expect(prevPrevPageButton).not.toBeInTheDocument();
  expect(prevPageButton).not.toBeInTheDocument();

  // Instead Render First Page Button
  expect(firstPageButton).toBeInTheDocument();

  expect(nextPageButton).toBeInTheDocument();

  expect(dotsBefore).not.toBeInTheDocument();
  expect(dotsAfter).not.toBeInTheDocument();

  expect(nextNextPageButton).not.toBeInTheDocument();
  expect(lastPageButton).toBeInTheDocument();

  // Click First Page Button
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
  expect(dotsAfter).not.toBeInTheDocument();
  expect(lastPageButton).toBeInTheDocument();
  expect(lastPageButton).toHaveTextContent("4");

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
  expect(dotsAfter).not.toBeInTheDocument();
  expect(lastPageButton).toBeInTheDocument();
  expect(lastPageButton).toHaveTextContent("4");

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
  expect(nextPageButton).not.toBeInTheDocument();
  expect(nextNextPageButton).not.toBeInTheDocument();
  expect(dotsAfter).not.toBeInTheDocument();
  expect(lastPageButton).toBeInTheDocument();
  expect(lastPageButton).toHaveTextContent("4");

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
  expect(dotsBefore).not.toBeInTheDocument();
  expect(prevPrevPageButton).toBeInTheDocument();
  expect(prevPrevPageButton).toBeInTheDocument("2");
  expect(prevPageButton).toBeInTheDocument();
  expect(prevPageButton).toHaveTextContent("3");
  expect(currentPageButton).toBeInTheDocument();
  expect(currentPageButton).toHaveTextContent("4");
  expect(nextPageButton).not.toBeInTheDocument();
  expect(nextNextPageButton).not.toBeInTheDocument();
  expect(dotsAfter).not.toBeInTheDocument();
  expect(lastPageButton).not.toBeInTheDocument();
 });

 it("Should Render Dots on Pagination", async () => {
  const event = userEvent.setup();

  render(
   <PaginationButtonTest
    newProduct={{
     id: 5,
     title: "product-5",
     image: "/image/product-5.png",
     price: 95,
    }}
   />
  );

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
});
