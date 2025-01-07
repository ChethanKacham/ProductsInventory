import React, { useState, useEffect } from "react";
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { fireDB } from "../firebaseConfig";
import "../styles/InventoryManagement.css";
import Loader from "./Loader";

function InventoryManagement() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [formValues, setFormValues] = useState({
    name: "",
    price: "",
    description: "",
    category: "",
    quantity: "",
    manufacturer: "",
    imageURL: "",
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const querySnapshot = await getDocs(collection(fireDB, "products"));
      const productsArray = [];
      querySnapshot.forEach((doc) => {
        productsArray.push({ id: doc.id, ...doc.data() });
      });
      setProducts(productsArray);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching products:", error);
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (editProduct) {
        const productRef = doc(fireDB, "products", editProduct.id);
        await updateDoc(productRef, formValues);
      } else {
        await addDoc(collection(fireDB, "products"), formValues);
      }
      fetchProducts();
      resetForm();
      setShowModal(false);
    } catch (error) {
      console.error("Error saving product:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product) => {
    setEditProduct(product);
    setFormValues(product);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm("Are you sure you want to delete this product?");
    if (confirmed) {
      try {
        setLoading(true);
        await deleteDoc(doc(fireDB, "products", id));
        fetchProducts();
      } catch (error) {
        console.error("Error deleting product:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  const resetForm = () => {
    setEditProduct(null);
    setFormValues({
      name: "",
      price: "",
      description: "",
      category: "",
      quantity: "",
      manufacturer: "",
      imageURL: "",
    });
  };

  return (
    <div className="inventory-management">
      <h2 className="title">Inventory Management</h2>
      <button className="btn-add" onClick={() => setShowModal(true)}>
        Add Product
      </button>

      {loading ? (
        <Loader />
      ) : (
        <div className="product-table">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Price</th>
                <th>Category</th>
                <th>Quantity</th>
                <th>Manufacturer</th>
                <th>Description</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id}>
                  <td>{product.name}</td>
                  <td>₹{product.price}</td>
                  <td>{product.category}</td>
                  <td>{product.quantity}</td>
                  <td>{product.manufacturer}</td>
                  <td>{product.description}</td>
                  <td>
                    <button onClick={() => handleEdit(product)} className="btn-edit">
                      Edit
                    </button>
                    <button onClick={() => handleDelete(product.id)} className="btn-delete">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>{editProduct ? "Edit Product" : "Add Product"}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="name">Name:</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formValues.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="price">Price:</label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={formValues.price}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="description">Description:</label>
                <textarea
                  id="description"
                  name="description"
                  value={formValues.description}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="category">Category:</label>
                <input
                  type="text"
                  id="category"
                  name="category"
                  value={formValues.category}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="quantity">Quantity:</label>
                <input
                  type="number"
                  id="quantity"
                  name="quantity"
                  value={formValues.quantity}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="manufacturer">Manufacturer:</label>
                <input
                  type="text"
                  id="manufacturer"
                  name="manufacturer"
                  value={formValues.manufacturer}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="imageURL">Image URL:</label>
                <input
                  type="text"
                  id="imageURL"
                  name="imageURL"
                  value={formValues.imageURL}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-buttons">
                <button type="submit" className="btn-submit">
                  {editProduct ? "Update" : "Add"}
                </button>
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={() => {
                    resetForm();
                    setShowModal(false);
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default InventoryManagement;
