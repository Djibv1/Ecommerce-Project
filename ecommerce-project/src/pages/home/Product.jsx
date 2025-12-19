import { formatMoney } from "../../utils/money";
import axios from "axios";
import { useState, useEffect } from "react";
import HeartIcon from "../../assets/heart.png";
import FilledHeartIcon from "../../assets/filled-heart.png";

export function Product({ product, loadCart }) {
  const [quantity, setQuantity] = useState(1);
  const [showAddedMessage, setShowAddedMessage] = useState(false);
  const [liked, setLiked] = useState(false);

  // Charger l'état du favori au montage du composant
  useEffect(() => {
    const key = `favorite_${product.id}`;
    const stored = localStorage.getItem(key);
    setLiked(stored !== null);
  }, [product.id]);

  const addToCart = async () => {
    await axios.post("/api/cart-items", {
      productId: product.id,
      quantity,
    });
    await loadCart();
    setShowAddedMessage(true);

    setTimeout(() => {
      setShowAddedMessage(false);
    }, 2000);
  };

  const selectQuantity = (event) => {
    const quantitySelected = Number(event.target.value);
    setQuantity(quantitySelected);
  };

  const toggleFavorite = () => {
    const key = `favorite_${product.id}`;

    if (liked) {
      // Retirer des favoris
      localStorage.removeItem(key);
      setLiked(false);
      console.log(`Produit ${product.id} retiré des favoris`);
    } else {
      // Ajouter aux favoris
      const favoriteData = {
        productId: product.id,
        name: product.name,
        image: product.image,
        priceCents: product.priceCents,
        addedAt: new Date().toISOString(),
      };
      localStorage.setItem(key, JSON.stringify(favoriteData));
      setLiked(true);
      console.log(`Produit ${product.id} ajouté aux favoris`);
    }
  };

  return (
    <div className="product-container" data-testid="product-container">
      <div className="product-image-container">
        <img
          className="product-image"
          data-testid="product-image"
          src={product.image}
          alt={product.name}
        />
      </div>

      <div className="product-name limit-text-to-2-lines">{product.name}</div>

      <div className="product-rating-container">
        <img
          className="product-rating-stars"
          data-testid="product-rating-stars-image"
          src={`images/ratings/rating-${product.rating.stars * 10}.png`}
          alt={`Rating: ${product.rating.stars} stars`}
        />
        <div className="product-rating-count link-primary">
          {product.rating.count}
        </div>
      </div>

      <div className="product-price">{formatMoney(product.priceCents)}</div>

      <div className="quantity-favorite-container">
        <div className="product-quantity-container">
          <select value={quantity} onChange={selectQuantity}>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
            <option value="6">6</option>
            <option value="7">7</option>
            <option value="8">8</option>
            <option value="9">9</option>
            <option value="10">10</option>
          </select>
        </div>
        <div className="product-favorite-icon">
          <img
            className="favorite-icon"
            src={liked ? FilledHeartIcon : HeartIcon}
            onClick={toggleFavorite}
            alt={liked ? "Retirer des favoris" : "Ajouter aux favoris"}
            style={{ cursor: "pointer" }}
          />
        </div>
      </div>
      <div className="product-spacer"></div>

      <div
        className="added-to-cart"
        style={{ opacity: showAddedMessage ? 1 : 0 }}
      >
        <img src="images/icons/checkmark.png" alt="Added" />
        Added
      </div>

      <button
        className="add-to-cart-button button-primary"
        onClick={addToCart}
        data-testid="add-to-cart-button"
      >
        Add to Cart
      </button>
    </div>
  );
}
