import React, { useState } from "react";
import { IoMdArrowRoundForward, IoMdArrowRoundBack } from "react-icons/io";
import Chart from "react-apexcharts";
import Styles from "./Dashboard.module.css";

export default function DashboardPage() {
  const [state, setState] = useState({
    options: {
      chart: {
        id: "IssuedBook",
      },
      xaxis: {
        categories: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      },
    },
    series: [
      {
        name: "Issued Book",
        data: [30, 40, 50, 60, 49, 60, 70, 91, 92, 85, 100, 60],
      },
    ],
  });

  const [pie, setPie] = useState({
    options: {},
    series: [44, 55, 41, 17, 15],
    labels: ['A', 'B', 'C', 'D', 'E'],
  });

  const [isSidebarVisible, setIsSidebarVisible] = useState(true);


  return (
    <section className="px-3 mt-3">
      <div className="row">
        <div className="col-md-6">
          <div className="card mb-4 shadow-sm">
            <div className="card-body">
              <h5 className="card-title">Monthly Book Issued</h5>
              <Chart
                options={state.options}
                series={state.series}
                type="bar"
                width="500"
              />
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card mb-4 shadow-sm">
            <div className="card-body">
              <h5 className="card-title">Genre Wise Book Issued</h5>
              <Chart options={pie.options} series={pie.series} type="donut" width="380" />
            </div>
          </div>
        </div>
      </div>

      <div className="card mb-4 shadow-sm">
        <div className="card-header">Recent Activities</div>
        <div className="card-body">
          <ul className="list-group">
            <li className="list-group-item">The book "Harry Potter" was issued to John Doe on dd/mm/yyyy and will be returned on dd/mm/yyyy.</li>
            <li className="list-group-item">Book "The Great Gatsby" issued to Jane Smith on dd/mm/yyyy and will be returned on dd/mm/yyyy.</li>
            <li className="list-group-item">Book "Alice Johnson" issued to Jane Smith on dd/mm/yyyy and will be returned on dd/mm/yyyy.</li>
          </ul>
        </div>
      </div>
    </section>
  );
}