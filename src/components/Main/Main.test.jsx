import { render, screen } from "@testing-library/react";
import HomeMain from "./HomeMain";
import { useNavigate } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import ShopMain from "./ShopMain";

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

describe("Test Main component of Shop", () => {
 it("Should Render Shop Main Product Card", () => {
  render(<ShopMain products={mockProducts} />);

  expect(
   screen.getByRole("heading", { name: "All Products" })
  ).toBeInTheDocument();

  expect(screen.getAllByTestId("product-card")).toHaveLength(
   mockProducts.length
  );
 });
});
