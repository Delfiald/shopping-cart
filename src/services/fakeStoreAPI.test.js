import { fetchData } from "./fakeStoreAPI";

describe("Test Fake Store API Fetching", () => {
 it("Returns data successfully when response is OK", async () => {
  const mockData = {
   id: 1,
   title: "Product 1",
   description: "lorem lorem lorem lorem lorem lorem",
  };
  vi.spyOn(globalThis, "fetch").mockResolvedValueOnce({
   ok: true,
   json: async () => mockData,
  });

  const setError = vi.fn();
  const setLoading = vi.fn();

  const products = await fetchData(setError, setLoading).getAllProducts();
  expect(products).toEqual(mockData);
  expect(fetch).toHaveBeenCalledWith("https://fakestoreapi.com/products");
 });
});
