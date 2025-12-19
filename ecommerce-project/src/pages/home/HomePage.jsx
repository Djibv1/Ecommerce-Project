import axios from "axios";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import { Header } from "../../components/Header";
import { ProductsGrid } from "./ProductsGrid";
import "./HomePage.css";
import { Link } from "react-router";

export function HomePage({ cart, loadCart }) {
  const [products, setProducts] = useState([]);
  const [searchParams] = useSearchParams();
  const search = searchParams.get("search");

  useEffect(() => {
    const getHomeData = async () => {
      const urlPath = search
        ? `/api/products?search=${search}`
        : "/api/products";
      const response = await axios.get(urlPath);
      setProducts(response.data);
    };
    getHomeData();
  }, [search]);

  return (
    <>
      <title>Ecommerce Project </title>
      <Header cart={cart} />
      <div className="home-page">
        <ProductsGrid loadCart={loadCart} products={products} search={search} />
      </div>
      <div className="footer">
        <div className="footer-div company">
          <h3>Company</h3>
          <ul>
            <li>
              <Link to="/">About</Link>
            </li>
            <li>
              <Link to="/">Team</Link>
            </li>
            <li>
              <Link to="/">Contact</Link>
            </li>
            <li>
              <Link to="/">Blog</Link>
            </li>
          </ul>
        </div>
        <div className="footer-div product">
          <h3>Product</h3>
          <ul>
            <li>
              <Link to="/">Pricing</Link>
            </li>
            <li>
              <Link to="/">Return Policy</Link>
            </li>
            <li>
              <Link to="/">Clothing-size chart</Link>
            </li>
          </ul>
        </div>
        <div className="footer-div ressources">
          <h3>Ressources</h3>
          <ul>
            <li>
              <Link to="/">Help</Link>
            </li>
            <li>
              <Link to="/">Twitter</Link>
            </li>
            <li>
              <Link to="/">Instagram</Link>
            </li>
            <li>
              <Link to="/">Facebook</Link>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}
