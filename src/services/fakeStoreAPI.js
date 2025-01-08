const BASE_URL = "https://fakestoreapi.com/products";

const fakeStoreAPI = async (request) => {
 const response = await fetch(`${request}`);
 if (!response.ok) {
  throw new Error("Failed to fetch Data");
 }

 const data = await response.json();
 return data;
};

export const fetchData = (setError, setLoading) => {
 const getAllProducts = async () => {
  setLoading(true);
  try {
   const products = await fakeStoreAPI(BASE_URL);
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
   return product;
  } catch (error) {
   setError(error.message);
   return null;
  } finally {
   setLoading(false);
  }
 };

 return {
  getAllProducts,
  getProductById,
 };
};
