import React, { useEffect, useState } from "react";
import "../styles/ChartComp.css";
import Layout from "./Layout";
import Loader from "./Loader";
import { collection, getDocs } from "firebase/firestore";
import { fireDB } from "../firebaseConfig";
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

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function ChartComp() {
  const [loading, setLoading] = useState(false);
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    fetchChartData();
  }, []);

  const fetchChartData = async () => {
    try {
      setLoading(true);
      const querySnapshot = await getDocs(collection(fireDB, "products"));
      const productNames = [];
      const productViews = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        productNames.push(data.name);
        productViews.push(data.count);
      });

      setChartData({
        labels: productNames,
        datasets: [
          {
            label: "Product Views",
            data: productViews,
            backgroundColor: [
              "rgba(255, 99, 132, 0.6)",
              "rgba(54, 162, 235, 0.6)",
              "rgba(255, 206, 86, 0.6)",
              "rgba(75, 192, 192, 0.6)",
            ],
            borderColor: [
              "rgba(255, 99, 132, 1)",
              "rgba(54, 162, 235, 1)",
              "rgba(255, 206, 86, 1)",
              "rgba(75, 192, 192, 1)",
            ],
            borderWidth: 1,
          },
        ],
      });
      setLoading(false);
    } catch (error) {
      console.error("Error fetching chart data:", error);
      setLoading(false);
    }
  };

  return (
    <Layout loading={loading}>
      <div className="chart-container">
        <h2 className="chart-title">Product Views Analysis</h2>
        {loading ? (
          <Loader />
        ) : chartData ? (
          <Bar
            data={chartData}
            options={{
              responsive: true,
              plugins: {
                title: {
                  display: true,
                  text: "Product Views",
                  font: {
                    size: 20,
                  },
                },
                legend: {
                  display: true,
                  position: "top",
                },
              },
            }}
          />
        ) : (
          <p>No data available for the chart.</p>
        )}
      </div>
    </Layout>
  );
}

export default ChartComp;
