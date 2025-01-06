import React, { useEffect, useRef, useState } from 'react';
import Layout from './Layout';
import { getDoc, setDoc } from 'firebase/firestore';
import { doc } from 'firebase/firestore';
import { fireDB, auth } from "../firebaseConfig";
import { useParams } from 'react-router-dom';

function ProductInformation() {
  const [product, setProduct] = useState({});
  const params = useParams();
  const [loading, setLoading] = useState(false);
  const [viewProduct, setViewProduct] = useState({});
  const notInitialRender = useRef(false);

  useEffect(() => {
    if (notInitialRender.current) {
      getData();
    }
    notInitialRender.current = true;
  }, [viewProduct]);

  async function getData() {
    try {
      setLoading(true);
      const productTemp = await getDoc(doc(fireDB, 'Products', params.id));
      setProduct(productTemp.data());
      const countValue = await productTemp.data().count + 1;
      setViewProduct({ ...productTemp.data(), count: countValue });
      // console.log(productTemp.data());
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }

  return (
    <Layout loading={loading}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-8">
            {product && (
              <div>
                <p>
                  <b>{product.name}</b>
                </p>
                <hr />
                <div className="text-center">
                  <img
                    src={product.imageURL}
                    alt=""
                    className="product-img"
                  />
                </div>
                <hr />
                <p>
                  <b>Description:</b> {product.description}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default ProductInformation;
