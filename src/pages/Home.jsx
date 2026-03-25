
import React from "react";
import Layout from "../components/Layout";

export default function Home() {
  

  return (
    <Layout>
      <div className="container">
        <style>
          {`
            .center-wrapper {
              min-height: 100vh;
              display: flex;
              justify-content: center;
              align-items: center;
            }
          `}
        </style>

        <div className="row justify-content-center align-items-center">
          <div className="col-md-8"></div>
        </div>
      </div>


    </Layout>
  );
}
