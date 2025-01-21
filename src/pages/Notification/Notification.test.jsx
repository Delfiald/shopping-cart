import { render } from "@testing-library/react";
import { MemoryRouter, Outlet, Route, Routes } from "react-router-dom";
import Notification from "./Notification";

const generateMockProducts = (num) => {
 const mockProducts = [];

 for (let i = 1; i <= num; i++) {
  mockProducts.push({
   id: i,
   title: `product-${i}`,
   image: `/image/product-${i}.png`,
   price: 100 + (i % 10) * 10,
   category: `category-${(i % 5) + 1}`,
  });
 }
 return mockProducts;
};

const generateMockCartItem = (num) => {
 const products = [];
 for (let i = 1; i <= num; i++) {
  products.push({
   id: i,
   amount: 1,
  });
 }
 return products;
};

const generateMockNotification = (num) => {
 const mockNotification = [];

 for (let i = 1; i <= num; i++) {
  mockNotification.push({
   id: i,
   message: `purchase complete`,
   products: [...generateMockCartItem(2)],
   timeStamp: "01/01/2025 12:21",
   isRead: false,
  });
 }
 return mockNotification;
};

describe("Test Notification Page", () => {
 it("Should Render Notification Page", () => {
  const { container } = render(
   <MemoryRouter>
    <Routes>
     <Route
      path="/"
      element={
       <Outlet
        context={{
         products: generateMockProducts(5),
         notificationItem: generateMockNotification(2),
         setNotificationItem: vi.fn(),
        }}
       />
      }
     >
      <Route path="/notification" element={<Notification />} />
     </Route>
    </Routes>
   </MemoryRouter>
  );

  expect(container).toMatchSnapshot();
 });
});
