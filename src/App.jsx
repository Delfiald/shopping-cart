import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Footer from "./components/Footer/Footer";
import { fetchData } from "./services/fakeStoreAPI";
import Header from "./components/Header/Header";
import { getItem } from "./utils/localStorage";
import Feedback from "./components/Feedback/Feedback";

function App() {
 const [cartItem, setCartItem] = useState([]);
 const [wishlistItem, setWishlistItem] = useState([]);
 const [notificationItem, setNotificationItem] = useState([]);
 const [hoverButton, setHoverButton] = useState(null);
 const [searchInput, setSearchInput] = useState("");

 const [error, setError] = useState(null);
 const [loading, setLoading] = useState(null);

 const [categories, setCategories] = useState([]);
 const [products, setProducts] = useState([]);

 const [isExiting, setIsExiting] = useState(false);

 const handleProducts = (productsData) => {
  setProducts(productsData);
 };

 const handleCategories = (categoriesData) => {
  setCategories(categoriesData);
 };

 useEffect(() => {
  const fetchDataFromAPI = async () => {
   const productsData = await fetchData(setError, setLoading).getAllProducts();
   const categoriesData = await fetchData(
    setError,
    setLoading
   ).getProductsCategory();
   handleProducts(productsData);
   handleCategories(categoriesData);
  };

  fetchDataFromAPI();
 }, []);

 useEffect(() => {
  const savedCart = getItem("cart");
  const savedWishlist = getItem("wishlist");
  const savedNotification = getItem("notification");

  if (savedCart && Array.isArray(savedCart)) {
   setCartItem(savedCart);
  }

  if (savedWishlist && Array.isArray(savedWishlist)) {
   setWishlistItem(savedWishlist);
  }

  if (savedNotification && Array.isArray(savedNotification)) {
   setNotificationItem(savedNotification);
  }
 }, []);

 const ScrollToTop = () => {
  const { pathname } = useLocation();
  const [previousPath, setPreviousPath] = useState(pathname);

  useEffect(() => {
   if (previousPath !== pathname) {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setPreviousPath(pathname);
   }
  }, [pathname, previousPath]);

  return null;
 };

 return (
  <>
   <Header
    products={products}
    cartItem={cartItem}
    wishlistItem={wishlistItem}
    notificationItem={notificationItem}
    setNotificationItem={setNotificationItem}
    hoverButton={hoverButton}
    setHoverButton={setHoverButton}
    searchInput={searchInput}
    setSearchInput={setSearchInput}
    setIsExiting={setIsExiting}
   />
   <ScrollToTop />
   <Outlet
    context={{
     categories,
     products,
     hoverButton,
     setHoverButton,
     cartItem,
     setCartItem,
     wishlistItem,
     setWishlistItem,
     notificationItem,
     setNotificationItem,
     searchInput,
     isExiting,
     setIsExiting,
    }}
   />
   <Feedback error={error} setError={setError} loading={loading} />
   <Footer />
  </>
 );
}

export default App;
