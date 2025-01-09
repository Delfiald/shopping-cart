const BASE_URL = "https://fakestoreapi.com/products";

const structureCheck = (data) => {
 const checkProductStructure = (product) => {
  if (!("id" in product)) {
   console.error("Invalid response structure: Missing 'id' field");
   throw new Error(
    "Sorry, we couldn't fetch the product details. Please try again later."
   );
  }
 };

 const allProducts = () => {
  if (Array.isArray(data)) {
   data.forEach(checkProductStructure);
  } else {
   checkProductStructure(data);
  }
 };

 return {
  allProducts,
 };
};

const fakeStoreAPI = async (request) => {
 const response = await fetch(`${request}`);
 if (!response.ok) {
  throw new Error(
   `Failed to fetch data. HTTP Status: ${response.status} - ${
    response.statusText || "No status text available"
   }.`
  );
 }

 const data = await response.json();

 return data;
};

export const fetchData = (setError, setLoading) => {
 const getAllProducts = async () => {
  setLoading(true);
  try {
   const products = await fakeStoreAPI(BASE_URL);
   structureCheck(products).allProducts();
   return products;
  } catch (error) {
   setError(error.message);
   return null;
  } finally {
   setLoading(false);
  }
 };

 const getProductById = async (id) => {
  setLoading(true);
  try {
   const product = await fakeStoreAPI(`${BASE_URL}/${id}`);
   structureCheck(product).allProducts();
   return product;
  } catch (error) {
   setError(error.message);
   return null;
  } finally {
   setLoading(false);
  }
 };

 const getProductsCategory = async () => {
  setLoading(true);
  try {
   const categories = await fakeStoreAPI(`${BASE_URL}/categories`);
   return categories;
  } catch (error) {
   setError(error.message);
  } finally {
   setLoading(false);
  }
 };

 const getProductsBasedOnCategory = async (category) => {
  setLoading(true);
  try {
   const products = await fakeStoreAPI(`${BASE_URL}/category/${category}`);
   structureCheck(products).allProducts();

   return products;
  } catch (error) {
   setError(error.message);
  } finally {
   setLoading(false);
  }
 };

 return {
  getAllProducts,
  getProductById,
  getProductsCategory,
  getProductsBasedOnCategory,
 };
};
