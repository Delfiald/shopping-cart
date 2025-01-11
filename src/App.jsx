import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import Footer from "./components/Footer/Footer";
import { fetchData } from "./services/fakeStoreAPI";
import Header from "./components/Header/Header";

function App() {
 const [cartItem, setCartItem] = useState([]);
 const [notificationItem, setNotificationItem] = useState([]);
 const [hoverButton, setHoverButton] = useState(null);
 const [searchInput, setSearchInput] = useState("");

 const [error, setError] = useState(null);
 const [loading, setLoading] = useState(null);

 const [categories, setCategories] = useState([]);
 const [products, setProducts] = useState([]);

 //  const handleProducts = (productsData) => {
 //   setProducts(productsData)
 //  }

 //  const handleCategories = (categoriesData) => {
 //   setCategories(categoriesData)
 //  }

 //  useEffect(() => {
 //   const fetchDataFromAPI = async() => {
 //     const productsData = await fetchData(setError, setLoading).getAllProducts();
 //     const categoriesData = await fetchData(setError, setLoading).getProductsCategory();
 //     handleProducts(productsData)
 //     handleCategories(categoriesData)
 //   }

 //   fetchDataFromAPI()
 //  }, [])

 return (
  <>
   <Header
    cartItem={cartItem}
    notificationItem={notificationItem}
    hoverButton={hoverButton}
    setHoverButton={setHoverButton}
    searchInput={searchInput}
    setSearchInput={setSearchInput}
   />
   <Outlet
    context={{
     categories,
     products,
    }}
   />
   <Footer />
  </>
 );
}

export default App;
