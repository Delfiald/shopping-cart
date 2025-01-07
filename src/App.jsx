import { useState } from "react";
import { Outlet } from "react-router-dom";

function App() {
 const [cartItem, setCartItem] = useState([]);
 const [cartOpen, setCartOpen] = useState(false);

 return <Outlet context={{ cartItem, cartOpen, setCartOpen }} />;
}

export default App;
