import { render, screen } from "@testing-library/react";
import { beforeEach, expect } from "vitest";
import Footer from "./Footer";

describe("Footer Component Test", () => {
 beforeEach(() => {
  render(<Footer />);
 });

 it("Render Footer Component", () => {
  const copyrightText = screen.getByText(/mag 2025/i);
  expect(copyrightText).toBeInTheDocument();
 });

 it("Render About Section on Footer", () => {
  const aboutSection = screen.getByTestId("about");

  expect(aboutSection.children).toHaveLength(5);
  expect(screen.getByText("Shoppers")).toBeInTheDocument();
  expect(screen.getByText("About")).toBeInTheDocument();
  expect(screen.getByText("Career")).toBeInTheDocument();
  expect(screen.getByText("Blog")).toBeInTheDocument();
  expect(screen.getByText("Sale")).toBeInTheDocument();
 });

 it("Render Help Section on Footer", () => {
  const helpSection = screen.getByTestId("help");

  expect(helpSection.children).toHaveLength(5);
  expect(screen.getByText("Guide and Help")).toBeInTheDocument();
  expect(screen.getByText("Help")).toBeInTheDocument();
  expect(screen.getByText("Terms and Condition")).toBeInTheDocument();
  expect(screen.getByText("Privacy")).toBeInTheDocument();
  expect(screen.getByText("Contact Us")).toBeInTheDocument();
 });

 it("Render Social Media Section on Footer", () => {
  const socMedSection = screen.getByTestId("socials-media");

  expect(socMedSection.children).toHaveLength(3);
  expect(screen.getByText("Follow")).toBeInTheDocument();
  expect(screen.getByTitle("Github")).toBeInTheDocument();
  expect(screen.getByTitle("Linkedin")).toBeInTheDocument();
 });

 it("Render Apps Section on Footer", () => {
  const appsSection = screen.getByTestId("apps");

  expect(appsSection.children).toHaveLength(4);
  expect(screen.getByText("Download Apps")).toBeInTheDocument();
  expect(screen.getByText("Google Play")).toBeInTheDocument();
  expect(screen.getByText("App Store")).toBeInTheDocument();
  expect(screen.getByText("AppGallery")).toBeInTheDocument();
 });
});
