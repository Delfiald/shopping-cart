import { render, screen } from "@testing-library/react";
import Home from "./Home";
import { MemoryRouter, Outlet, Route, Routes } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import Cart from "../Cart/Cart";
import PropTypes from "prop-types";
import Shop from "../Shop/Shop";

const MockRouter = ({
 context = {
  setHoverButton: () => {},
  setSearchInput: () => {},
 },
}) => {
 return (
  <MemoryRouter initialEntries={["/"]}>
   <Routes>
    <Route path="/" element={<Outlet context={context} />}>
     <Route index element={<Home />} />
     <Route path="cart" element={<Cart />} />
     <Route path="shop" element={<Shop />} />
    </Route>
   </Routes>
  </MemoryRouter>
 );
};

MockRouter.propTypes = {
 context: PropTypes.object,
};

describe("Home Page Test", () => {
 it("Renders Home Page", async () => {
  const { container } = render(<MockRouter />);
  expect(container).toMatchSnapshot();
 });

 it("Should Render Call to Action Section", async () => {
  const event = userEvent.setup();
  render(<MockRouter />);

  const ctaButton = screen.getByRole("button", { name: "Shop Now" });
  expect(ctaButton).toBeInTheDocument();

  await event.click(ctaButton);

  const shopMainHeading = screen.getByText("Shop Main");
  expect(shopMainHeading).toBeInTheDocument();
 });
});
