import React from "react";
import { Button } from "@mantine/core";
import { useNavigate } from "react-router-dom";

export default function ErrorPage() {
  let navigate = useNavigate();
  return (
    <div>
      <div className="errorimage">
        <h1 className="text-center">404</h1>
      </div>
      <div className="contant-box">
        <h3 className="h2">Looks like you're lost</h3>
        <p>the page you're looking is'nt available</p>
      </div>
      <div
        style={{
          alignItems: "center",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Button color="Agile" onClick={() => navigate("/")}>
          Back to Dashboard
        </Button>
      </div>
    </div>
  );
}
