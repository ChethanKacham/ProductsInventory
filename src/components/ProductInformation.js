import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getDoc, doc } from "firebase/firestore";
import { fireDB } from "../firebaseConfig";
import "../styles/ProductInformation.css";
import Loader from "./Loader";

function ProductInformation() {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const { id } = useParams();

  useEffect(() => {
    fetchProduct();
  }, []);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const productDoc = await getDoc(doc(fireDB, "products", id));
      if (productDoc.exists()) {
        setProduct(productDoc.data());
      } else {
        console.error("No such product found!");
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching product details:", error);
      setLoading(false);
    }
  };

  return (
    <div className="product-info-page">
      {loading ? (
        <Loader />
      ) : product ? (
        <div className="product-info-container">
          <img
            src={product.imageURL}
            alt={product.name}
            className="product-info-image"
          />
          <h1 className="product-info-title">{product.name}</h1>
          <p className="product-info-description">{product.description}</p>
          <h3 className="product-info-price">Price: ₹{product.price}</h3>
        </div>
      ) : (
        <p className="error-message">Product not found.</p>
      )}
    </div>
  );
}

export default ProductInformation;
