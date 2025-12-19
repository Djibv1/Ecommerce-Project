import { useState, useEffect } from "react";
import { formatMoney } from "../../utils/money";
import axios from "axios";
import FilledHeartIcon from "../../assets/filled-heart.png";
import { Link } from "react-router";
import "../checkout/checkout-header.css";
import "../checkout/CheckoutPage.css";
import Logo from "../../assets/images/logo.png";
import MobileLogo from "../../assets/images/logo.png";
import HeartIcon from "../../assets/heart.png";

import "./FavoritePage.css";

export function FavoritePage() {
  const [favorites, setFavorites] = useState([]);
  const [showAddedMessage, setShowAddedMessage] = useState(null);

  // Charger tous les favoris depuis localStorage
  const loadFavorites = () => {
    const allFavorites = [];

    // Parcourir toutes les clés du localStorage
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);

      // Ne récupérer que les clés qui commencent par "favorite_"
      if (key && key.startsWith("favorite_")) {
        try {
          const item = localStorage.getItem(key);
          if (item) {
            const favoriteData = JSON.parse(item);
            allFavorites.push(favoriteData);
          }
        } catch (error) {
          console.error(`Erreur lors du chargement du favori ${key}:`, error);
        }
      }
    }

    setFavorites(allFavorites);
  };

  // Charger les favoris au montage et écouter les changements
  useEffect(() => {
    loadFavorites();

    // Recharger les favoris lorsque le localStorage change
    const handleStorageChange = () => {
      loadFavorites();
    };

    window.addEventListener("storage", handleStorageChange);

    // Vérifier périodiquement (pour les changements dans le même onglet)
    const interval = setInterval(loadFavorites, 1000);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  // Retirer un produit des favoris
  const removeFavorite = (productId) => {
    const key = `favorite_${productId}`;
    localStorage.removeItem(key);
    loadFavorites(); // Recharger la liste
  };

  // Ajouter au panier
  const addToCart = async (productId) => {
    try {
      await axios.post("/api/cart-items", {
        productId: productId,
        quantity: 1,
      });

      setShowAddedMessage(productId);
      setTimeout(() => {
        setShowAddedMessage(null);
      }, 2000);
    } catch (error) {
      console.error("Erreur lors de l'ajout au panier:", error);
    }
  };

  return (
    <>
      <title>Favorites </title>
      <div className="favorites-page">
        <div className="checkout-header">
          <div className="header-content">
            <div className="checkout-header-left-section">
              <Link to="/">
                <img className="logo" src={Logo} />
                <img className="mobile-logo" src={MobileLogo} />
              </Link>
            </div>
            <div className="checkout-header-middle-section">
              Favorites (
              <Link className="return-to-home-link" to="/">
                <div className="favorites-count return-to-home-link">
                  {favorites.length}{" "}
                  {favorites.length === 1 ? "products" : "products"}
                </div>{" "}
              </Link>
              )
            </div>
            <div className="checkout-header-right-section">
              <img src={HeartIcon} />
            </div>
          </div>
          <div className="checkout-header-right-section"></div>
        </div>
        <div className="page-header"></div>

        {favorites.length === 0 ? (
          <div className="empty-favorites">
            <h2>No favorites</h2>
            <p>Add products to your favorites and come check them here !</p>
          </div>
        ) : (
          <div className="favorites-grid">
            {favorites.map((favorite) => (
              <div
                key={favorite.productId}
                className="favorite-product-container"
                data-testid="favorite-product"
              >
                <div className="product-image-container">
                  <img
                    className="product-image"
                    src={favorite.image}
                    alt={favorite.name}
                  />
                  <button
                    className="remove-favorite-btn"
                    onClick={() => removeFavorite(favorite.productId)}
                    title="Retirer des favoris"
                  >
                    <img
                      src={FilledHeartIcon}
                      alt="Remove from favorites"
                      className="favorite-icon-filled"
                    />
                  </button>
                </div>

                <div className="product-name limit-text-to-2-lines">
                  {favorite.name}
                </div>

                <div className="product-price">
                  {formatMoney(favorite.priceCents)}
                </div>

                <div
                  className="added-to-cart"
                  style={{
                    opacity: showAddedMessage === favorite.productId ? 1 : 0,
                  }}
                >
                  <img src="images/icons/checkmark.png" alt="Added" />
                  Added
                </div>

                <button
                  className="add-to-cart-button button-primary"
                  onClick={() => addToCart(favorite.productId)}
                >
                  Add to cart
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
