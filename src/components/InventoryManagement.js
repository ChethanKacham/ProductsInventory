import React, { useEffect, useState } from "react";
import {
    collection,
    addDoc,
    getDocs,
    setDoc,
    doc,
    deleteDoc,
} from "firebase/firestore";
import { fireDB, auth } from "../firebaseConfig";
import Layout from "../components/Layout";
import { Table, Button } from "react-bootstrap";
import { Modal, Tabs, Tab } from "react-bootstrap";
import { toast } from "react-toastify";
import {
    Form,
    Formik,
    ErrorMessage,
} from "formik";
import  FormGroup  from '@mui/material/FormGroup';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";

function InventoryManagement() {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchKey, setSearchKey] = useState("");
    const [filterType, setFilterType] = useState("");
    const [product, setProduct] = useState({
        name: "",
        description: "",
        manufacturer: "",
        price: "",
        imageURL: "",
        category: "",
        quantity: "",
    });
    const [add, setAdd] = useState(false);
    const [show, setShow] = useState(false);
    const [errMsg, setErrMsg] = useState("");
    const validationSchema = Yup.object({
        name: Yup.string().required("Required"),
        description: Yup.string().required("Required").min(8, "Minimum 8 characters"),
        manufacturer: Yup.string().required("Required"),
        price: Yup.number().required("Required"),
        quantity: Yup.number().required("Required"),
        category: Yup.string().required("Required"),
    });

    useEffect(() => {
        getData();
    }, []);

    async function getData() {
        try {
            setLoading(true);
            const products1 = await getDocs(collection(fireDB, "products"));
            const productsArray = [];
            products1.forEach((doc) => {
                const obj = {
                    id: doc.id,
                    ...doc.data(),
                };
                productsArray.push(obj);
            });
            setProducts(productsArray);
            setLoading(false);
        } catch (error) {
            console.log(error);
            setLoading(false);
        }
    }

    const handleClose = () => {
        setShow(false);
        setAdd(false);
        setProduct({
            name: "",
            description: "",
            manufacturer: "",
            price: "",
            quantity: "",
            imageURL: "",
            category: "",
        });
    };

    const handleShow = () => setShow(true);

    const isValidate = () => {
        let isValid = true;
        if (!product.name) {
            alert("Name is Required");
            isValid = false;
        } else if (!product.description) {
            alert("Description is Required");
            isValid = false;
        } else if (!product.manufacturer) {
            alert("Manufacturer is Required");
            isValid = false;
        } else if (!product.price) {
            setErrMsg("Price is Required");
            isValid = false;
        } else if (!product.quantity) {
            alert("Quantity is Required");
            isValid = false;
        } else if (!product.imageURL) {
            alert("Image URL is Required");
            isValid = false;
        } else if (!product.category) {
            alert("Category is Required");
            isValid = false;
        }

        return isValid;
    };

    const addHandler = () => {
        setAdd(true);
        handleShow();
    };

    const addProduct = async () => {
        if (isValidate()) {
            let addp = window.confirm("Are you sure to add the product?");
            if (addp) {
                try {
                    setLoading(true);
                    await addDoc(collection(fireDB, "products"), product);
                    // handleClose();
                    toast.success("Product added successfully");
                    window.location.reload();
                } catch (error) {
                    toast.error("Product add failed");
                    setLoading(false);
                }
            }
        }
    };

    const editHandler = (product1) => {
        setProduct(product1);
        setShow(true);
    };

    const updateProduct = async () => {
        if (isValidate()) {
            let update = window.confirm("Are you sure to update the product?");
            if (update) {
                try {
                    setLoading(true);
                    await setDoc(doc(fireDB, "products", product.id), product);
                    // handleClose();
                    toast.success("Product updated successfully");
                    window.location.reload();
                } catch (error) {
                    toast.error("Product update failed");
                }
                setLoading(false);
            }
        }
    };

    const deleteProduct = async (product1) => {
        let deletep = window.confirm("Are you sure to delete the product?");
        if (deletep) {
            try {
                setLoading(true);
                await deleteDoc(doc(fireDB, "products", product1.id));
                toast.success("Product deleted successfully");
                getData();
            } catch (error) {
                toast.failed("Product delete failed");
            }
            setLoading(false);
        }
    };

    const [customization, setCustomization] = useState(false);
    const [flagImage, setFlagImage] = useState(true);
    const [flagPrice, setFlagPrice] = useState(true);
    const [flagManufacturer, setFlagManufacturer] = useState(true);
    const [flagQuantity, setFlagQuantity] = useState(true);

    const handleFlagImage = () => setFlagImage(!flagImage);
    const handleFlagPrice = () => setFlagPrice(!flagPrice);
    const handleFlagManufacturer = () => setFlagManufacturer(!flagManufacturer);
    const handleCustomization = () => setCustomization(!customization);
    const handleFlagQuantity = () => setFlagQuantity(!flagQuantity);

    return (
        <Layout loading={loading}>
            <h3 align="center">Product Inventory Management</h3>
            <br />
            <div className="btn-toolbar justify-content-between">
                <button onClick={addHandler}>Add Product</button>
                <button onClick={() => navigate("/chart")}>Chart</button>
                <button onClick={handleCustomization}>Customization</button>
            </div>
            <div className="d-flex align-items-center my-3 justify-content-center">
                <label className="mt-3">Search</label>
                <input
                    value={searchKey}
                    onChange={(e) => setSearchKey(e.target.value)}
                    className="form-control mx-2"
                    placeholder="Search"
                />
                <label className="mt-3">Category</label>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <select
                    className="form-control mt-3"
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                >
                    <option value="All">All</option>
                    <option value="electronics">Electronics</option>
                    <option value="mobiles">Mobiles</option>
                    <option value="fashion">Fashion</option>
                </select>
            </div>
            <Table striped bordered hover variant="dark">
                <thead>
                    <tr>
                        <th width="200">Product Name</th>
                        {flagManufacturer && <th width="100">Manufacturer</th>}
                        {flagPrice && <th width="100">Price</th>}
                        {flagQuantity && <th width="100">Quantity</th>}
                        <th width="200">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {products
                        .filter((obj) =>
                            obj.name.toLowerCase().includes(searchKey.toLowerCase())
                        )
                        .filter((obj) =>
                            filterType === "All"
                                ? true
                                : obj.category.toLowerCase() === filterType.toLowerCase()
                        )
                        .map((product, index) => (
                            <tr key={index}>
                                <td>{product.name}</td>
                                {flagManufacturer && <td>{product.manufacturer}</td>}
                                {flagPrice && <td>{product.price}</td>}
                                {flagQuantity && <td>{product.quantity}</td>}
                                <td>
                                    <Button
                                        variant="primary"
                                        onClick={() => navigate(`/product/${product.id}`)}
                                    >
                                        View
                                    </Button>
                                    <Button variant="warning" onClick={() => editHandler(product)}>
                                        Edit
                                    </Button>
                                    <Button
                                        variant="danger"
                                        onClick={() => deleteProduct(product)}
                                    >
                                        Delete
                                    </Button>
                                </td>
                            </tr>
                        ))}
                </tbody>
            </Table>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{add ? "Add Product" : "Edit Product"}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="register-form">
                        <label htmlFor="name">Name</label>
                        <input
                            type="text"
                            value={product.name}
                            className="form-control"
                            placeholder="Name"
                            onChange={(e) =>
                                setProduct({ ...product, name: e.target.value })
                            }
                            required
                        />
                        <br />
                        <label htmlFor="description">Description</label>
                        <input
                            type="text"
                            value={product.description}
                            className="form-control"
                            placeholder="Description"
                            onChange={(e) =>
                                setProduct({ ...product, description: e.target.value })
                            }
                            required
                        />
                        <br />
                        <label htmlFor="manufacturer">Manufacturer</label>
                        <input
                            type="text"
                            value={product.manufacturer}
                            className="form-control"
                            placeholder="Manufacturer"
                            onChange={(e) =>
                                setProduct({ ...product, manufacturer: e.target.value })
                            }
                            required
                        />
                        <br />
                        <label htmlFor="price">Price</label>
                        <input
                            type="number"
                            value={product.price}
                            className="form-control"
                            placeholder="Price"
                            onChange={(e) =>
                                setProduct({ ...product, price: e.target.value })
                            }
                            required
                        />
                        <br />
                        <label htmlFor="quantity">Quantity</label>
                        <input
                            type="number"
                            value={product.quantity}
                            className="form-control"
                            placeholder="Quantity"
                            onChange={(e) =>
                                setProduct({ ...product, quantity: e.target.value })
                            }
                            required
                        />
                        <br />
                        <label htmlFor="url">Image URL</label>
                        <input
                            type="text"
                            value={product.imageURL}
                            className="form-control"
                            placeholder="Image URL"
                            onChange={(e) =>
                                setProduct({ ...product, imageURL: e.target.value })
                            }
                            required
                        />
                        <br />
                        <label htmlFor="category">Category</label>
                        <select
                            className="form-control"
                            required
                            value={product.category}
                            onChange={(e) =>
                                setProduct({ ...product, category: e.target.value })
                            }
                        >
                            <option value="">Select one option</option>
                            <option value="electronics">Electronics</option>
                            <option value="mobiles">Mobiles</option>
                            <option value="fashion">Fashion</option>
                        </select>
                        <br />
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <button onClick={handleClose}>Close</button>
                    {add ? (
                        <button type="submit" onClick={addProduct}>
                            SAVE
                        </button>
                    ) : (
                        <button type="submit" onClick={updateProduct}>
                            SAVE
                        </button>
                    )}
                </Modal.Footer>
            </Modal>
            {customization && (
                <FormControl component="fieldset">
                    <FormLabel component="legend">Customization of Viewing Products</FormLabel>
                    <FormGroup aria-label="position" row>
                        <FormControlLabel
                            value="start"
                            control={<Checkbox />}
                            label="Image"
                            labelPlacement="start"
                            checked={flagImage}
                            onChange={handleFlagImage}
                        />
                        <FormControlLabel
                            value="start"
                            control={<Checkbox />}
                            label="Manufacturer"
                            labelPlacement="start"
                            checked={flagManufacturer}
                            onChange={handleFlagManufacturer}
                        />
                        <FormControlLabel
                            value="start"
                            control={<Checkbox />}
                            label="Price"
                            labelPlacement="start"
                            checked={flagPrice}
                            onChange={handleFlagPrice}
                        />
                        <FormControlLabel
                            value="start"
                            control={<Checkbox />}
                            label="Quantity"
                            labelPlacement="start"
                            checked={flagQuantity}
                            onChange={handleFlagQuantity}
                        />
                    </FormGroup>
                </FormControl>
            )}
        </Layout>
    );
}

export default InventoryManagement;
