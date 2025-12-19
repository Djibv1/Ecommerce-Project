import { HomePage } from "./pages/home/HomePage";
import { useEffect, useState } from "react";
import axios from "axios";

import { Routes, Route } from "react-router";
import { CheckoutPage } from "./pages/checkout/CheckoutPage";
import { OrdersPage } from "./pages/orders/OrdersPage";
import { TrackingPage } from "./pages/orders/TrackingPage";
import { NotFoundPage } from "./pages/home/NotFoundPage";
import { FavoritePage } from "./pages/home/FavoritePage";

import "./App.css";

function App() {
  const [cart, setCart] = useState([]);
  const loadCart = async () => {
    const response = await axios.get("/api/cart-items?expand=product");
    setCart(response.data);
  };

  const clearCart = async () => {
    try {
      // Utiliser productId comme dans deleteCartItem
      const deletePromises = cart.map((cartItem) =>
        axios.delete(`/api/cart-items/${cartItem.productId}`)
      );

      await Promise.all(deletePromises);
      await loadCart();
    } catch (error) {
      console.error("Erreur lors de la suppression du panier:", error);
    }
  };

  useEffect(() => {
    loadCart();
  }, []);

  return (
    <Routes>
      <Route
        index
        element={<HomePage loadCart={loadCart} cart={cart} />}
      ></Route>
      <Route
        path="checkout"
        element={
          <CheckoutPage cart={cart} loadCart={loadCart} clearCart={clearCart} />
        }
      />
      <Route
        path="orders"
        element={<OrdersPage loadCart={loadCart} cart={cart} />}
      />
      <Route
        path="tracking/:orderId/:productId"
        element={<TrackingPage cart={cart} />}
      />
      <Route path="*" element={<NotFoundPage cart={cart} />} />
      <Route
        path="favorite"
        element={<FavoritePage loadCart={loadCart} cart={cart} />}
      />
    </Routes>
  );
}

export default App;
