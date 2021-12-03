import React from "react";
import { Navigate } from "react-router-dom";
//components
import Navbar from "../components/Navbar";

const Home = (props) => (
  <div>
    <Navbar />
    <h1>This is Home</h1>
    {/* redirect to `/` if its not logged in*/}
    {props.isLogged === false ? <Navigate replace to="/" /> : null}
  </div>
);

export default Home;
