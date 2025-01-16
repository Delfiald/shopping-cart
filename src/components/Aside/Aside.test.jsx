import { MemoryRouter, Outlet, Route, Routes } from "react-router-dom";
import Shop from "../../pages/Shop/Shop.jsx";
import { render, screen } from "@testing-library/react";

const mockCategories = ["category-1", "category-2"];

describe("Test Aside From Shop Page", () => {
 it("Should Render Aside and Category Lists", () => {
  render(
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
  const asideCategoriesHeader = screen.getByText("Categories");
  const categoryLists = screen.getByTestId("category-lists");
  expect(asideCategoriesHeader).toBeInTheDocument();
  expect(categoryLists).toBeInTheDocument();
  expect(categoryLists.children).toHaveLength(2);
  expect(screen.getByText("category-1")).toBeInTheDocument();
  expect(screen.getByText("category-2")).toBeInTheDocument();
 });
});
