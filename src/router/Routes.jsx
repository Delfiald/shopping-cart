import App from "../App";
import Cart from "../pages/Cart/Cart";
import Home from "../pages/Home/Home";
import Product from "../pages/Product/Product";
import Shop from "../pages/Shop/Shop";
import ErrorPage from "./ErrorPage";

const Routes = [
 {
  path: "/",
  element: <App />,
  errorElement: <ErrorPage />,
  children: [
   { index: true, element: <Home /> },
   { path: "cart", element: <Cart /> },
   { path: "shop", element: <Shop /> },
   { path: "product:id", element: <Product /> },
  ],
 },
];

export default Routes;
