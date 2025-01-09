import { render, screen } from "@testing-library/react";
import Main from "./Main";
import { MemoryRouter } from "react-router-dom";
import { expect } from "vitest";

const mockCategories = ["category-1", "category-2", "category-3", "category-4"];

const mockProducts = [
 {
  id: 1,
  title: "product-1",
  image: "/image/product-1.png",
 },
 {
  id: 2,
  title: "product-2",
  image: "/image/product-2.png",
 },
 {
  id: 3,
  title: "product-3",
  image: "/image/product-3.png",
 },
 {
  id: 4,
  title: "product-4",
  image: "/image/product-4.png",
 },
];

describe("Test Main component of Home", () => {
 it("Should Render Categories Section", () => {
  render(
   <MemoryRouter initialEntries={["/"]}>
    <Main categories={mockCategories} products={mockProducts} />
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
   <MemoryRouter initialEntries={["/"]}>
    <Main categories={[]} products={mockProducts} />
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
   <MemoryRouter initialEntries={["/"]}>
    <Main categories={mockCategories} products={mockProducts} />
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
   <MemoryRouter initialEntries={["/"]}>
    <Main categories={mockCategories} products={[]} />
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

 it("Should not render Main of Home", () => {
  render(
   <MemoryRouter initialEntries={["/error"]}>
    <Main categories={mockCategories} products={mockProducts} />
   </MemoryRouter>
  );

  expect(
   screen.queryByTestId("products-carousel-section")
  ).not.toBeInTheDocument();
  expect(screen.getByText("Path Not Found 404")).toBeInTheDocument();
 });
});
