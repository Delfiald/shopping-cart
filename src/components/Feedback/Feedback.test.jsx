import { MemoryRouter, Outlet, Route, Routes } from "react-router-dom";
import { render, screen } from "@testing-library/react";
import Feedback from "./Feedback";
import { expect, it } from "vitest";
import { Home } from "lucide-react";
import { useState } from "react";
import userEvent from "@testing-library/user-event";

describe("Loading Feedback", () => {
 it("renders Loading component when loading is true", () => {
  const MockApp = () => {
   const loading = true;
   const error = null;
   return <Feedback error={error} loading={loading} />;
  };
  render(<MockApp />);

  const loadingElement = screen.queryByText(/loading/i);
  expect(loadingElement).toBeInTheDocument();
 });

 it("does not render Loading component when loading is false", () => {
  render(
   <MemoryRouter>
    <Feedback loading={false} />
   </MemoryRouter>
  );

  const loadingElement = screen.queryByText(/loading/i);
  expect(loadingElement).not.toBeInTheDocument();
 });
});

describe("Error Feedback", () => {
 it("renders Error Feedback when error has a value", () => {
  render(
   <MemoryRouter>
    <Feedback error={"Error Message"} loading={false} />
   </MemoryRouter>
  );

  const errorElement = screen.getByText(/Error/i);
  expect(errorElement).toBeInTheDocument();
 });

 it("does not render Error Feedback when error is empty", () => {
  render(
   <MemoryRouter>
    <Feedback error={""} loading={false} />
   </MemoryRouter>
  );

  const errorElement = screen.queryByText(/Error/i);
  expect(errorElement).not.toBeInTheDocument();
 });

 it("renders Error Feedback when error has a value and loading is true", () => {
  render(
   <MemoryRouter>
    <Feedback error={"Error Timeout"} loading={true} />
   </MemoryRouter>
  );

  const errorElement = screen.queryByText(/Error/i);
  expect(errorElement).toBeInTheDocument();
 });

 it("Route to home page when click return button on error element", async () => {
  const user = userEvent.setup();
  const MockRoute = () => {
   const [error, setError] = useState("error");

   return (
    <MemoryRouter initialEntries={["/"]}>
     <Routes>
      <Route
       path="/"
       element={<Outlet context={{ products: [], categories: [] }} />}
      >
       <Route index element={<Home />} />
      </Route>
     </Routes>
     <Feedback error={error} setError={setError} />
    </MemoryRouter>
   );
  };

  render(<MockRoute />);

  let errorElement = screen.queryByText(/Error/i);
  expect(errorElement).toBeInTheDocument();
  const returnButton = screen.getByTestId("return-button");
  expect(returnButton).toBeInTheDocument();

  await user.click(returnButton);

  errorElement = screen.queryByText(/Error/i);
  expect(errorElement).not.toBeInTheDocument();
 });
});
