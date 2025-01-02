import { render, screen } from "@testing-library/react";
import App from "./App";

describe("Something truthy and falsy", () => {
 it("true to be true", () => {
  expect(true).toBe(true);
 });

 it("false to be false", () => {
  expect(false).toBe(false);
 });

 it("render app", () => {
  const { container } = render(<App />);
  expect(container).toMatchSnapshot();
 });

 it("renders headline", () => {
  render(<App title="React" />);

  const headline = screen.getByText(/react/i);
  expect(headline).toBeInTheDocument();
 });
});
