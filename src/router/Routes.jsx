import App from "../App";
import ErrorPage from "./ErrorPage";

const Routes = [
 {
  path: "/",
  element: <App />,
  errorElement: <ErrorPage />,
 },
];

export default Routes;
