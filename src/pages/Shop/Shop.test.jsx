import { MemoryRouter, Outlet, Route, Routes } from "react-router-dom";
import Shop from "./Shop";
import { render, screen } from "@testing-library/react";
import { expect } from "vitest";

const mockCategories = ["category-1", "category-2"];

const MockRouter = () => {
 return (
  <MemoryRouter initialEntries={["/shop"]}>
   <Routes>
    <Route
     path="/"
     element={<Outlet context={{ categories: mockCategories }} />}
    >
     <Route path="shop" element={<Shop />} />
    </Route>
   </Routes>
  </MemoryRouter>
 );
};

describe("Test Home Page", () => {
 it("Should Render Home Page", () => {
  const { container } = render(<MockRouter />);

  expect(container).toMatchSnapshot();
 });

 it("Should Render Aside and Category Lists", () => {
  render(<MockRouter />);
  const asideCategoriesHeader = screen.getByText("Categories");
  const categoryLists = screen.getByTestId("category-lists");
  expect(asideCategoriesHeader).toBeInTheDocument();
  expect(categoryLists).toBeInTheDocument();
  expect(categoryLists.children).toHaveLength(2);
  expect(screen.getByText("category-1")).toBeInTheDocument();
  expect(screen.getByText("category-2")).toBeInTheDocument();
 });
});
