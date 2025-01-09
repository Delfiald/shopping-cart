import { useState } from "react";
import { Outlet } from "react-router-dom";
import Footer from "./components/Footer/Footer";

function App() {
 const [cartItem, setCartItem] = useState([]);
 const [notificationItem, setNotificationItem] = useState([]);
 const [hoverButton, setHoverButton] = useState(null);
 const [searchInput, setSearchInput] = useState("");

 return (
  <>
   <Outlet
    context={{
     cartItem,
     notificationItem,
     hoverButton,
     setHoverButton,
     searchInput,
     setSearchInput,
    }}
   />
   <Footer />
  </>
 );
}

export default App;
