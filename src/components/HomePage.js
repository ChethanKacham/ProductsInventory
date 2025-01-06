import React, { useState, useEffect } from 'react';
import Layout from './Layout';
import { collection, addDoc, getDocs } from "firebase/firestore";
import { fireDB, auth } from "../firebaseConfig";
import { useNavigate } from "react-router-dom";
import productList from "../productsList";

function HomePage() {
    const [products, setProducts] = useState([]);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [searchKey, setSearchKey] = useState("");
    const [filterType, setFilterType] = useState("");

    useEffect(() => {
        getData();
    }, []);

    async function getData() {
        try {
            setLoading(true);
            const products1 = await getDocs(collection(fireDB, "products"));
            const productArray = [];
            products1.forEach((doc) => {
                const obj = {
                    id: doc.id,
                    ...doc.data(),
                };
                productArray.push(obj);
            });
            setProducts(productArray);
            setLoading(false);
        } catch (error) {
            console.log(error);
            setLoading(false);
        }
    }

    /*
    function addProductsData() {
        productList.map(async (product) => {
            try {
                await addDoc(collection(fireDB, "products"), product);
            } catch (error) {
                console.log(error);
            }
        });
    }
    */

    return (
        <Layout loading={loading}>
            <div className="container">
                <div className="d-flex align-items-center my-3 justify-content-center">
                    <label className="mt-3">Search</label>
                    <input
                        type="text"
                        value={searchKey}
                        onChange={(e) => {
                            setSearchKey(e.target.value);
                        }}
                        className="form-control mx-2"
                        placeholder="Search"
                    />
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    <label className="mt-3">Category</label>
                    &nbsp;&nbsp;&nbsp;
                    <select
                        className="form-control mt-3"
                        value={filterType}
                        onChange={(e) => {
                            setFilterType(e.target.value);
                        }}
                    >
                        <option value="all">All</option>
                        <option value="electronics">Electronics</option>
                        <option value="mobiles">Mobiles</option>
                        <option value="fashion">Fashion</option>
                    </select>
                </div>
                <div className="row">
                    {products
                        .filter((obj) => obj.name.toLowerCase().includes(searchKey))
                        .filter((obj) =>
                            obj.category.toLowerCase().includes(filterType)
                        )
                        .map((product) => {
                            return (
                                <div className="col-md-4" key={product.id}>
                                    <div className="m-2 p-1 product position-relative">
                                        <div className="product-content">
                                            <p>{product.name}</p>
                                            <div className="text-center">
                                                <img
                                                    src={product.imageURL}
                                                    alt=""
                                                    className="product-img"
                                                />
                                            </div>
                                        </div>
                                        <div className="product-actions">
                                            <h2>{product.price} RS /-</h2>
                                            <div className="d-flex">
                                                <button
                                                    onClick={() => {
                                                        navigate(`/product/${product.id}`);
                                                    }}
                                                >
                                                    View
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                </div>
            </div>
        </Layout>
    );
}

export default HomePage;
