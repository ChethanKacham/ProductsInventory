import React, { useEffect, useState } from "react";
import { fireDB, auth } from "../firebaseConfig";
import Layout from "./Layout";
import { collection, getDocs } from "firebase/firestore";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import Loader from "./Loader";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function ChartComp() {
  const [loading, setLoading] = useState(false);
  const [getData, setGetData] = useState([]);
  const [graph, setGraph] = useState({});
  const [flag, setFlag] = useState(false);

  useEffect(() => {
    productData();
  }, []);

  const productData = async () => {
    setLoading(true);
    const response = await getDocs(collection(fireDB, "products"));
    const product_array = [];
    response.forEach((doc) => {
      const obj = {
        id: doc.id,
        ...doc.data(),
      };
      product_array.push(obj);
    });
    setGetData(product_array);
    setLoading(false);
  };

  useEffect(() => {
    if (flag) {
      selectChart();
    }
  }, [flag]);

  const selectChart = () => {
    getDocs(collection(fireDB, "products")).then((res) => {
      const product_array = [];
      res.forEach((doc) => {
        const obj = {
          id: doc.id,
          ...doc.data(),
        };
        product_array.push(obj);
      });

      let productName = [];
      let productViews = [];
      product_array.forEach((element) => {
        productName.push(element.name);
        productViews.push(element.count);
      });

      let productNames = [];
      productName.forEach((nam) => {
        let x = nam.split(" ").slice(0, 2).join(" ");
        productNames.push(x);
      });

      const labels = productNames;
      const view = productViews;

      let obj = {
        labels: labels,
        datasets: [
          {
            label: "Views",
            data: view,
            backgroundColor: ["rgba(220,220,220,0.5)", "navy", "red", "orange"],
            borderColor: "rgba(220,220,220,0.8)",
            hoverBackgroundColor: "rgba(220,220,220,0.75)",
            hoverBorderColor: "rgba(220,220,220,1)",
          },
        ],
      };
      setGraph(obj);
    });
  };

  return (
    <Layout loading={loading}>
      <div className="container">
        <h2 className="text-center">Products Views Analyst Chart</h2>
        <br />
        <div className="row mt-3">
          {graph && graph.labels ? (
            <Bar
              data={graph}
              options={{
                plugins: {
                  title: {
                    display: true,
                    text: "Product Views Analyst Chart",
                    font: { size: 25 },
                  },
                  legend: {
                    display: true,
                    position: "right",
                  },
                },
              }}
            />
          ) : (
            <Loader />
          )}
        </div>
      </div>
    </Layout>
  );
}

export default ChartComp;
