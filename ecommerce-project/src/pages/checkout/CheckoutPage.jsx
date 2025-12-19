import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router";
import Logo from "../../assets/images/logo.png";
import CheckoutLock from "../../assets/images/icons/checkout-lock-icon.png";
import "./checkout-header.css";
import "./CheckoutPage.css";

import MobileLogo from "../../assets/images/logo.png";
import { OrderSummary } from "./OrderSummary";
import { PaymentSummary } from "./PaymentSummary";

export function CheckoutPage({ cart, loadCart, clearCart }) {
  const [deliveryOptions, setDeliveryOptions] = useState([]);
  const [paymentSummary, setPaymentSummary] = useState([]);
  const [isClearing, setIsClearing] = useState(false);

  useEffect(() => {
    const FetchCheckoutData = async () => {
      let response = await axios.get(
        "/api/delivery-options?expand=estimatedDeliveryTime"
      );
      setDeliveryOptions(response.data);

      response = await axios.get("/api/payment-summary");
      setPaymentSummary(response.data);
    };
    FetchCheckoutData();
  }, [cart]);

  const handleClearCart = async () => {
    if (cart.length === 0) return;

    if (window.confirm("Êtes-vous sûr de vouloir vider le panier ?")) {
      setIsClearing(true);
      await clearCart();
      setIsClearing(false);
    }
  };

  return (
    <>
      <title>Checkout</title>

      <div className="checkout-header">
        <div className="header-content">
          <div className="checkout-header-left-section">
            <Link to="/">
              <img className="logo" src={Logo} />
              <img className="mobile-logo" src={MobileLogo} />
            </Link>
          </div>
          <div className="checkout-header-middle-section">
            Checkout (
            <Link className="return-to-home-link" to="/">
              {paymentSummary.totalItems} items
            </Link>
            )
          </div>
          <div className="checkout-header-right-section">
            <img src={CheckoutLock} />
          </div>
        </div>
      </div>

      <div className="checkout-page">
        <div className="title-and-button">
          <p className="checkout-title">Review your order</p>
          <button
            className="button-clear-cart"
            onClick={handleClearCart}
            disabled={cart.length === 0 || isClearing}
          >
            {isClearing ? "Suppression..." : "Clear Cart"}
          </button>
        </div>
        {isClearing && (
          <div className="cart-cleared-message">✓ Panier vidé avec succès</div>
        )}
        <div className="checkout-grid">
          <OrderSummary
            cart={cart}
            deliveryOptions={deliveryOptions}
            loadCart={loadCart}
          />
          <PaymentSummary paymentSummary={paymentSummary} loadCart={loadCart} />
        </div>
      </div>
    </>
  );
}
