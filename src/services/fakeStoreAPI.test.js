import { expect, it, vi } from "vitest";
import { fetchData } from "./fakeStoreAPI";

const mockData = [
 {
  id: 1,
  title: "Product 1",
  description: "lorem lorem lorem lorem lorem lorem",
  category: "category1",
 },
 {
  id: 2,
  title: "Product 2",
  description: "lorem lorem lorem lorem lorem lorem 2",
  category: "category2",
 },
 {
  id: 3,
  title: "Product 3",
  description: "lorem lorem lorem lorem lorem lorem 3",
  category: "category1",
 },
];

const BASE_URL = "https://fakestoreapi.com/products";

describe("Test Fake Store API Fetching", () => {
 afterEach(() => {
  vi.restoreAllMocks();
 });

 it("Returns data successfully when response is OK", async () => {
  vi.spyOn(globalThis, "fetch").mockResolvedValueOnce({
   ok: true,
   json: async () => mockData,
  });

  const setError = vi.fn();
  const setLoading = vi.fn();

  const products = await fetchData(setError, setLoading).getAllProducts();
  expect(products).toEqual(mockData);
  expect(fetch).toHaveBeenCalledWith(BASE_URL);
 });

 it("Should return null, call setError with the correct message, and toggle setLoading when response is not OK", async () => {
  vi.spyOn(globalThis, "fetch").mockResolvedValueOnce({
   ok: false,
   status: 999,
  });

  const setError = vi.fn();
  const setLoading = vi.fn();

  const products = await fetchData(setError, setLoading).getAllProducts();
  expect(products).toBeNull();
  expect(setError).toHaveBeenCalledOnce();
  expect(setError).toHaveBeenCalledWith(
   "Failed to fetch data. HTTP Status: 999 - No status text available."
  );

  expect(setLoading).toHaveBeenCalledTimes(2);
  expect(setLoading).toHaveBeenCalledWith(true);
  expect(setLoading).toHaveBeenCalledWith(false);
 });

 it("Should handle error when API returns 404", async () => {
  vi.spyOn(globalThis, "fetch").mockResolvedValueOnce({
   ok: false,
   status: 404,
   statusText: "Not Found",
  });

  const setError = vi.fn();
  const setLoading = vi.fn();

  const product = await fetchData(setError, setLoading).getAllProducts();

  expect(product).toBeNull();
  expect(setError).toHaveBeenCalledOnce();
  expect(setError).toHaveBeenCalledWith(
   "Failed to fetch data. HTTP Status: 404 - Not Found."
  );
  expect(fetch).toHaveBeenCalledWith(`${BASE_URL}`);
 });

 it("Should handle 500 error when server fails", async () => {
  vi.spyOn(globalThis, "fetch").mockResolvedValueOnce({
   ok: false,
   status: 500,
   statusText: "Internal Server Error",
   json: async () => mockData[1],
  });

  const setError = vi.fn();
  const setLoading = vi.fn();

  const product = await fetchData(setError, setLoading).getAllProducts();

  expect(product).toBeNull();
  expect(fetch).toHaveBeenCalledWith(`${BASE_URL}`);
  expect(setError).toHaveBeenCalledOnce();
  expect(setError).toHaveBeenCalledWith(
   "Failed to fetch data. HTTP Status: 500 - Internal Server Error."
  );
 });

 it("Should handle network failure or timeout", async () => {
  vi
   .spyOn(globalThis, "fetch")
   .mockRejectedValueOnce(new Error("Network Error"));

  const setError = vi.fn();
  const setLoading = vi.fn();

  await fetchData(setError, setLoading).getAllProducts();

  expect(setError).toHaveBeenCalledWith("Network Error");
  expect(setLoading).toHaveBeenCalledTimes(2);
 });

 it("Should handle invalid response structure", async () => {
  vi.spyOn(globalThis, "fetch").mockResolvedValueOnce({
   ok: true,
   json: async () => ({ invalidKey: "invalidValue" }),
  });

  const setError = vi.fn();
  const setLoading = vi.fn();

  const products = await fetchData(setError, setLoading).getAllProducts();

  expect(setError).toHaveBeenCalledWith(
   "Sorry, we couldn't fetch the product details. Please try again later."
  );
  expect(products).toBeNull();
  expect(setLoading).toHaveBeenCalledTimes(2);
 });

 it("Should handle missing required field (e.g. missing 'id')", async () => {
  vi.spyOn(globalThis, "fetch").mockResolvedValueOnce({
   ok: true,
   json: async () => [{ title: "Product without id" }],
  });

  const setError = vi.fn();
  const setLoading = vi.fn();

  const products = await fetchData(setError, setLoading).getAllProducts();
  expect(setError).toHaveBeenCalledWith(
   "Sorry, we couldn't fetch the product details. Please try again later."
  );
  expect(products).toBeNull();
  expect(setLoading).toHaveBeenCalledTimes(2);
 });

 it("Should handle empty response", async () => {
  vi.spyOn(globalThis, "fetch").mockResolvedValueOnce({
   ok: true,
   json: async () => [],
  });

  const setError = vi.fn();
  const setLoading = vi.fn();

  const products = await fetchData(setError, setLoading).getAllProducts();
  expect(products).toEqual([]);
  expect(setLoading).toHaveBeenCalledTimes(2);
 });

 it("Should return product with valid properties", async () => {
  vi.spyOn(globalThis, "fetch").mockResolvedValueOnce({
   ok: true,
   json: async () => mockData[0],
  });

  const setError = vi.fn();
  const setLoading = vi.fn();

  const product = await fetchData(setError, setLoading).getAllProducts();

  expect(product).toHaveProperty("id", 1);
  expect(product).toHaveProperty("title", "Product 1");
  expect(product).toHaveProperty(
   "description",
   "lorem lorem lorem lorem lorem lorem"
  );
 });

 it("Should fetch categories and return it", async () => {
  const mockCategories = ["category 1", "category 2", "category 3"];
  vi.spyOn(globalThis, "fetch").mockResolvedValueOnce({
   ok: true,
   json: async () => mockCategories,
  });

  const setError = vi.fn();
  const setLoading = vi.fn();

  const categories = await fetchData(
   setError,
   setLoading
  ).getProductsCategory();

  expect(categories).toBe(mockCategories);
  expect(fetch).toHaveBeenCalledWith(`${BASE_URL}/categories`);
  expect(setLoading).toHaveBeenCalledTimes(2);
  expect(setLoading).toHaveBeenCalledWith(true);
  expect(setLoading).toHaveBeenCalledWith(false);
 });
});
