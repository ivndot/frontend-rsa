import React from "react";
import { Navigate } from "react-router-dom";
//components
import Navbar from "../components/Navbar";
//requests
import { requestGenerateKeys } from "../util/requests";

const GenerateKeys = (props) => (
  <div>
    <Navbar />
    <h2>Genera un par de llaves</h2>
    <p>Presiona el bot&oacute;n de abajo para descargar una llave P&uacute;blica y Privada de 4096 bits</p>
    <button type="button" onClick={async () => await requestGenerateKeys()}>
      Generar llaves
    </button>
    {/* redirect to `/` if its not logged in*/}
    {props.isLogged === false ? <Navigate replace to="/" /> : null}
  </div>
);

export default GenerateKeys;
