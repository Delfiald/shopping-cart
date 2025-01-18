import { MemoryRouter, Outlet, Route, Routes } from "react-router-dom";
import Shop from "./Shop";
import { render } from "@testing-library/react";

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
});
