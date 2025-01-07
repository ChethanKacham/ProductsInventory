import React, { useEffect, useState } from "react";
import { collection, getDocs, doc, getDoc, updateDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { fireDB } from "../firebaseConfig";
import SearchBar from "./SearchBar";
import "../styles/HomePage.css";
import Loader from "./Loader";

function HomePage() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    filterAndSearchProducts();
  }, [searchTerm]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const querySnapshot = await getDocs(collection(fireDB, "products"));
      const productArray = [];
      querySnapshot.forEach((doc) => {
        productArray.push({ id: doc.id, ...doc.data() });
      });
      setProducts(productArray);
      setFilteredProducts(productArray);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching products:", error);
      setLoading(false);
    }
  };

  const filterAndSearchProducts = (filters = {}) => {
    let tempProducts = products;

    // Search by Name
    if (searchTerm) {
      tempProducts = tempProducts.filter((product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by Category
    if (filters.category) {
      tempProducts = tempProducts.filter(
        (product) => product.category === filters.category
      );
    }

    // Filter by Price Range
    if (filters.minPrice) {
      tempProducts = tempProducts.filter(
        (product) => product.price >= parseInt(filters.minPrice)
      );
    }
    if (filters.maxPrice) {
      tempProducts = tempProducts.filter(
        (product) => product.price <= parseInt(filters.maxPrice)
      );
    }

    setFilteredProducts(tempProducts);
  };

  const handleSort = (sortBy) => {
    const sortedProducts = [...filteredProducts];

    if (sortBy === "name-asc") {
      sortedProducts.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === "name-desc") {
      sortedProducts.sort((a, b) => b.name.localeCompare(a.name));
    } else if (sortBy === "price-asc") {
      sortedProducts.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-desc") {
      sortedProducts.sort((a, b) => b.price - a.price);
    }

    setFilteredProducts(sortedProducts);
  };

  const handleFilter = (filters) => {
    filterAndSearchProducts(filters);
  };

  const incrementProductView = async (productId) => {
    try {
      const productRef = doc(fireDB, "products", productId);
      const productSnapshot = await getDoc(productRef);
  
      if (productSnapshot.exists()) {
        const currentCount = productSnapshot.data().count || 0;
        await updateDoc(productRef, {
          count: currentCount + 1,
        });
        console.log(`Product view count updated for ID: ${productId}`);
      }
    } catch (error) {
      console.error("Error updating product view count:", error);
    }
  };

  const handleViewDetails = (productId) => {
    incrementProductView(productId);
    navigate(`/product/${productId}`);
  };

  return (
    <div className="homepage">
      {loading ? (
        <Loader />
      ) : (
        <div className="container">
          <SearchBar
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            handleSort={handleSort}
            handleFilter={handleFilter}
          />
          <div className="product-grid">
            {filteredProducts.map((product) => (
              <div key={product.id} className="product-card">
                <img
                  src={product.imageURL}
                  alt={product.name}
                  className="product-image"
                />
                <h3 className="product-name">{product.name}</h3>
                <p className="product-price">₹{product.price}</p>
                <button
                  className="view-details"
                  onClick={() => handleViewDetails(product.id)}
                >
                  View Details
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default HomePage;
